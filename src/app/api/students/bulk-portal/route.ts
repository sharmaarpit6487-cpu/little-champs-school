import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { createAuditLog } from "@/lib/audit";
import { hashPassword, validatePasswordStrength } from "@/lib/users";
import { Role } from "@prisma/client";
import { z } from "zod";

const bulkPortalSchema = z.object({
  defaultPassword: z.string().min(8),
  classId: z.string().optional(),
  studentIds: z.array(z.string()).optional(),
});

function portalEmailForStudent(student: {
  email: string | null;
  studentId: string;
  firstName: string;
  lastName: string;
}) {
  if (student.email?.trim()) {
    return student.email.trim().toLowerCase();
  }
  const slug = student.studentId.toLowerCase();
  return `student.${slug}@littlechamps.edu`;
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth("students:write");
  if (error) return error;

  try {
    const body = await req.json();
    const data = bulkPortalSchema.parse(body);

    const strengthError = validatePasswordStrength(data.defaultPassword);
    if (strengthError) {
      return NextResponse.json({ error: strengthError }, { status: 400 });
    }

    const students = await prisma.student.findMany({
      where: {
        isActive: true,
        userId: null,
        ...(data.classId && { classId: data.classId }),
        ...(data.studentIds?.length && { id: { in: data.studentIds } }),
      },
      select: {
        id: true,
        studentId: true,
        firstName: true,
        lastName: true,
        email: true,
      },
    });

    if (students.length === 0) {
      return NextResponse.json({
        created: 0,
        skipped: 0,
        accounts: [],
        message: "No students without portal accounts match your criteria",
      });
    }

    const hashed = await hashPassword(data.defaultPassword);
    const created: { studentId: string; name: string; email: string }[] = [];
    let skipped = 0;

    for (const student of students) {
      const email = portalEmailForStudent(student);
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        skipped += 1;
        continue;
      }

      const user = await prisma.user.create({
        data: {
          email,
          password: hashed,
          name: `${student.firstName} ${student.lastName}`,
          role: Role.STUDENT,
          isActive: true,
        },
      });

      await prisma.student.update({
        where: { id: student.id },
        data: { userId: user.id, email },
      });

      created.push({
        studentId: student.studentId,
        name: `${student.firstName} ${student.lastName}`,
        email,
      });
    }

    await createAuditLog({
      userId: session!.user.id,
      action: "BULK_PORTAL_ACCOUNTS",
      entity: "Student",
      newData: { created: created.length, skipped },
    });

    return NextResponse.json({
      created: created.length,
      skipped,
      accounts: created,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Bulk portal creation failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function GET() {
  const { error } = await requireAuth("students:read");
  if (error) return error;

  const count = await prisma.student.count({
    where: { isActive: true, userId: null },
  });

  return NextResponse.json({ withoutPortalAccount: count });
}
