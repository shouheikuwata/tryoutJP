import { z } from "zod";

export const usageEndSchema = z.object({
  powerOff: z.literal("yes", {
    error: "電源を切ったことを確認してください",
  }),
  didShopping: z.enum(["yes", "no"], {
    error: "選択してください",
  }),
  deviceId: z.string({ error: "デバイスIDが必要です" }).min(1, "デバイスIDが必要です"),
});

export type UsageEndInput = z.infer<typeof usageEndSchema>;
