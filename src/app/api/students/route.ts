import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { studentSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";
import { generateStudentId } from "@/lib/utils";
import { hashPassword, validatePasswordStrength } from "@/lib/users";
import { Role } from "@prisma/client";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth("students:read");
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const classId = searchParams.get("classId");
  const division = searchParams.get("division");
  const grade = searchParams.get("grade");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

  const where = {
    isActive: true,
    ...(classId && classId !== "all" && { classId }),
    ...(division && division !== "all" && { division }),
    ...(grade && grade !== "all" && {
      class: { grade: parseInt(grade, 10) },
    }),
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: "insensitive" as const } },
        { lastName: { contains: search, mode: "insensitive" as const } },
        { studentId: { contains: search, mode: "insensitive" as const } },
        { rollNumber: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where,
      include: {
        class: true,
        parents: { include: { parent: true } },
        fees: { where: { status: { in: ["PENDING", "OVERDUE"] } } },
      },
      orderBy: [{ class: { grade: "asc" } }, { division: "asc" }, { rollNumber: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.student.count({ where }),
  ]);

  return NextResponse.json({
    students,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth("students:write");
  if (error) return error;

  try {
    const body = await req.json();
    const data = studentSchema.parse(body);

    const year = new Date().getFullYear();
    const count = await prisma.student.count();
    const studentId = generateStudentId(year, count + 1);

    const portalEmail =
      data.createPortalAccount && data.portalEmail?.trim()
        ? data.portalEmail.trim().toLowerCase()
        : data.email?.trim() || null;

    const student = await prisma.$transaction(async (tx) => {
      let userId: string | undefined;

      if (data.createPortalAccount && portalEmail && data.password) {
        const strengthError = validatePasswordStrength(data.password);
        if (strengthError) throw new Error(strengthError);
        const existingUser = await tx.user.findUnique({ where: { email: portalEmail } });
        if (existingUser) throw new Error("An account with this email already exists");
        const hashed = await hashPassword(data.password);
        const portalUser = await tx.user.create({
          data: {
            email: portalEmail,
            password: hashed,
            name: `${data.firstName} ${data.lastName}`,
            role: Role.STUDENT,
            isActive: true,
          },
        });
        userId = portalUser.id;
      }

      const parent = await tx.parent.create({
        data: {
          firstName: data.parentFirstName,
          lastName: data.parentLastName,
          email: data.parentEmail,
          phone: data.parentPhone,
        },
      });

      const newStudent = await tx.student.create({
        data: {
          studentId,
          userId,
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: new Date(data.dateOfBirth),
          gender: data.gender,
          bloodGroup: data.bloodGroup,
          classId: data.classId,
          division: data.division,
          rollNumber: data.rollNumber,
          address: data.address,
          city: data.city,
          state: data.state,
          pincode: data.pincode,
          phone: data.phone,
          email: portalEmail || data.email || undefined,
          admissionDate: new Date(data.admissionDate),
          parents: {
            create: { parentId: parent.id, isPrimary: true },
          },
        },
        include: { class: true, parents: { include: { parent: true } } },
      });

      return newStudent;
    });

    await createAuditLog({
      userId: session!.user.id,
      action: "CREATE",
      entity: "Student",
      entityId: student.id,
      newData: student,
    });

    return NextResponse.json(student, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create student";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
