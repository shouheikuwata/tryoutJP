/**
 * Monthly rollup job
 * Aggregates daily metrics into monthly metrics and computes dimension breakdowns
 * Run: npx tsx scripts/monthly-rollup.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("[monthly-rollup] Starting...");

  const now = new Date();
  // Process previous month
  const targetDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const year = targetDate.getFullYear();
  const month = targetDate.getMonth() + 1;
  const monthStart = new Date(year, month - 1, 1);
  const monthEnd = new Date(year, month, 0, 23, 59, 59, 999);

  const facilities = await prisma.facility.findMany({
    where: { status: "active", deletedAt: null },
  });

  for (const facility of facilities) {
    try {
      const sessions = await prisma.usageSession.findMany({
        where: {
          facilityId: facility.id,
          sessionStartedAt: { gte: monthStart, lte: monthEnd },
          deletedAt: null,
        },
        include: { endUser: true },
      });

      const usageCount = sessions.length;
      if (usageCount === 0) continue;

      const uniqueUserIds = new Set(sessions.map((s) => s.endUserId));
      const uniqueUserCount = uniqueUserIds.size;
      const newUserCount = sessions.filter((s) => s.isFirstUseAtFacility).length;
      const repeatUserCount = uniqueUserCount - newUserCount;
      const repeatRate = uniqueUserCount > 0 ? (repeatUserCount / uniqueUserCount) * 100 : 0;
      const newRate = uniqueUserCount > 0 ? (newUserCount / uniqueUserCount) * 100 : 0;
      const avgUsesPerUser = uniqueUserCount > 0 ? usageCount / uniqueUserCount : 0;

      await prisma.facilityMonthlyMetric.upsert({
        where: {
          facilityId_metricYear_metricMonth: {
            facilityId: facility.id,
            metricYear: year,
            metricMonth: month,
          },
        },
        create: {
          facilityId: facility.id,
          metricYear: year,
          metricMonth: month,
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

      // Dimension breakdowns
      const dimConfigs = [
        { type: "age_bucket", getter: (s: typeof sessions[0]) => s.endUser?.ageBucket },
        { type: "city", getter: (s: typeof sessions[0]) => s.rawCity || s.endUser?.city },
        { type: "visit_purpose", getter: (s: typeof sessions[0]) => s.visitPurpose },
        { type: "usage_trigger", getter: (s: typeof sessions[0]) => s.usageTrigger },
        { type: "hour_of_day", getter: (s: typeof sessions[0]) => String(s.sessionStartedAt.getHours()) },
        { type: "weekday", getter: (s: typeof sessions[0]) => ["日", "月", "火", "水", "木", "金", "土"][s.sessionStartedAt.getDay()] },
      ];

      for (const dim of dimConfigs) {
        const buckets: Record<string, { count: number; users: Set<string> }> = {};
        for (const s of sessions) {
          const val = dim.getter(s);
          if (!val) continue;
          if (!buckets[val]) buckets[val] = { count: 0, users: new Set() };
          buckets[val].count++;
          buckets[val].users.add(s.endUserId);
        }

        for (const [value, data] of Object.entries(buckets)) {
          const pct = usageCount > 0 ? (data.count / usageCount) * 100 : 0;
          await prisma.facilityMonthlyDimensionMetric.upsert({
            where: {
              facilityId_metricYear_metricMonth_dimensionType_dimensionValue: {
                facilityId: facility.id,
                metricYear: year,
                metricMonth: month,
                dimensionType: dim.type,
                dimensionValue: value,
              },
            },
            create: {
              facilityId: facility.id,
              metricYear: year,
              metricMonth: month,
              dimensionType: dim.type,
              dimensionValue: value,
              usageCount: data.count,
              uniqueUserCount: data.users.size,
              percentage: Number(pct.toFixed(1)),
            },
            update: {
              usageCount: data.count,
              uniqueUserCount: data.users.size,
              percentage: Number(pct.toFixed(1)),
            },
          });
        }
      }

      console.log(`[monthly-rollup] ${facility.name}: ${year}/${month} - ${usageCount} sessions`);
    } catch (error) {
      console.error(`[monthly-rollup] Error for ${facility.name}:`, error);
    }
  }

  console.log("[monthly-rollup] Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
