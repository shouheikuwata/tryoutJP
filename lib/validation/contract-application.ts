import { z } from "zod";

export const contractApplicationSchema = z.object({
  companyName: z.string().min(1, "会社名を入力してください").max(255),
  departmentName: z.string().max(255).optional().default(""),
  contactName: z.string().min(1, "担当者名を入力してください").max(255),
  email: z.string().email("正しいメールアドレスを入力してください").max(255),
  phone: z.string().max(20).optional().default(""),
  facilityName: z.string().min(1, "施設名を入力してください").max(255),
  facilityPrefecture: z.string().max(50).optional().default(""),
  facilityCity: z.string().max(100).optional().default(""),
  facilityAddress: z.string().max(255).optional().default(""),
  industry: z.string().max(100).optional().default(""),
  desiredUnitCount: z.coerce.number().int().min(1).max(100).optional(),
  desiredInstallationArea: z.string().max(255).optional().default(""),
  desiredStartTiming: z.string().max(100).optional().default(""),
  note: z.string().max(2000).optional().default(""),
  agreedTerms: z.literal(true, { message: "利用規約への同意が必要です" }),
  agreedPrivacy: z.literal(true, { message: "個人情報取扱への同意が必要です" }),
});

export type ContractApplicationInput = z.infer<typeof contractApplicationSchema>;
