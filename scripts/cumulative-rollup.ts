/**
 * Cumulative rollup job
 * Computes all-time cumulative metrics per facility
 * Run: npx tsx scripts/cumulative-rollup.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("[cumulative-rollup] Starting...");

  const facilities = await prisma.facility.findMany({
    where: { status: "active", deletedAt: null },
  });

  for (const facility of facilities) {
    try {
      const sessions = await prisma.usageSession.findMany({
        where: { facilityId: facility.id, deletedAt: null },
        include: { endUser: true },
        orderBy: { sessionStartedAt: "asc" },
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

      // Compute repeat frequency buckets and second-use lag buckets
      const userSessions: Record<string, Date[]> = {};
      for (const s of sessions) {
        if (!userSessions[s.endUserId]) userSessions[s.endUserId] = [];
        userSessions[s.endUserId].push(s.sessionStartedAt);
      }

      const repeatFreqBuckets: Record<string, number> = {
        once: 0,
        twice: 0,
        three_to_five: 0,
        six_to_ten: 0,
        eleven_plus: 0,
      };
      const lagBuckets: Record<string, number> = {
        within_7_days: 0,
        within_30_days: 0,
        within_90_days: 0,
        after_90_days: 0,
        no_second_use: 0,
      };

      for (const [, dates] of Object.entries(userSessions)) {
        const count = dates.length;
        if (count === 1) repeatFreqBuckets.once++;
        else if (count === 2) repeatFreqBuckets.twice++;
        else if (count <= 5) repeatFreqBuckets.three_to_five++;
        else if (count <= 10) repeatFreqBuckets.six_to_ten++;
        else repeatFreqBuckets.eleven_plus++;

        if (count >= 2) {
          const lagDays = (dates[1].getTime() - dates[0].getTime()) / (1000 * 60 * 60 * 24);
          if (lagDays <= 7) lagBuckets.within_7_days++;
          else if (lagDays <= 30) lagBuckets.within_30_days++;
          else if (lagDays <= 90) lagBuckets.within_90_days++;
          else lagBuckets.after_90_days++;
        } else {
          lagBuckets.no_second_use++;
        }
      }

      await prisma.facilityCumulativeMetric.upsert({
        where: { facilityId: facility.id },
        create: {
          facilityId: facility.id,
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

      // Cumulative dimension metrics
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
          await prisma.facilityCumulativeDimensionMetric.upsert({
            where: {
              facilityId_dimensionType_dimensionValue: {
                facilityId: facility.id,
                dimensionType: dim.type,
                dimensionValue: value,
              },
            },
            create: {
              facilityId: facility.id,
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

      // Save repeat frequency buckets as cumulative dimensions
      const totalUsers = Object.values(repeatFreqBuckets).reduce((s, v) => s + v, 0);
      for (const [bucket, count] of Object.entries(repeatFreqBuckets)) {
        const pct = totalUsers > 0 ? (count / totalUsers) * 100 : 0;
        await prisma.facilityCumulativeDimensionMetric.upsert({
          where: {
            facilityId_dimensionType_dimensionValue: {
              facilityId: facility.id,
              dimensionType: "repeat_frequency_bucket",
              dimensionValue: bucket,
            },
          },
          create: {
            facilityId: facility.id,
            dimensionType: "repeat_frequency_bucket",
            dimensionValue: bucket,
            usageCount: count,
            uniqueUserCount: count,
            percentage: Number(pct.toFixed(1)),
          },
          update: {
            usageCount: count,
            uniqueUserCount: count,
            percentage: Number(pct.toFixed(1)),
          },
        });
      }

      // Save lag buckets
      for (const [bucket, count] of Object.entries(lagBuckets)) {
        const pct = totalUsers > 0 ? (count / totalUsers) * 100 : 0;
        await prisma.facilityCumulativeDimensionMetric.upsert({
          where: {
            facilityId_dimensionType_dimensionValue: {
              facilityId: facility.id,
              dimensionType: "second_use_lag_bucket",
              dimensionValue: bucket,
            },
          },
          create: {
            facilityId: facility.id,
            dimensionType: "second_use_lag_bucket",
            dimensionValue: bucket,
            usageCount: count,
            uniqueUserCount: count,
            percentage: Number(pct.toFixed(1)),
          },
          update: {
            usageCount: count,
            uniqueUserCount: count,
            percentage: Number(pct.toFixed(1)),
          },
        });
      }

      console.log(`[cumulative-rollup] ${facility.name}: ${usageCount} total sessions`);
    } catch (error) {
      console.error(`[cumulative-rollup] Error for ${facility.name}:`, error);
    }
  }

  console.log("[cumulative-rollup] Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
