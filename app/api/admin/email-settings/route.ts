import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { writeAuditLog } from "@/lib/audit/audit-log";

export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== "platform_admin") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const settings = await prisma.emailSetting.findMany();
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "platform_admin") {
    return NextResponse.json({ error: { code: "FORBIDDEN" } }, { status: 403 });
  }

  const body = await request.json();
  await prisma.emailSetting.upsert({
    where: { key: body.key },
    create: {
      key: body.key,
      subject: body.subject,
      bodyText: body.bodyText,
      materialDownloadUrl: body.materialDownloadUrl || null,
      updatedBy: session.user.id,
    },
    update: {
      subject: body.subject,
      bodyText: body.bodyText,
      materialDownloadUrl: body.materialDownloadUrl || null,
      updatedBy: session.user.id,
    },
  });

  await writeAuditLog({
    actorUserId: session.user.id,
    actorRole: "platform_admin",
    action: "email_settings_updated",
    targetType: "email_setting",
    metadata: { key: body.key },
  });

  return NextResponse.json({ status: "updated" });
}
