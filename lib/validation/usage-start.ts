import { z } from "zod";

export const usageStartSchema = z.object({
  phone: z
    .string()
    .min(1, "電話番号を入力してください")
    .max(20),
  hasUsedBefore: z.enum(["yes", "no"], {
    error: "選択してください",
  }),
  nickname: z
    .string()
    .min(1, "ニックネームを入力してください")
    .max(100),
  city: z
    .string()
    .min(1, "市区町村を入力してください")
    .max(100),
  birthDate: z
    .string()
    .min(1, "生年月日を入力してください"),
  visitPurpose: z.enum(
    ["shopping", "dining", "work_commute", "meeting", "other"],
    { error: "選択してください" }
  ),
  usageTrigger: z.enum(
    ["rain_humidity", "wind", "sweat", "before_date", "work", "just_style"],
    { error: "選択してください" }
  ),
  deviceId: z
    .string()
    .min(1, "デバイスIDが必要です"),
});

export type UsageStartInput = z.infer<typeof usageStartSchema>;

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
