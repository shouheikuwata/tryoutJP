import { prisma } from "@/lib/db/prisma";
import type { PeriodType } from "./summary";

interface DimensionParams {
  facilityId: string;
  periodType: PeriodType;
  dimensionType: string;
  year?: number;
  month?: number;
  limit?: number;
}

export async function getDimensionMetrics(params: DimensionParams) {
  const { facilityId, periodType, dimensionType, year, month, limit } = params;

  if (periodType === "monthly" && year && month) {
    return prisma.facilityMonthlyDimensionMetric.findMany({
      where: { facilityId, metricYear: year, metricMonth: month, dimensionType },
      orderBy: { usageCount: "desc" },
      take: limit,
    });
  }

  if (periodType === "yearly" && year) {
    return prisma.facilityYearlyDimensionMetric.findMany({
      where: { facilityId, metricYear: year, dimensionType },
      orderBy: { usageCount: "desc" },
      take: limit,
    });
  }

  if (periodType === "cumulative") {
    return prisma.facilityCumulativeDimensionMetric.findMany({
      where: { facilityId, dimensionType },
      orderBy: { usageCount: "desc" },
      take: limit,
    });
  }

  return [];
}
