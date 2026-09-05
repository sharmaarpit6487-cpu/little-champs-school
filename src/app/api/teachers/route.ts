import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { teacherSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";
import { generateEmployeeId } from "@/lib/utils";
import { hashPassword, validatePasswordStrength } from "@/lib/users";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth("teachers:read");
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const includeInactive = searchParams.get("includeInactive") === "true";

  const teachers = await prisma.teacher.findMany({
    where: {
      ...(includeInactive ? {} : { isActive: true }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
          { employeeId: { contains: search, mode: "insensitive" } },
          { department: { contains: search, mode: "insensitive" } },
        ],
      }),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ teachers });
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth("teachers:write");
  if (error) return error;

  try {
    const body = await req.json();
    const data = teacherSchema.parse(body);

    const existing = await prisma.teacher.findUnique({
      where: { email: data.email },
    });
    if (existing) {
      return NextResponse.json({ error: "A teacher with this email already exists" }, { status: 409 });
    }

    const count = await prisma.teacher.count();
    const employeeId = generateEmployeeId(count + 1);

    const portalEmail =
      data.createPortalAccount && data.portalEmail?.trim()
        ? data.portalEmail.trim().toLowerCase()
        : data.email.trim().toLowerCase();

    let userId: string | undefined;
    if (data.createPortalAccount && data.password) {
      const strengthError = validatePasswordStrength(data.password);
      if (strengthError) throw new Error(strengthError);
      const existingUser = await prisma.user.findUnique({ where: { email: portalEmail } });
      if (existingUser) throw new Error("An account with this email already exists");
      const hashed = await hashPassword(data.password);
      const portalUser = await prisma.user.create({
        data: {
          email: portalEmail,
          password: hashed,
          name: `${data.firstName} ${data.lastName}`,
          role: Role.TEACHER,
          isActive: true,
        },
      });
      userId = portalUser.id;
    }

    const teacher = await prisma.teacher.create({
      data: {
        employeeId,
        userId,
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
      action: "CREATE",
      entity: "Teacher",
      entityId: teacher.id,
      newData: teacher,
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create teacher";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
