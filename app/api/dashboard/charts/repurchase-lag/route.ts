import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getDimensionMetrics } from "@/lib/analytics/dimensions";
import { toJapaneseLabel } from "@/lib/utils/labels";
import type { PeriodType } from "@/lib/analytics/summary";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });

  const facilityId = session.user.role === "platform_admin"
    ? new URL(request.url).searchParams.get("facilityId") || session.user.facilityId
    : session.user.facilityId;
  if (!facilityId) return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const periodType = (searchParams.get("periodType") || "cumulative") as PeriodType;
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));

  const items = await getDimensionMetrics({ facilityId, periodType, dimensionType: "second_use_lag_bucket", year, month });

  return NextResponse.json({
    dimensionType: "second_use_lag_bucket",
    items: items.map((i) => ({ label: toJapaneseLabel("second_use_lag_bucket", i.dimensionValue), uniqueUserCount: i.uniqueUserCount, percentage: i.percentage ? Number(i.percentage) : null })),
  });
}
