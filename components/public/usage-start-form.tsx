"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  usageStartSchema,
  type UsageStartInput,
  visitPurposeOptions,
  usageTriggerOptions,
} from "@/lib/validation/usage-start";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UsageStartForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const deviceId = searchParams.get("deviceId") || "";

  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<UsageStartInput>({
    resolver: zodResolver(usageStartSchema) as any,
    defaultValues: { deviceId },
  });

  const hasUsedBefore = watch("hasUsedBefore");
  const showUserInfo = hasUsedBefore === "no";

  const onSubmit = async (data: UsageStartInput) => {
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/usage/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setServerError(err.error?.message || "送信に失敗しました。");
        return;
      }
      router.push("/usage/start/complete");
    } catch {
      setServerError("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Hidden device ID */}
      <input type="hidden" {...register("deviceId")} />

      {/* Phone */}
      <Input
        label="電話番号 *"
        id="phone"
        type="tel"
        placeholder="09012345678"
        {...register("phone")}
        error={errors.phone?.message}
      />

      {/* Has used before */}
      <div className="space-y-1.5">
        <span className="block text-sm font-medium text-foreground">
          このヘアアイロンを使ったことがありますか？ *
        </span>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="yes"
              {...register("hasUsedBefore")}
              className="h-4 w-4 border-input text-primary focus:ring-primary"
            />
            ある
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              value="no"
              {...register("hasUsedBefore")}
              className="h-4 w-4 border-input text-primary focus:ring-primary"
            />
            ない
          </label>
        </div>
        {errors.hasUsedBefore && (
          <p className="text-sm text-destructive">{errors.hasUsedBefore.message}</p>
        )}
      </div>

      {/* Section: User Info — only shown when "ない" is selected */}
      {showUserInfo && (
        <div className="border-t border-border/40 pt-6">
          <h2 className="mb-4 text-lg font-semibold">
            利用者情報を少しだけ教えてください
          </h2>

          <div className="space-y-6">
            <Input
              label="ニックネーム *"
              id="nickname"
              placeholder="はなこ"
              {...register("nickname")}
              error={errors.nickname?.message}
            />

            <Input
              label="住所（市区町村レベル） *"
              id="city"
              placeholder="渋谷区"
              {...register("city")}
              error={errors.city?.message}
            />

            <Input
              label="生年月日 *"
              id="birthDate"
              type="date"
              {...register("birthDate")}
              error={errors.birthDate?.message}
            />

            {/* Visit Purpose */}
            <div className="space-y-1.5">
              <span className="block text-sm font-medium text-foreground">
                施設への来訪目的は？ *
              </span>
              <div className="flex flex-col gap-2">
                {visitPurposeOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      value={opt.value}
                      {...register("visitPurpose")}
                      className="h-4 w-4 border-input text-primary focus:ring-primary"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              {errors.visitPurpose && (
                <p className="text-sm text-destructive">{errors.visitPurpose.message}</p>
              )}
            </div>

            {/* Usage Trigger */}
            <div className="space-y-1.5">
              <span className="block text-sm font-medium text-foreground">
                使おうと思ったきっかけは？ *
              </span>
              <div className="flex flex-col gap-2">
                {usageTriggerOptions.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      value={opt.value}
                      {...register("usageTrigger")}
                      className="h-4 w-4 border-input text-primary focus:ring-primary"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              {errors.usageTrigger && (
                <p className="text-sm text-destructive">{errors.usageTrigger.message}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={submitting || !hasUsedBefore}>
        {submitting ? "送信中..." : "利用を開始する"}
      </Button>
    </form>
  );
}
