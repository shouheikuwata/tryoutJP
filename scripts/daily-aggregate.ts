/**
 * Daily aggregation job
 * Computes daily metrics for all active facilities
 * Run: npx tsx scripts/daily-aggregate.ts
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("[daily-aggregate] Starting...");

  const facilities = await prisma.facility.findMany({
    where: { status: "active", deletedAt: null },
  });

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const dayEnd = new Date(yesterday);
  dayEnd.setHours(23, 59, 59, 999);

  for (const facility of facilities) {
    try {
      // Count sessions for the day
      const sessions = await prisma.usageSession.findMany({
        where: {
          facilityId: facility.id,
          sessionStartedAt: { gte: yesterday, lte: dayEnd },
          deletedAt: null,
        },
        select: { endUserId: true, isFirstUseAtFacility: true },
      });

      const usageCount = sessions.length;
      if (usageCount === 0) continue;

      const uniqueUserIds = new Set(sessions.map((s) => s.endUserId));
      const uniqueUserCount = uniqueUserIds.size;
      const newUserCount = sessions.filter((s) => s.isFirstUseAtFacility).length;
      const repeatUserCount = uniqueUserCount - newUserCount;

      const repeatRate = uniqueUserCount > 0 ? (repeatUserCount / uniqueUserCount) * 100 : 0;
      const newRate = uniqueUserCount > 0 ? (newUserCount / uniqueUserCount) * 100 : 0;

      await prisma.facilityDailyMetric.upsert({
        where: {
          facilityId_metricDate: { facilityId: facility.id, metricDate: yesterday },
        },
        create: {
          facilityId: facility.id,
          metricDate: yesterday,
          usageCount,
          uniqueUserCount,
          newUserCount,
          repeatUserCount,
          repeatRate,
          newRate,
        },
        update: {
          usageCount,
          uniqueUserCount,
          newUserCount,
          repeatUserCount,
          repeatRate,
          newRate,
        },
      });

      console.log(`[daily-aggregate] ${facility.name}: ${usageCount} sessions`);
    } catch (error) {
      console.error(`[daily-aggregate] Error for ${facility.name}:`, error);
    }
  }

  console.log("[daily-aggregate] Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
