import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import type { PeriodType } from "@/lib/analytics/summary";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });

  const facilityId = session.user.role === "platform_admin"
    ? new URL(request.url).searchParams.get("facilityId") || session.user.facilityId
    : session.user.facilityId;
  if (!facilityId) return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const periodType = (searchParams.get("periodType") || "yearly") as PeriodType;
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

  if (periodType === "yearly") {
    const metrics = await prisma.facilityMonthlyMetric.findMany({
      where: { facilityId, metricYear: year },
      orderBy: { metricMonth: "asc" },
    });

    return NextResponse.json({
      periodType: "yearly",
      series: metrics.map((m) => ({
        label: `${m.metricMonth}月`,
        usageCount: m.usageCount,
        uniqueUserCount: m.uniqueUserCount,
        newUserCount: m.newUserCount,
        repeatUserCount: m.repeatUserCount,
      })),
    });
  }

  // For monthly: return daily data (simplified)
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
  const dailyMetrics = await prisma.facilityDailyMetric.findMany({
    where: {
      facilityId,
      metricDate: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
    },
    orderBy: { metricDate: "asc" },
  });

  return NextResponse.json({
    periodType: "monthly",
    series: dailyMetrics.map((d) => ({
      label: `${new Date(d.metricDate).getDate()}日`,
      usageCount: d.usageCount,
      uniqueUserCount: d.uniqueUserCount,
      newUserCount: d.newUserCount,
      repeatUserCount: d.repeatUserCount,
    })),
  });
}
