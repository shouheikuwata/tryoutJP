import { z } from "zod";

const baseSchema = z.object({
  phone: z
    .string({ error: "電話番号を入力してください" })
    .min(1, "電話番号を入力してください")
    .max(20, "電話番号が長すぎます"),
  hasUsedBefore: z.enum(["yes", "no"], {
    error: "選択してください",
  }),
  deviceId: z
    .string({ error: "デバイスIDが必要です" })
    .min(1, "デバイスIDが必要です"),
  nickname: z.string({ error: "ニックネームを入力してください" }).max(100, "100文字以内で入力してください").optional().default(""),
  city: z.string({ error: "市区町村を入力してください" }).max(100, "100文字以内で入力してください").optional().default(""),
  birthDate: z.string({ error: "生年月日を入力してください" }).optional().default(""),
  visitPurpose: z.string({ error: "選択してください" }).optional().default(""),
  usageTrigger: z.string({ error: "選択してください" }).optional().default(""),
});

/** "ない" の場合は追加項目を必須にする */
export const usageStartSchema = baseSchema.superRefine((data, ctx) => {
  if (data.hasUsedBefore === "no") {
    if (!data.nickname) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "ニックネームを入力してください", path: ["nickname"] });
    }
    if (!data.city) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "市区町村を入力してください", path: ["city"] });
    }
    if (!data.birthDate) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "生年月日を入力してください", path: ["birthDate"] });
    }
    if (!data.visitPurpose) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "選択してください", path: ["visitPurpose"] });
    }
    if (!data.usageTrigger) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "選択してください", path: ["usageTrigger"] });
    }
  }
});

export type UsageStartInput = z.infer<typeof baseSchema>;

export const visitPurposeOptions = [
  { value: "shopping", label: "買い物" },
  { value: "dining", label: "食事" },
  { value: "work_commute", label: "仕事・通勤" },
  { value: "meeting", label: "待ち合わせ" },
  { value: "other", label: "その他" },
];

export const usageTriggerOptions = [
  { value: "rain_humidity", label: "雨・湿気" },
  { value: "wind", label: "風" },
  { value: "sweat", label: "汗" },
  { value: "before_date", label: "デート前" },
  { value: "work", label: "仕事前後" },
  { value: "just_style", label: "なんとなく整えたい" },
];
