import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { teacherSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, context: RouteContext) {
  const { error } = await requireAuth("teachers:read");
  if (error) return error;

  const { id } = await context.params;
  const teacher = await prisma.teacher.findUnique({ where: { id } });

  if (!teacher) {
    return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
  }

  return NextResponse.json(teacher);
}

export async function PUT(req: NextRequest, context: RouteContext) {
  const { error, session } = await requireAuth("teachers:write");
  if (error) return error;

  const { id } = await context.params;

  try {
    const existing = await prisma.teacher.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    const body = await req.json();
    const data = teacherSchema.parse(body);

    if (data.email !== existing.email) {
      const emailTaken = await prisma.teacher.findUnique({ where: { email: data.email } });
      if (emailTaken) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
    }

    const teacher = await prisma.teacher.update({
      where: { id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        department: data.department,
        designation: data.designation,
        qualification: data.qualification,
        experience: data.experience,
        dateOfJoining: new Date(data.dateOfJoining),
        bio: data.bio,
      },
    });

    await createAuditLog({
      userId: session!.user.id,
      action: "UPDATE",
      entity: "Teacher",
      entityId: teacher.id,
      oldData: existing,
      newData: teacher,
    });

    return NextResponse.json(teacher);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update teacher";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  const { error, session } = await requireAuth("teachers:write");
  if (error) return error;

  const { id } = await context.params;

  const existing = await prisma.teacher.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
  }

  const teacher = await prisma.teacher.update({
    where: { id },
    data: { isActive: false },
  });

  await createAuditLog({
    userId: session!.user.id,
    action: "DELETE",
    entity: "Teacher",
    entityId: teacher.id,
    oldData: existing,
    newData: teacher,
  });

  return NextResponse.json({ success: true, teacher });
}
