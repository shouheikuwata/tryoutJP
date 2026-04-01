import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { contractApplicationSchema } from "@/lib/validation/contract-application";
import { encrypt } from "@/lib/encryption/field-encryption";
import { normalizePhone, phoneLast4 } from "@/lib/encryption/phone-hash";
import { sendEmail } from "@/lib/mail/resend";
import { contractApplicationAdminNotificationText } from "@/lib/mail/templates/contract-application-admin-notification";
import { writeAuditLog } from "@/lib/audit/audit-log";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contractApplicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "入力内容を確認してください。", details: parsed.error.issues } },
        { status: 400 }
      );
    }

    const data = parsed.data;
    let phoneEncrypted: string | undefined;
    let last4: string | undefined;

    if (data.phone) {
      const normalized = normalizePhone(data.phone);
      if (normalized.length >= 10) {
        phoneEncrypted = encrypt(normalized);
        last4 = phoneLast4(normalized);
      }
    }

    const now = new Date();
    const application = await prisma.contractApplication.create({
      data: {
        companyName: data.companyName,
        departmentName: data.departmentName || null,
        contactName: data.contactName,
        email: data.email,
        phoneEncrypted: phoneEncrypted ?? null,
        phoneLast4: last4 ?? null,
        facilityName: data.facilityName,
        facilityPrefecture: data.facilityPrefecture || null,
        facilityCity: data.facilityCity || null,
        facilityAddress: data.facilityAddress || null,
        industry: data.industry || null,
        desiredUnitCount: data.desiredUnitCount ?? null,
        desiredInstallationArea: data.desiredInstallationArea || null,
        desiredStartTiming: data.desiredStartTiming || null,
        note: data.note || null,
        agreedTermsAt: now,
        agreedPrivacyAt: now,
      },
    });

    await sendEmail({
      to: process.env.EMAIL_FROM || "admin@beautyspot.example",
      subject: "【Beauty Spot】新規契約申込",
      text: contractApplicationAdminNotificationText({
        companyName: data.companyName,
        contactName: data.contactName,
        email: data.email,
        facilityName: data.facilityName,
      }),
    });

    await writeAuditLog({
      action: "contract_application_submitted",
      targetType: "contract_application",
      targetId: application.id,
      metadata: { email: data.email },
    });

    return NextResponse.json({ id: application.id, status: "accepted", message: "契約申込を受け付けました。" });
  } catch (error) {
    console.error("[API_CONTRACT_ERROR]", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_SERVER_ERROR", message: "送信に失敗しました。時間をおいて再度お試しください。" } },
      { status: 500 }
    );
  }
}
