"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { contractApplicationSchema, type ContractApplicationInput } from "@/lib/validation/contract-application";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const industries = [
  { value: "百貨店", label: "百貨店" },
  { value: "商業施設", label: "商業施設" },
  { value: "複合施設", label: "複合施設" },
  { value: "ホテル", label: "ホテル" },
  { value: "その他", label: "その他" },
];

export default function ContractApplicationForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(contractApplicationSchema) as any,
  });

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/contract-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        setServerError(err.error?.message || "送信に失敗しました。");
        return;
      }
      router.push("/contract-application/complete");
    } catch {
      setServerError("送信に失敗しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-lg border border-primary/20 bg-secondary/30 p-4 text-sm text-foreground">
        契約申込フォームです。入力内容を確認のうえ送信してください。
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Input label="会社名 *" id="companyName" {...register("companyName")} error={errors.companyName?.message as string} />
        <Input label="部署名" id="departmentName" {...register("departmentName")} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Input label="担当者名 *" id="contactName" {...register("contactName")} error={errors.contactName?.message as string} />
        <Input label="メールアドレス *" id="email" type="email" {...register("email")} error={errors.email?.message as string} />
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Input label="電話番号" id="phone" {...register("phone")} />
        <Input label="施設名 *" id="facilityName" {...register("facilityName")} error={errors.facilityName?.message as string} />
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <Input label="都道府県" id="facilityPrefecture" {...register("facilityPrefecture")} />
        <Input label="市区町村" id="facilityCity" {...register("facilityCity")} />
        <Input label="番地" id="facilityAddress" {...register("facilityAddress")} />
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        <Select label="業種" id="industry" options={industries} placeholder="選択してください" {...register("industry")} />
        <Input label="導入希望台数" id="desiredUnitCount" type="number" min={1} max={100} {...register("desiredUnitCount")} />
        <Input label="導入希望時期" id="desiredStartTiming" {...register("desiredStartTiming")} />
      </div>
      <Input label="設置希望場所" id="desiredInstallationArea" {...register("desiredInstallationArea")} />
      <Textarea label="備考" id="note" rows={4} {...register("note")} />

      <div className="space-y-3 rounded-lg border border-border bg-white p-6">
        <Checkbox
          id="agreedTerms"
          {...register("agreedTerms")}
          error={errors.agreedTerms?.message as string}
          label={<><Link href="/terms" target="_blank" className="text-primary underline">利用規約</Link>に同意します</>}
        />
        <Checkbox
          id="agreedPrivacy"
          {...register("agreedPrivacy")}
          error={errors.agreedPrivacy?.message as string}
          label={<><Link href="/privacy-policy" target="_blank" className="text-primary underline">プライバシーポリシー</Link>に同意します</>}
        />
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "送信中..." : "契約申込を送信"}
      </Button>
    </form>
  );
}
