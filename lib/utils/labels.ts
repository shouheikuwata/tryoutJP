/** Dimension value → Japanese display label mappings */

export const AGE_BUCKET_LABELS: Record<string, string> = {
  under_20: "20歳未満",
  age_20_24: "20〜24歳",
  age_25_29: "25〜29歳",
  age_30_34: "30〜34歳",
  age_35_39: "35〜39歳",
  age_40_49: "40〜49歳",
  age_50_plus: "50歳以上",
  unknown: "不明",
};

export const VISIT_PURPOSE_LABELS: Record<string, string> = {
  shopping: "買い物",
  dining: "食事",
  work_commute: "仕事・通勤",
  event: "イベント",
  meeting: "待ち合わせ",
  other: "その他",
};

export const USAGE_TRIGGER_LABELS: Record<string, string> = {
  rain_humidity: "雨・湿気",
  wind: "風",
  sweat: "汗",
  before_date: "デート前",
  before_after_work: "仕事前後",
  before_event: "イベント前",
  before_photo: "写真撮影前",
  just_refresh: "なんとなく整えたい",
  other: "その他",
};

export const REPEAT_FREQUENCY_LABELS: Record<string, string> = {
  once: "1回",
  twice: "2回",
  three_to_five: "3〜5回",
  six_to_ten: "6〜10回",
  eleven_plus: "11回以上",
};

export const SECOND_USE_LAG_LABELS: Record<string, string> = {
  within_7_days: "7日以内",
  within_30_days: "30日以内",
  within_90_days: "90日以内",
  after_90_days: "90日超",
  no_second_use: "2回目なし",
};

/** Convert a dimension value to its Japanese label */
export function toJapaneseLabel(dimensionType: string, value: string): string {
  switch (dimensionType) {
    case "age_bucket":
      return AGE_BUCKET_LABELS[value] ?? value;
    case "visit_purpose":
      return VISIT_PURPOSE_LABELS[value] ?? value;
    case "usage_trigger":
      return USAGE_TRIGGER_LABELS[value] ?? value;
    case "repeat_frequency_bucket":
      return REPEAT_FREQUENCY_LABELS[value] ?? value;
    case "second_use_lag_bucket":
      return SECOND_USE_LAG_LABELS[value] ?? value;
    case "hour_of_day":
      return `${value}時`;
    case "weekday":
      return value; // already Japanese
    case "city":
      return value; // already Japanese
    default:
      return value;
  }
}
