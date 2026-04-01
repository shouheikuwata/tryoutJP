import { differenceInYears, parse } from "date-fns";

export type AgeBucket =
  | "under_20"
  | "age_20_24"
  | "age_25_29"
  | "age_30_34"
  | "age_35_39"
  | "age_40_49"
  | "age_50_plus"
  | "unknown";

/** Calculate age bucket from birth date */
export function calculateAgeBucket(birthDate: Date, referenceDate: Date = new Date()): AgeBucket {
  const age = differenceInYears(referenceDate, birthDate);
  if (age < 20) return "under_20";
  if (age < 25) return "age_20_24";
  if (age < 30) return "age_25_29";
  if (age < 35) return "age_30_34";
  if (age < 40) return "age_35_39";
  if (age < 50) return "age_40_49";
  return "age_50_plus";
}

/** Parse Japanese date format YYYY/MM/DD */
export function parseJapaneseDate(dateStr: string): Date | null {
  try {
    const parsed = parse(dateStr.trim(), "yyyy/MM/dd", new Date());
    if (isNaN(parsed.getTime())) return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Parse Japanese datetime format YYYY/MM/DD HH:mm:ss */
export function parseJapaneseDateTime(datetimeStr: string): Date | null {
  try {
    const parsed = parse(datetimeStr.trim(), "yyyy/MM/dd HH:mm:ss", new Date());
    if (isNaN(parsed.getTime())) return null;
    return parsed;
  } catch {
    return null;
  }
}

export const AGE_BUCKET_LABELS: Record<AgeBucket, string> = {
  under_20: "20歳未満",
  age_20_24: "20-24",
  age_25_29: "25-29",
  age_30_34: "30-34",
  age_35_39: "35-39",
  age_40_49: "40-49",
  age_50_plus: "50以上",
  unknown: "不明",
};
