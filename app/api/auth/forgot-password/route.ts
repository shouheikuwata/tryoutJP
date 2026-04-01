import { NextResponse } from "next/server";
import { randomBytes, createHash } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { sendEmail } from "@/lib/mail/resend";
import { passwordResetText, passwordResetHtml } from "@/lib/mail/templates/password-reset";
import { writeAuditLog } from "@/lib/audit/audit-log";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Always return success to not reveal email existence
    const user = await prisma.facilityUser.findUnique({
      where: { email, deletedAt: null },
    });

    if (user && user.isActive) {
      const rawToken = randomBytes(32).toString("hex");
      const tokenHash = createHash("sha256").update(rawToken).digest("hex");

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        },
      });

      const baseUrl = process.env.APP_BASE_URL || "http://localhost:3000";
      const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;

      await sendEmail({
        to: email,
        subject: "【Beauty Spot】パスワード再設定",
        text: passwordResetText(resetUrl),
        html: passwordResetHtml(resetUrl),
      });

      await writeAuditLog({
        actorUserId: user.id,
        action: "password_reset_requested",
        targetType: "facility_user",
        targetId: user.id,
      });
    }

    return NextResponse.json({ status: "ok", message: "再設定用メールを送信しました。" });
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR]", error);
    return NextResponse.json({ status: "ok", message: "再設定用メールを送信しました。" });
  }
}
