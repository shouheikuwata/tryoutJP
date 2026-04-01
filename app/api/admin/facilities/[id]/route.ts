import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit/audit-log";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "platform_admin") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const { id } = await params;
  const facility = await prisma.facility.findUnique({ where: { id } });
  if (!facility) return NextResponse.json({ error: { code: "NOT_FOUND" } }, { status: 404 });

  return NextResponse.json({ facility });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "platform_admin") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const facility = await prisma.facility.update({
    where: { id },
    data: {
      name: body.name,
      email: body.email,
      prefecture: body.prefecture,
      city: body.city,
      industry: body.industry,
      status: body.status,
      updatedBy: session.user.id,
    },
  });

  await writeAuditLog({
    actorUserId: session.user.id,
    actorRole: "platform_admin",
    action: "facility_updated",
    targetType: "facility",
    targetId: facility.id,
  });

  return NextResponse.json({ status: "updated" });
}
