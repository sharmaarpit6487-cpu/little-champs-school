import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { error, session } = await requireAuth();
  if (error || !session) return error!;

  if (session.user.role !== "PARENT") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parent = await prisma.parent.findFirst({
    where: { userId: session.user.id },
    include: {
      students: {
        include: {
          student: {
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
          },
        },
      },
    },
  });

  if (!parent) {
    return NextResponse.json({ error: "Parent profile not linked to this account" }, { status: 404 });
  }

  const children = parent.students.map((link) => {
    const s = link.student;
    const totalDays = s.attendances.length;
    const presentDays = s.attendances.filter((a) =>
      ["PRESENT", "LATE", "HALF_DAY"].includes(a.status)
    ).length;
    const attendancePercent = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

    const pendingFees = s.fees.filter((f) => f.status !== "PAID");
    const pendingTotal = pendingFees.reduce((sum, f) => {
      const paid = f.payments.reduce((p, pay) => p + pay.amount, 0);
      return sum + f.amount + f.lateFee - paid;
    }, 0);

    return {
      id: s.id,
      studentId: s.studentId,
      firstName: s.firstName,
      lastName: s.lastName,
      rollNumber: s.rollNumber,
      division: s.division,
      class: s.class,
      attendancePercent,
      pendingFeesTotal: pendingTotal,
      fees: s.fees,
      grades: s.grades,
      isPrimary: link.isPrimary,
    };
  });

  const announcements = await prisma.announcement.findMany({
    where: {
      isPublished: true,
      OR: [
        { targetRoles: { isEmpty: true } },
        { targetRoles: { has: "PARENT" } },
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

  const totalPending = children.reduce((sum, c) => sum + c.pendingFeesTotal, 0);

  return NextResponse.json({
    parent: {
      firstName: parent.firstName,
      lastName: parent.lastName,
      email: parent.email,
      phone: parent.phone,
    },
    children,
    totalPendingFees: totalPending,
    announcements,
  });
}
