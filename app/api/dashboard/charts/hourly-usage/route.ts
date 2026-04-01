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
  const periodType = (searchParams.get("periodType") || "monthly") as PeriodType;
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));

  const items = await getDimensionMetrics({ facilityId, periodType, dimensionType: "hour_of_day", year, month });

  // 9時〜23時の固定順で並べる
  const hours = Array.from({ length: 15 }, (_, i) => String(i + 9));
  const sorted = hours.map((h) => {
    const found = items.find((i) => i.dimensionValue === h);
    return { label: `${h}時`, usageCount: found?.usageCount ?? 0 };
  });

  return NextResponse.json({
    dimensionType: "hour_of_day",
    items: sorted,
  });
}
