import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { exportStudentsToExcel } from "@/lib/export";

const REPORT_TYPES = [
  "students",
  "pending-fees",
  "admissions",
] as const;

type ReportType = (typeof REPORT_TYPES)[number];

function isReportType(value: string): value is ReportType {
  return REPORT_TYPES.includes(value as ReportType);
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  const { error } = await requireAuth("reports:read");
  if (error) return error;

  const { type } = await params;
  if (!isReportType(type)) {
    return NextResponse.json({ error: "Unknown report type" }, { status: 400 });
  }

  try {
    switch (type) {
      case "students": {
        const students = await prisma.student.findMany({
          where: { isActive: true },
          include: { class: true },
          orderBy: [{ class: { grade: "asc" } }, { rollNumber: "asc" }],
        });
        return exportStudentsToExcel(students);
      }
      case "pending-fees": {
        const fees = await prisma.fee.findMany({
          where: { status: { in: ["PENDING", "OVERDUE", "PARTIAL"] } },
          include: {
            student: { include: { class: true } },
            payments: true,
          },
        });
        const rows = fees.map((fee) => {
          const paid = fee.payments.reduce((s, p) => s + p.amount, 0);
          return {
            "Student ID": fee.student.studentId,
            Name: `${fee.student.firstName} ${fee.student.lastName}`,
            Class: fee.student.class.name,
            Title: fee.title,
            Amount: fee.amount,
            Paid: paid,
            Outstanding: fee.amount + fee.lateFee - paid,
            Status: fee.status,
            "Due Date": fee.dueDate.toISOString().split("T")[0],
          };
        });
        const { exportToExcel } = await import("@/lib/export");
        return exportToExcel(rows, "pending-fees-report", "Pending Fees");
      }
      case "admissions": {
        const admissions = await prisma.admission.findMany({
          orderBy: { createdAt: "desc" },
        });
        const rows = admissions.map((a) => ({
          "Application No": a.applicationNo,
          Student: a.studentName,
          Class: a.applyingClass,
          Parent: a.parentName,
          Phone: a.parentPhone,
          Status: a.status,
          Date: a.createdAt.toISOString().split("T")[0],
        }));
        const { exportToExcel } = await import("@/lib/export");
        return exportToExcel(rows, "admissions-report", "Admissions");
      }
      default:
        return NextResponse.json({ error: "Not implemented" }, { status: 501 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
