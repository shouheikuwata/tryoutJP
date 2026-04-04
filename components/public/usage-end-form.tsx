"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { usageEndSchema, type UsageEndInput } from "@/lib/validation/usage-end";
import { Button } from "@/components/ui/button";

export default function UsageEndForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deviceId = searchParams.get("deviceId") || "";

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<UsageEndInput>({
    resolver: zodResolver(usageEndSchema) as any,
    defaultValues: { deviceId },
  });

  const onSubmit = async (data: UsageEndInput) => {
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/usage/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setServerError(err.error?.message || "送信に失敗しました。");
        return;
      }
      router.push("/usage/end/complete");
    } catch {
      setServerError("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register("deviceId")} />

      {/* 電源確認 */}
      <div className="space-y-1.5">
        <span className="block text-sm font-medium text-foreground">
          ヘアアイロンの電源は切りましたか？ *
        </span>
        <p className="text-xs text-muted-foreground">
          電源は切ってからお帰りください
        </p>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            value="yes"
            {...register("powerOff")}
            className="h-4 w-4 border-input text-primary focus:ring-primary"
          />
          切った
        </label>
        {errors.powerOff && (
          <p className="text-sm text-destructive">{errors.powerOff.message}</p>
        )}
      </div>

      {/* お買い物確認 */}
      <div className="space-y-1.5">
        <span className="block text-sm font-medium text-foreground">
          このショップにてお買い物はされましたか？ *
        </span>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="yes"
              {...register("didShopping")}
              className="h-4 w-4 border-input text-primary focus:ring-primary"
            />
            しました
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="no"
              {...register("didShopping")}
              className="h-4 w-4 border-input text-primary focus:ring-primary"
            />
            していない
          </label>
        </div>
        {errors.didShopping && (
          <p className="text-sm text-destructive">{errors.didShopping.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        variant="destructive"
        disabled={submitting || !deviceId}
      >
        {submitting ? "送信中..." : "利用を終了する"}
      </Button>
    </form>
  );
}
