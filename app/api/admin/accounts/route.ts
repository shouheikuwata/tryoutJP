import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { writeAuditLog } from "@/lib/audit/audit-log";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "platform_admin") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const body = await request.json();
  const passwordHash = await hashPassword(body.password);

  const user = await prisma.facilityUser.create({
    data: {
      facilityId: body.facilityId,
      email: body.email,
      name: body.name || null,
      role: body.role || "facility_viewer",
      passwordHash,
      isActive: true,
      createdBy: session.user.id,
    },
  });

  await writeAuditLog({
    actorUserId: session.user.id,
    actorRole: "platform_admin",
    action: "facility_account_created",
    targetType: "facility_user",
    targetId: user.id,
    facilityId: body.facilityId,
  });

  return NextResponse.json({ id: user.id, status: "created" });
}
