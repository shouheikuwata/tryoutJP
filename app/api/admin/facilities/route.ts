import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit/audit-log";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "platform_admin") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const facilities = await prisma.facility.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ facilities });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "platform_admin") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const body = await request.json();
  const facility = await prisma.facility.create({
    data: {
      code: body.code,
      name: body.name,
      email: body.email || null,
      prefecture: body.prefecture || null,
      city: body.city || null,
      industry: body.industry || null,
      status: body.status || "active",
      createdBy: session.user.id,
    },
  });

  await writeAuditLog({
    actorUserId: session.user.id,
    actorRole: "platform_admin",
    action: "facility_created",
    targetType: "facility",
    targetId: facility.id,
  });

  return NextResponse.json({ id: facility.id, status: "created" });
}
