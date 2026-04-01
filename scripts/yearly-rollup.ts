/**
 * Yearly rollup job
 * Aggregates monthly metrics into yearly metrics
 * Run: npx tsx scripts/yearly-rollup.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("[yearly-rollup] Starting...");

  const year = new Date().getFullYear();

  const facilities = await prisma.facility.findMany({
    where: { status: "active", deletedAt: null },
  });

  for (const facility of facilities) {
    try {
      const monthlyMetrics = await prisma.facilityMonthlyMetric.findMany({
        where: { facilityId: facility.id, metricYear: year },
      });

      if (monthlyMetrics.length === 0) continue;

      const usageCount = monthlyMetrics.reduce((s, m) => s + m.usageCount, 0);
      const uniqueUserCount = monthlyMetrics.reduce((s, m) => s + m.uniqueUserCount, 0);
      const newUserCount = monthlyMetrics.reduce((s, m) => s + m.newUserCount, 0);
      const repeatUserCount = monthlyMetrics.reduce((s, m) => s + m.repeatUserCount, 0);
      const repeatRate = uniqueUserCount > 0 ? (repeatUserCount / uniqueUserCount) * 100 : 0;
      const newRate = uniqueUserCount > 0 ? (newUserCount / uniqueUserCount) * 100 : 0;
      const avgUsesPerUser = uniqueUserCount > 0 ? usageCount / uniqueUserCount : 0;

      await prisma.facilityYearlyMetric.upsert({
        where: {
          facilityId_metricYear: { facilityId: facility.id, metricYear: year },
        },
        create: {
          facilityId: facility.id,
          metricYear: year,
          usageCount,
          uniqueUserCount,
          newUserCount,
          repeatUserCount,
          repeatRate,
          newRate,
          avgUsesPerUser,
        },
        update: {
          usageCount,
          uniqueUserCount,
          newUserCount,
          repeatUserCount,
          repeatRate,
          newRate,
          avgUsesPerUser,
        },
      });

      // Yearly dimension metrics from monthly dimensions
      const monthlyDims = await prisma.facilityMonthlyDimensionMetric.findMany({
        where: { facilityId: facility.id, metricYear: year },
      });

      const dimBuckets: Record<string, Record<string, { count: number; users: number }>> = {};
      for (const md of monthlyDims) {
        if (!dimBuckets[md.dimensionType]) dimBuckets[md.dimensionType] = {};
        if (!dimBuckets[md.dimensionType][md.dimensionValue]) {
          dimBuckets[md.dimensionType][md.dimensionValue] = { count: 0, users: 0 };
        }
        dimBuckets[md.dimensionType][md.dimensionValue].count += md.usageCount;
        dimBuckets[md.dimensionType][md.dimensionValue].users += md.uniqueUserCount;
      }

      for (const [dimType, values] of Object.entries(dimBuckets)) {
        const totalCount = Object.values(values).reduce((s, v) => s + v.count, 0);
        for (const [dimValue, data] of Object.entries(values)) {
          const pct = totalCount > 0 ? (data.count / totalCount) * 100 : 0;
          await prisma.facilityYearlyDimensionMetric.upsert({
            where: {
              facilityId_metricYear_dimensionType_dimensionValue: {
                facilityId: facility.id,
                metricYear: year,
                dimensionType: dimType,
                dimensionValue: dimValue,
              },
            },
            create: {
              facilityId: facility.id,
              metricYear: year,
              dimensionType: dimType,
              dimensionValue: dimValue,
              usageCount: data.count,
              uniqueUserCount: data.users,
              percentage: Number(pct.toFixed(1)),
            },
            update: {
              usageCount: data.count,
              uniqueUserCount: data.users,
              percentage: Number(pct.toFixed(1)),
            },
          });
        }
      }

      console.log(`[yearly-rollup] ${facility.name}: ${year} - ${usageCount} sessions`);
    } catch (error) {
      console.error(`[yearly-rollup] Error for ${facility.name}:`, error);
    }
  }

  console.log("[yearly-rollup] Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
