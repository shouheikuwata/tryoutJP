import Papa from "papaparse";
import { EXPECTED_HEADERS } from "./form-response-mapper";

export interface ParsedRow {
  rowNumber: number;
  timestamp: string;
  phone: string;
  usedBefore: string;
  nickname: string;
  city: string;
  birthDate: string;
  visitPurpose: string;
  usageTrigger: string;
  externalDeviceId: string;
}

export interface ParseResult {
  rows: ParsedRow[];
  errors: { rowNumber: number; message: string }[];
  missingHeaders: string[];
}

export function parseFormResponseCsv(csvContent: string): ParseResult {
  const result = Papa.parse(csvContent, {
    header: true,
    skipEmptyLines: true,
  });

  const headers = result.meta.fields ?? [];
  const missingHeaders = EXPECTED_HEADERS.filter((h) => !headers.includes(h));

  if (missingHeaders.length > 0) {
    return { rows: [], errors: [], missingHeaders };
  }

  const rows: ParsedRow[] = [];
  const errors: { rowNumber: number; message: string }[] = [];

  for (let i = 0; i < result.data.length; i++) {
    const raw = result.data[i] as Record<string, string>;
    const rowNumber = i + 2; // 1-indexed, skip header

    rows.push({
      rowNumber,
      timestamp: raw["タイムスタンプ"] ?? "",
      phone: raw["電話番号"] ?? "",
      usedBefore: raw["このヘアアイロンを利用したことはありますか？"] ?? "",
      nickname: raw["ニックネーム"] ?? "",
      city: raw["住所：市区町村まで"] ?? "",
      birthDate: raw["生年月日"] ?? "",
      visitPurpose: raw["本施設への目的はなんですか？"] ?? "",
      usageTrigger: raw["利用きっかけ"] ?? "",
      externalDeviceId: raw["デバイスID：触らないでください"] ?? "",
    });
  }

  if (result.errors.length > 0) {
    for (const e of result.errors) {
      errors.push({ rowNumber: (e.row ?? 0) + 2, message: e.message });
    }
  }

  return { rows, errors, missingHeaders: [] };
}
