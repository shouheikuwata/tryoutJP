import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { usageEndSchema } from "@/lib/validation/usage-end";
import { sendSwitchBotCommand } from "@/lib/switchbot/api";
import { writeAuditLog } from "@/lib/audit/audit-log";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = usageEndSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "入力内容を確認してください。",
            details: parsed.error.issues,
          },
        },
        { status: 400 }
      );
    }

    const { deviceId, didShopping } = parsed.data;

    // Verify device exists
    const device = await prisma.facilityDevice.findFirst({
      where: {
        externalDeviceId: deviceId,
        status: "active",
        deletedAt: null,
      },
    });

    if (!device) {
      return NextResponse.json(
        {
          error: {
            code: "DEVICE_NOT_FOUND",
            message: "指定されたデバイスが見つかりません。",
          },
        },
        { status: 404 }
      );
    }

    // Find the most recent open session for this device
    const openSession = await prisma.usageSession.findFirst({
      where: {
        deviceId: device.id,
        sessionEndedAt: null,
        deletedAt: null,
      },
      orderBy: { sessionStartedAt: "desc" },
    });

    if (openSession) {
      const now = new Date();
      const durationSeconds = Math.round(
        (now.getTime() - openSession.sessionStartedAt.getTime()) / 1000
      );

      await prisma.usageSession.update({
        where: { id: openSession.id },
        data: {
          sessionEndedAt: now,
          sessionDurationSeconds: durationSeconds,
        },
      });
    }

    // Turn OFF the SwitchBot device
    await sendSwitchBotCommand(deviceId, "turnOff");

    await writeAuditLog({
      action: "usage_session_ended",
      targetType: "usage_session",
      targetId: openSession?.id ?? undefined,
      metadata: {
        deviceId,
        facilityId: device.facilityId,
        didShopping: didShopping === "yes",
      },
    });

    return NextResponse.json({
      status: "ended",
      message: "ヘアアイロンの利用を終了しました。ありがとうございました。",
    });
  } catch (error) {
    console.error("[API_USAGE_END_ERROR]", error);
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "送信に失敗しました。時間をおいて再度お試しください。",
        },
      },
      { status: 500 }
    );
  }
}
