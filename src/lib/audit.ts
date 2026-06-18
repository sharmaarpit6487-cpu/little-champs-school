import prisma from "./prisma";

export async function createAuditLog({
  userId,
  action,
  entity,
  entityId,
  oldData,
  newData,
  ipAddress,
  userAgent,
}: {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  oldData?: unknown;
  newData?: unknown;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : undefined,
        newData: newData ? JSON.parse(JSON.stringify(newData)) : undefined,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
}

export async function createActivityLog({
  userId,
  action,
  details,
}: {
  userId: string;
  action: string;
  details?: string;
}) {
  try {
    await prisma.activityLog.create({
      data: { userId, action, details },
    });
  } catch (error) {
    console.error("Failed to create activity log:", error);
  }
}
