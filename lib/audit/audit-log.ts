import { prisma } from "@/lib/db/prisma";

export interface AuditLogInput {
  actorUserId?: string;
  actorRole?: string;
  facilityId?: string;
  action: string;
  targetType: string;
  targetId?: string;
  requestId?: string;
  ipHash?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

export async function writeAuditLog(input: AuditLogInput): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorUserId: input.actorUserId,
        actorRole: input.actorRole,
        facilityId: input.facilityId,
        action: input.action,
        targetType: input.targetType,
        targetId: input.targetId,
        requestId: input.requestId,
        ipHash: input.ipHash,
        userAgent: input.userAgent,
        metadata: input.metadata ? JSON.parse(JSON.stringify(input.metadata)) : undefined,
      },
    });
  } catch (error) {
    // Audit log failure should not break the main flow
    console.error("[AUDIT_LOG_ERROR]", error);
  }
}
