import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getDashboardSummary, type PeriodType } from "@/lib/analytics/summary";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: { code: "UNAUTHORIZED", message: "認証が必要です" } }, { status: 401 });
  }

  const facilityId = session.user.facilityId;
  const { searchParams } = new URL(request.url);
  const periodType = (searchParams.get("periodType") || "monthly") as PeriodType;
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));

  // Platform admin can query any facility via ?facilityId=
  let targetFacilityId = facilityId;
  if (session.user.role === "platform_admin" && searchParams.get("facilityId")) {
    targetFacilityId = searchParams.get("facilityId");
  }
  if (!targetFacilityId) {
    return NextResponse.json({ error: { code: "FORBIDDEN", message: "施設が指定されていません" } }, { status: 403 });
  }

  const summary = await getDashboardSummary({ facilityId: targetFacilityId, periodType, year, month });
  const facility = await prisma.facility.findUnique({ where: { id: targetFacilityId }, select: { id: true, name: true } });

  return NextResponse.json({
    facility,
    period: { type: periodType, year, month: periodType === "monthly" ? month : undefined },
    summary: summary || {
      usageCount: 0, uniqueUserCount: 0, newRate: 0, repeatRate: 0,
      averageUsageIntervalDays: null, repeatContinuationRate: null,
      avgUsesPerUser: null, secondUseMedianDays: null,
    },
  });
}
