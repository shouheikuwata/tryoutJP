import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { inquirySchema } from "@/lib/validation/inquiry";
import { encrypt } from "@/lib/encryption/field-encryption";
import { normalizePhone, phoneLast4 } from "@/lib/encryption/phone-hash";
import { sendEmail } from "@/lib/mail/resend";
import { inquiryAutoReplyText, inquiryAutoReplyHtml } from "@/lib/mail/templates/inquiry-auto-reply";
import { inquiryAdminNotificationText } from "@/lib/mail/templates/inquiry-admin-notification";
import { writeAuditLog } from "@/lib/audit/audit-log";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = inquirySchema.safeParse(body);
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

    const inquiry = await prisma.inquiry.create({
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
      },
    });

    // Send auto-reply email
    const materialUrl = process.env.MATERIAL_DOWNLOAD_URL || "https://example.com/material.pdf";
    const emailSetting = await prisma.emailSetting.findUnique({ where: { key: "inquiry_auto_reply" } });
    const subject = emailSetting?.subject || "Beauty Spotへのお問い合わせありがとうございます";

    const emailResult = await sendEmail({
      to: data.email,
      subject,
      text: inquiryAutoReplyText(data.contactName, materialUrl),
      html: inquiryAutoReplyHtml(data.contactName, materialUrl),
    });

    if (emailResult.success) {
      await prisma.inquiry.update({
        where: { id: inquiry.id },
        data: { autoReplySentAt: new Date() },
      });
    }

    // Send admin notification
    await sendEmail({
      to: process.env.EMAIL_FROM || "admin@beautyspot.example",
      subject: "【Beauty Spot】新しいお問い合わせ",
      text: inquiryAdminNotificationText({
        companyName: data.companyName,
        contactName: data.contactName,
        email: data.email,
        facilityName: data.facilityName,
      }),
    });

    await writeAuditLog({
      action: "inquiry_submitted",
      targetType: "inquiry",
      targetId: inquiry.id,
      metadata: { email: data.email },
    });

    return NextResponse.json({ id: inquiry.id, status: "accepted", message: "お問い合わせを受け付けました。" });
  } catch (error) {
    console.error("[API_INQUIRY_ERROR]", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_SERVER_ERROR", message: "送信に失敗しました。時間をおいて再度お試しください。" } },
      { status: 500 }
    );
  }
}
