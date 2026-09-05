import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { createAuditLog } from "@/lib/audit";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const { error, session } = await requireAuth("events:write");
  if (error) return error;

  const { id } = await context.params;
  const existing = await prisma.event.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  const event = await prisma.event.update({
    where: { id },
    data: { isPublished: false },
  });

  await createAuditLog({
    userId: session!.user.id,
    action: "DELETE",
    entity: "Event",
    entityId: id,
    oldData: existing,
    newData: event,
  });

  return NextResponse.json({ success: true });
}
