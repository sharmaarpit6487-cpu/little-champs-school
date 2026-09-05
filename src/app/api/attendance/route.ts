import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { attendanceBulkSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

function parseDateOnly(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export async function GET(req: NextRequest) {
  const { error } = await requireAuth("attendance:read");
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const classId = searchParams.get("classId");
  const date = searchParams.get("date");

  if (!classId || !date) {
    return NextResponse.json(
      { error: "classId and date query parameters are required" },
      { status: 400 }
    );
  }

  const attendanceDate = parseDateOnly(date);

  const students = await prisma.student.findMany({
    where: { classId, isActive: true },
    orderBy: { rollNumber: "asc" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      rollNumber: true,
      studentId: true,
    },
  });

  const attendanceRecords = await prisma.attendance.findMany({
    where: { classId, date: attendanceDate },
  });

  const byStudent = new Map(attendanceRecords.map((r) => [r.studentId, r]));

  const records = students.map((student) => {
    const existing = byStudent.get(student.id);
    return {
      student,
      attendance: existing
        ? {
            id: existing.id,
            status: existing.status,
            remarks: existing.remarks,
          }
        : null,
    };
  });

  return NextResponse.json({
    classId,
    date,
    records,
    summary: {
      total: students.length,
      marked: attendanceRecords.length,
    },
  });
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth("attendance:write");
  if (error) return error;

  try {
    const body = await req.json();
    const data = attendanceBulkSchema.parse(body);
    const attendanceDate = parseDateOnly(data.date);

    const classExists = await prisma.class.findUnique({ where: { id: data.classId } });
    if (!classExists) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    const studentIds = data.records.map((r) => r.studentId);
    const validStudents = await prisma.student.count({
      where: { id: { in: studentIds }, classId: data.classId, isActive: true },
    });

    if (validStudents !== studentIds.length) {
      return NextResponse.json(
        { error: "One or more students do not belong to the selected class" },
        { status: 400 }
      );
    }

    const results = await prisma.$transaction(
      data.records.map((record) =>
        prisma.attendance.upsert({
          where: {
            studentId_date: {
              studentId: record.studentId,
              date: attendanceDate,
            },
          },
          create: {
            studentId: record.studentId,
            classId: data.classId,
            date: attendanceDate,
            status: record.status,
            remarks: record.remarks,
            markedBy: session!.user.id,
          },
          update: {
            status: record.status,
            remarks: record.remarks,
            markedBy: session!.user.id,
            classId: data.classId,
          },
        })
      )
    );

    await createAuditLog({
      userId: session!.user.id,
      action: "MARK_ATTENDANCE",
      entity: "Attendance",
      entityId: data.classId,
      newData: { date: data.date, count: results.length },
    });

    return NextResponse.json({ saved: results.length, records: results }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save attendance";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
