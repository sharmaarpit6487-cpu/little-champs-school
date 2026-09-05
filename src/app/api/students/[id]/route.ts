import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { createAuditLog } from "@/lib/audit";
import { assertStudentRecordAccess } from "@/lib/access-control";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth();
  if (error || !session) return error!;

  const { id } = await params;

  const access = await assertStudentRecordAccess(session, id);
  if (access.error) return access.error;

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      class: true,
      parents: { include: { parent: true } },
      fees: { include: { payments: true }, orderBy: { dueDate: "desc" } },
      attendances: { orderBy: { date: "desc" }, take: 30 },
      grades: { include: { subject: true } },
      documents: true,
    },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  return NextResponse.json(student);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth("students:write");
  if (error) return error;

  const { id } = await params;

  try {
    const oldStudent = await prisma.student.findUnique({ where: { id } });
    if (!oldStudent) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const body = await req.json();
    const student = await prisma.student.update({
      where: { id },
      data: body,
      include: { class: true, parents: { include: { parent: true } } },
    });

    await createAuditLog({
      userId: session!.user.id,
      action: "UPDATE",
      entity: "Student",
      entityId: id,
      oldData: oldStudent,
      newData: student,
    });

    return NextResponse.json(student);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update student";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, session } = await requireAuth("students:write");
  if (error) return error;

  const { id } = await params;

  const student = await prisma.student.update({
    where: { id },
    data: { isActive: false },
  });

  await createAuditLog({
    userId: session!.user.id,
    action: "DELETE",
    entity: "Student",
    entityId: id,
    oldData: student,
  });

  return NextResponse.json({ message: "Student deactivated" });
}
