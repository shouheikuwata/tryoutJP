import { prisma } from "@/lib/db/prisma";

export type PeriodType = "monthly" | "yearly" | "cumulative";

interface SummaryParams {
  facilityId: string;
  periodType: PeriodType;
  year?: number;
  month?: number;
}

export async function getDashboardSummary(params: SummaryParams) {
  const { facilityId, periodType, year, month } = params;

  if (periodType === "monthly" && year && month) {
    const metric = await prisma.facilityMonthlyMetric.findUnique({
      where: {
        facilityId_metricYear_metricMonth: {
          facilityId,
          metricYear: year,
          metricMonth: month,
        },
      },
    });
    return metric
      ? {
          usageCount: metric.usageCount,
          uniqueUserCount: metric.uniqueUserCount,
          newRate: Number(metric.newRate),
          repeatRate: Number(metric.repeatRate),
          averageUsageIntervalDays: metric.averageUsageIntervalDays ? Number(metric.averageUsageIntervalDays) : null,
          repeatContinuationRate: metric.repeatContinuationRate ? Number(metric.repeatContinuationRate) : null,
          avgUsesPerUser: metric.avgUsesPerUser ? Number(metric.avgUsesPerUser) : null,
          secondUseMedianDays: metric.secondUseMedianDays ? Number(metric.secondUseMedianDays) : null,
        }
      : null;
  }

  if (periodType === "yearly" && year) {
    const metric = await prisma.facilityYearlyMetric.findUnique({
      where: { facilityId_metricYear: { facilityId, metricYear: year } },
    });
    return metric
      ? {
          usageCount: metric.usageCount,
          uniqueUserCount: metric.uniqueUserCount,
          newRate: Number(metric.newRate),
          repeatRate: Number(metric.repeatRate),
          averageUsageIntervalDays: metric.averageUsageIntervalDays ? Number(metric.averageUsageIntervalDays) : null,
          repeatContinuationRate: metric.repeatContinuationRate ? Number(metric.repeatContinuationRate) : null,
          avgUsesPerUser: metric.avgUsesPerUser ? Number(metric.avgUsesPerUser) : null,
          secondUseMedianDays: metric.secondUseMedianDays ? Number(metric.secondUseMedianDays) : null,
        }
      : null;
  }

  if (periodType === "cumulative") {
    const metric = await prisma.facilityCumulativeMetric.findUnique({
      where: { facilityId },
    });
    return metric
      ? {
          usageCount: metric.usageCount,
          uniqueUserCount: metric.uniqueUserCount,
          newRate: Number(metric.newRate),
          repeatRate: Number(metric.repeatRate),
          averageUsageIntervalDays: metric.averageUsageIntervalDays ? Number(metric.averageUsageIntervalDays) : null,
          repeatContinuationRate: metric.repeatContinuationRate ? Number(metric.repeatContinuationRate) : null,
          avgUsesPerUser: metric.avgUsesPerUser ? Number(metric.avgUsesPerUser) : null,
          secondUseMedianDays: metric.secondUseMedianDays ? Number(metric.secondUseMedianDays) : null,
        }
      : null;
  }

  return null;
}
