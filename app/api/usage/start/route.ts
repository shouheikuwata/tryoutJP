import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { usageStartSchema } from "@/lib/validation/usage-start";
import { sendSwitchBotCommand } from "@/lib/switchbot/api";
import { encrypt } from "@/lib/encryption/field-encryption";
import { normalizePhone, hashPhone } from "@/lib/encryption/phone-hash";
import { writeAuditLog } from "@/lib/audit/audit-log";

/** Map form values to DB-compatible visit purpose */
const visitPurposeMap: Record<string, string> = {
  shopping: "買い物",
  dining: "食事",
  work_commute: "仕事・通勤",
  meeting: "待ち合わせ",
  other: "その他",
};

const usageTriggerMap: Record<string, string> = {
  rain_humidity: "雨・湿気",
  wind: "風",
  sweat: "汗",
  before_date: "デート前",
  work: "仕事前後",
  just_style: "なんとなく整えたい",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = usageStartSchema.safeParse(body);
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

    const data = parsed.data;

    // Verify device exists in DB
    const device = await prisma.facilityDevice.findFirst({
      where: {
        externalDeviceId: data.deviceId,
        status: "active",
        deletedAt: null,
      },
      include: { facility: true },
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

    // Normalize and hash phone
    const normalizedPhone = normalizePhone(data.phone);
    const phoneHash = hashPhone(normalizedPhone);
    const phoneEncrypted = encrypt(normalizedPhone);

    const isReturningUser = data.hasUsedBefore === "yes";

    // For new users: encrypt birth date and compute age bucket
    const birthDateEncrypted = data.birthDate ? encrypt(data.birthDate) : "";
    let birthYear: number | undefined;
    let ageBucket = "unknown";
    if (data.birthDate) {
      birthYear = parseInt(data.birthDate.split("-")[0], 10);
      const currentYear = new Date().getFullYear();
      ageBucket = getAgeBucket(currentYear - birthYear);
    }

    if (isReturningUser) {
      // Returning user: look up existing EndUser by phone hash
      const existingUser = await prisma.endUser.findUnique({
        where: {
          facilityId_phoneHash: {
            facilityId: device.facilityId,
            phoneHash,
          },
        },
      });

      if (!existingUser) {
        return NextResponse.json(
          {
            error: {
              code: "USER_NOT_FOUND",
              message: "この電話番号での利用履歴が見つかりません。「ない」を選択して情報を入力してください。",
            },
          },
          { status: 404 }
        );
      }

      // Update lastSeenAt
      await prisma.endUser.update({
        where: { id: existingUser.id },
        data: { lastSeenAt: new Date() },
      });

      // Count previous sessions
      const previousSessions = await prisma.usageSession.count({
        where: {
          endUserId: existingUser.id,
          facilityId: device.facilityId,
          deletedAt: null,
        },
      });

      // Create session with existing user data
      const session = await prisma.usageSession.create({
        data: {
          facilityId: device.facilityId,
          endUserId: existingUser.id,
          deviceId: device.id,
          sessionStartedAt: new Date(),
          isFirstUseAtFacility: previousSessions === 0,
          visitPurpose: "リピート利用",
          usageTrigger: "リピート利用",
          usedBeforeAnswer: true,
          sessionSource: "onsite_web_form",
          rawPhoneHash: phoneHash,
          rawCity: existingUser.city,
          rawNickname: existingUser.nickname,
        },
      });

      // Turn ON the SwitchBot device
      await sendSwitchBotCommand(data.deviceId, "turnOn");

      await writeAuditLog({
        action: "usage_session_started",
        targetType: "usage_session",
        targetId: session.id,
        metadata: {
          deviceId: data.deviceId,
          facilityId: device.facilityId,
          returningUser: true,
        },
      });

      return NextResponse.json({
        sessionId: session.id,
        status: "started",
        message: "ヘアアイロンの利用を開始しました。",
      });
    }

    // New user flow: full registration
    const endUser = await prisma.endUser.upsert({
      where: {
        facilityId_phoneHash: {
          facilityId: device.facilityId,
          phoneHash,
        },
      },
      update: {
        nickname: data.nickname || undefined,
        city: data.city || undefined,
        birthDateEncrypted: birthDateEncrypted || undefined,
        birthYear,
        ageBucket,
        hasUsedBeforeAnswer: false,
        lastSeenAt: new Date(),
      },
      create: {
        facilityId: device.facilityId,
        phoneEncrypted,
        phoneHash,
        nickname: data.nickname || null,
        city: data.city || null,
        birthDateEncrypted,
        birthYear,
        ageBucket,
        hasUsedBeforeAnswer: false,
        firstSeenAt: new Date(),
        lastSeenAt: new Date(),
      },
    });

    // Check if this is first use at facility
    const previousSessions = await prisma.usageSession.count({
      where: {
        endUserId: endUser.id,
        facilityId: device.facilityId,
        deletedAt: null,
      },
    });

    // Create usage session
    const session = await prisma.usageSession.create({
      data: {
        facilityId: device.facilityId,
        endUserId: endUser.id,
        deviceId: device.id,
        sessionStartedAt: new Date(),
        isFirstUseAtFacility: previousSessions === 0,
        visitPurpose: visitPurposeMap[data.visitPurpose || ""] || data.visitPurpose || "未回答",
        usageTrigger: usageTriggerMap[data.usageTrigger || ""] || data.usageTrigger || "未回答",
        usedBeforeAnswer: false,
        sessionSource: "onsite_web_form",
        rawPhoneHash: phoneHash,
        rawCity: data.city || null,
        rawBirthDateEncrypted: birthDateEncrypted || null,
        rawNickname: data.nickname || null,
      },
    });

    // Turn ON the SwitchBot device
    await sendSwitchBotCommand(data.deviceId, "turnOn");

    await writeAuditLog({
      action: "usage_session_started",
      targetType: "usage_session",
      targetId: session.id,
      metadata: {
        deviceId: data.deviceId,
        facilityId: device.facilityId,
      },
    });

    return NextResponse.json({
      sessionId: session.id,
      status: "started",
      message: "ヘアアイロンの利用を開始しました。",
    });
  } catch (error) {
    console.error("[API_USAGE_START_ERROR]", error);
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

function getAgeBucket(age: number): string {
  if (age < 10) return "0-9";
  if (age < 20) return "10-19";
  if (age < 30) return "20-29";
  if (age < 40) return "30-39";
  if (age < 50) return "40-49";
  if (age < 60) return "50-59";
  return "60+";
}
