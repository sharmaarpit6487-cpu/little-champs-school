import { Session } from "next-auth";
import { NextResponse } from "next/server";
import prisma from "./prisma";

/** Ensure a student portal user can only access their own student record */
export async function assertStudentRecordAccess(
  session: Session,
  studentId: string
): Promise<{ error: NextResponse | null; studentId: string | null }> {
  const role = session.user.role;

  if (role === "SUPER_ADMIN" || role === "ADMIN" || role === "TEACHER" || role === "ACCOUNTANT") {
    return { error: null, studentId };
  }

  if (role === "STUDENT") {
    const student = await prisma.student.findFirst({
      where: { userId: session.user.id, isActive: true },
      select: { id: true },
    });
    if (!student || student.id !== studentId) {
      return {
        error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
        studentId: null,
      };
    }
    return { error: null, studentId: student.id };
  }

  if (role === "PARENT") {
    const parent = await prisma.parent.findFirst({
      where: { userId: session.user.id },
      select: { id: true },
    });
    if (!parent) {
      return {
        error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
        studentId: null,
      };
    }
    const link = await prisma.parentStudent.findFirst({
      where: { parentId: parent.id, studentId },
    });
    if (!link) {
      return {
        error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
        studentId: null,
      };
    }
    return { error: null, studentId };
  }

  return {
    error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    studentId: null,
  };
}

export async function getStudentIdForSession(session: Session): Promise<string | null> {
  if (session.user.role !== "STUDENT") return null;
  const student = await prisma.student.findFirst({
    where: { userId: session.user.id, isActive: true },
    select: { id: true },
  });
  return student?.id ?? null;
}
