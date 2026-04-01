import { getDashboardSummary, type PeriodType } from "./summary";
import { getDimensionMetrics } from "./dimensions";

export async function generateExportCsv(
  facilityId: string,
  periodType: PeriodType,
  year?: number,
  month?: number
): Promise<string> {
  const summary = await getDashboardSummary({ facilityId, periodType, year, month });

  const lines: string[] = [];
  lines.push("指標,値");

  if (summary) {
    lines.push(`利用回数,${summary.usageCount}`);
    lines.push(`ユニーク利用者数,${summary.uniqueUserCount}`);
    lines.push(`新規率(%),${summary.newRate}`);
    lines.push(`リピート率(%),${summary.repeatRate}`);
    lines.push(`平均利用間隔(日),${summary.averageUsageIntervalDays ?? ""}`);
    lines.push(`継続率(%),${summary.repeatContinuationRate ?? ""}`);
    lines.push(`平均利用回数/人,${summary.avgUsesPerUser ?? ""}`);
    lines.push(`2回目利用中央値(日),${summary.secondUseMedianDays ?? ""}`);
  }

  lines.push("");
  lines.push("年代分布");
  lines.push("年代,利用回数,割合(%)");
  const ageDist = await getDimensionMetrics({ facilityId, periodType, dimensionType: "age_bucket", year, month });
  for (const d of ageDist) {
    lines.push(`${d.dimensionValue},${d.usageCount},${d.percentage ?? ""}`);
  }

  lines.push("");
  lines.push("来店目的");
  lines.push("目的,利用回数,割合(%)");
  const purposeDist = await getDimensionMetrics({ facilityId, periodType, dimensionType: "visit_purpose", year, month });
  for (const d of purposeDist) {
    lines.push(`${d.dimensionValue},${d.usageCount},${d.percentage ?? ""}`);
  }

  lines.push("");
  lines.push("利用きっかけ");
  lines.push("きっかけ,利用回数,割合(%)");
  const triggerDist = await getDimensionMetrics({ facilityId, periodType, dimensionType: "usage_trigger", year, month });
  for (const d of triggerDist) {
    lines.push(`${d.dimensionValue},${d.usageCount},${d.percentage ?? ""}`);
  }

  lines.push("");
  lines.push("居住地上位");
  lines.push("市区町村,利用回数,割合(%)");
  const cityDist = await getDimensionMetrics({ facilityId, periodType, dimensionType: "city", year, month, limit: 10 });
  for (const d of cityDist) {
    lines.push(`${d.dimensionValue},${d.usageCount},${d.percentage ?? ""}`);
  }

  return "\uFEFF" + lines.join("\n");
}
