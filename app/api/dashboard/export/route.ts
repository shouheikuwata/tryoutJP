import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { generateExportCsv } from "@/lib/analytics/export";
import { writeAuditLog } from "@/lib/audit/audit-log";
import type { PeriodType } from "@/lib/analytics/summary";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: { code: "UNAUTHORIZED" } }, { status: 401 });

  const facilityId = session.user.facilityId;
  if (!facilityId && session.user.role !== "platform_admin") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const periodType = (searchParams.get("periodType") || "monthly") as PeriodType;
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
  const targetFacilityId = session.user.role === "platform_admin"
    ? searchParams.get("facilityId") || facilityId
    : facilityId;

  if (!targetFacilityId) {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const csv = await generateExportCsv(targetFacilityId, periodType, year, month);

  await writeAuditLog({
    actorUserId: session.user.id,
    actorRole: session.user.role,
    facilityId: targetFacilityId,
    action: "csv_exported",
    targetType: "dashboard",
    metadata: { periodType, year, month },
  });

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="beautyspot_${periodType}_${year}${periodType === "monthly" ? `_${month}` : ""}.csv"`,
    },
  });
}
