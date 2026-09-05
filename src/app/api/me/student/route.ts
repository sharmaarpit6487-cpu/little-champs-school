import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { getStudentIdForSession } from "@/lib/access-control";

export async function GET() {
  const { error, session } = await requireAuth();
  if (error || !session) return error!;

  if (session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const studentId = await getStudentIdForSession(session);
  if (!studentId) {
    return NextResponse.json({ error: "Student profile not linked to this account" }, { status: 404 });
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      class: true,
      fees: {
        include: { payments: true },
        orderBy: { dueDate: "desc" },
        take: 12,
      },
      attendances: {
        orderBy: { date: "desc" },
        take: 60,
      },
      grades: { include: { subject: true } },
    },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const totalDays = student.attendances.length;
  const presentDays = student.attendances.filter((a) =>
    ["PRESENT", "LATE", "HALF_DAY"].includes(a.status)
  ).length;
  const attendancePercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  const announcements = await prisma.announcement.findMany({
    where: {
      isPublished: true,
      OR: [
        { targetRoles: { isEmpty: true } },
        { targetRoles: { has: "STUDENT" } },
      ],
    },
    orderBy: { publishedAt: "desc" },
    take: 10,
    select: {
      id: true,
      title: true,
      content: true,
      type: true,
      publishedAt: true,
    },
  });

  return NextResponse.json({
    student: {
      id: student.id,
      studentId: student.studentId,
      firstName: student.firstName,
      lastName: student.lastName,
      rollNumber: student.rollNumber,
      division: student.division,
      class: student.class,
      email: student.email,
      phone: student.phone,
    },
    attendancePercent,
    fees: student.fees,
    grades: student.grades,
    announcements,
  });
}
