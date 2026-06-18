import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { studentSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";
import { generateStudentId } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth("students:read");
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const classId = searchParams.get("classId");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where = {
    isActive: true,
    ...(classId && { classId }),
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
      orderBy: { createdAt: "desc" },
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

    const student = await prisma.$transaction(async (tx) => {
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
          email: data.email || undefined,
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
