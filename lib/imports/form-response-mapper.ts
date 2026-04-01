/** CSV column headers (exact match required) */
export const EXPECTED_HEADERS = [
  "タイムスタンプ",
  "電話番号",
  "このヘアアイロンを利用したことはありますか？",
  "ニックネーム",
  "住所：市区町村まで",
  "生年月日",
  "本施設への目的はなんですか？",
  "利用きっかけ",
  "デバイスID：触らないでください",
] as const;

/** Visit purpose mapping: Japanese → enum */
export const VISIT_PURPOSE_MAP: Record<string, string> = {
  "買い物": "shopping",
  "食事": "dining",
  "仕事・通勤": "work_commute",
  "イベント": "event",
  "待ち合わせ": "meeting",
  "その他": "other",
};

/** Usage trigger mapping: Japanese → enum */
export const USAGE_TRIGGER_MAP: Record<string, string> = {
  "雨・湿気": "rain_humidity",
  "風": "wind",
  "汗": "sweat",
  "デート前": "before_date",
  "仕事前後": "before_after_work",
  "イベント前": "before_event",
  "写真撮影前": "before_photo",
  "なんとなく整えたい": "just_refresh",
  "その他": "other",
};

/** Parse "used before" answer */
export function parseUsedBefore(text: string): boolean | null {
  const normalized = text.trim();
  if (normalized === "ある" || normalized === "はい" || normalized === "yes") return true;
  if (normalized === "ない" || normalized === "いいえ" || normalized === "no") return false;
  return null;
}

export function mapVisitPurpose(text: string): string | null {
  return VISIT_PURPOSE_MAP[text.trim()] ?? null;
}

export function mapUsageTrigger(text: string): string | null {
  return USAGE_TRIGGER_MAP[text.trim()] ?? null;
}
