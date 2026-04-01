import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { writeAuditLog } from "@/lib/audit/audit-log";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) return null;

        const user = await prisma.facilityUser.findUnique({
          where: { email, deletedAt: null },
          include: { facility: true },
        });

        if (!user || !user.isActive) {
          await writeAuditLog({
            action: "login_failed",
            targetType: "facility_user",
            metadata: { email, reason: "user_not_found_or_inactive" },
          });
          return null;
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          await writeAuditLog({
            actorUserId: user.id,
            actorRole: user.role,
            facilityId: user.facilityId ?? undefined,
            action: "login_failed",
            targetType: "facility_user",
            targetId: user.id,
            metadata: { reason: "account_locked" },
          });
          return null;
        }

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) {
          const newCount = user.failedLoginCount + 1;
          const lockData =
            newCount >= 5
              ? { lockedUntil: new Date(Date.now() + 15 * 60 * 1000) }
              : {};

          await prisma.facilityUser.update({
            where: { id: user.id },
            data: { failedLoginCount: newCount, ...lockData },
          });

          await writeAuditLog({
            actorUserId: user.id,
            actorRole: user.role,
            facilityId: user.facilityId ?? undefined,
            action: newCount >= 5 ? "account_locked" : "login_failed",
            targetType: "facility_user",
            targetId: user.id,
            metadata: { failedCount: newCount },
          });

          return null;
        }

        // Reset failed count on successful login
        await prisma.facilityUser.update({
          where: { id: user.id },
          data: {
            failedLoginCount: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
          },
        });

        await writeAuditLog({
          actorUserId: user.id,
          actorRole: user.role,
          facilityId: user.facilityId ?? undefined,
          action: "login_success",
          targetType: "facility_user",
          targetId: user.id,
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          facilityId: user.facilityId,
          facilityName: user.facility?.name ?? null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 14 * 24 * 60 * 60, // 14 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const u = user as any;
        token.role = u.role;
        token.facilityId = u.facilityId;
        token.facilityName = u.facilityName;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const su = session.user as any;
        su.id = token.id;
        su.role = token.role;
        su.facilityId = token.facilityId;
        su.facilityName = token.facilityName;
      }
      return session;
    },
  },
});
