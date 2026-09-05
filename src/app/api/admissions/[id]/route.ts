import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { admissionStatusSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, context: RouteContext) {
  const { error, session } = await requireAuth("admissions:write");
  if (error) return error;

  const { id } = await context.params;

  try {
    const existing = await prisma.admission.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const body = await req.json();
    const data = admissionStatusSchema.parse(body);

    const admission = await prisma.admission.update({
      where: { id },
      data: { status: data.status },
    });

    await createAuditLog({
      userId: session!.user.id,
      action: "UPDATE_STATUS",
      entity: "Admission",
      entityId: admission.id,
      oldData: { status: existing.status },
      newData: { status: admission.status },
    });

    return NextResponse.json(admission);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update application";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
