import { normalizePhone, hashPhone } from "@/lib/encryption/phone-hash";
import { parseJapaneseDate, parseJapaneseDateTime, calculateAgeBucket } from "@/lib/utils/date";
import { mapVisitPurpose, mapUsageTrigger, parseUsedBefore } from "./form-response-mapper";
import type { ParsedRow } from "./form-response-parser";

export interface ValidatedRow {
  rowNumber: number;
  normalizedPhone: string;
  phoneHash: string;
  normalizedTimestamp: Date;
  birthDate: Date;
  ageBucket: string;
  birthYear: number;
  hasUsedBefore: boolean | null;
  nickname: string;
  city: string;
  visitPurpose: string;
  usageTrigger: string;
  externalDeviceId: string;
  // Raw texts for import row
  sourceTimestampText: string;
  phoneText: string;
  usedBeforeText: string;
  nicknameText: string;
  cityText: string;
  birthDateText: string;
  visitPurposeText: string;
  usageTriggerText: string;
  externalDeviceIdText: string;
}

export interface ValidationError {
  rowNumber: number;
  field: string;
  reason: string;
  message: string;
}

export function validateRow(row: ParsedRow): { data?: ValidatedRow; error?: ValidationError } {
  // Validate timestamp
  const ts = parseJapaneseDateTime(row.timestamp);
  if (!ts) {
    return { error: { rowNumber: row.rowNumber, field: "タイムスタンプ", reason: "invalid_timestamp", message: `タイムスタンプ形式が不正: ${row.timestamp}` } };
  }

  // Validate phone
  const normalizedPhone = normalizePhone(row.phone);
  if (normalizedPhone.length < 10 || normalizedPhone.length > 11) {
    return { error: { rowNumber: row.rowNumber, field: "電話番号", reason: "invalid_phone", message: `電話番号が不正: ${row.phone}` } };
  }

  // Validate birth date
  const bd = parseJapaneseDate(row.birthDate);
  if (!bd) {
    return { error: { rowNumber: row.rowNumber, field: "生年月日", reason: "invalid_date", message: `生年月日形式が不正: ${row.birthDate}` } };
  }

  // Validate visit purpose
  const visitPurpose = mapVisitPurpose(row.visitPurpose);
  if (!visitPurpose) {
    return { error: { rowNumber: row.rowNumber, field: "本施設への目的はなんですか？", reason: "unknown_option", message: `来店目的が不明: ${row.visitPurpose}` } };
  }

  // Validate usage trigger
  const usageTrigger = mapUsageTrigger(row.usageTrigger);
  if (!usageTrigger) {
    return { error: { rowNumber: row.rowNumber, field: "利用きっかけ", reason: "unknown_option", message: `利用きっかけが不明: ${row.usageTrigger}` } };
  }

  const ageBucket = calculateAgeBucket(bd, ts);

  return {
    data: {
      rowNumber: row.rowNumber,
      normalizedPhone,
      phoneHash: hashPhone(normalizedPhone),
      normalizedTimestamp: ts,
      birthDate: bd,
      ageBucket,
      birthYear: bd.getFullYear(),
      hasUsedBefore: parseUsedBefore(row.usedBefore),
      nickname: row.nickname.trim(),
      city: row.city.trim(),
      visitPurpose,
      usageTrigger,
      externalDeviceId: row.externalDeviceId.trim(),
      sourceTimestampText: row.timestamp,
      phoneText: row.phone,
      usedBeforeText: row.usedBefore,
      nicknameText: row.nickname,
      cityText: row.city,
      birthDateText: row.birthDate,
      visitPurposeText: row.visitPurpose,
      usageTriggerText: row.usageTrigger,
      externalDeviceIdText: row.externalDeviceId,
    },
  };
}
