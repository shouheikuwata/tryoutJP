import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { prisma } from "@/lib/db/prisma";
import { hashPassword } from "@/lib/auth/password";
import { writeAuditLog } from "@/lib/audit/audit-log";

export async function POST(request: Request) {
  try {
    const { token, newPassword, confirmPassword } = await request.json();

    if (!token || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "入力内容を確認してください。" } },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "パスワードが一致しません。" } },
        { status: 400 }
      );
    }

    if (newPassword.length < 12) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "パスワードは12文字以上で入力してください。" } },
        { status: 400 }
      );
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");

    const resetToken = await prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        expiresAt: { gt: new Date() },
        usedAt: null,
      },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "無効または期限切れのトークンです。" } },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await prisma.$transaction([
      prisma.facilityUser.update({
        where: { id: resetToken.userId },
        data: { passwordHash, passwordChangedAt: new Date(), failedLoginCount: 0, lockedUntil: null },
      }),
      prisma.passwordResetToken.update({
        where: { id: resetToken.id },
        data: { usedAt: new Date() },
      }),
    ]);

    await writeAuditLog({
      actorUserId: resetToken.userId,
      action: "password_reset_completed",
      targetType: "facility_user",
      targetId: resetToken.userId,
    });

    return NextResponse.json({ status: "ok", message: "パスワードを更新しました。" });
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { error: { code: "INTERNAL_SERVER_ERROR", message: "パスワード再設定に失敗しました。" } },
      { status: 500 }
    );
  }
}
