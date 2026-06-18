import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { feeSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth("fees:read");
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");

  const where = {
    ...(studentId && { studentId }),
    ...(status && { status: status as "PENDING" | "PAID" | "OVERDUE" | "PARTIAL" }),
  };

  const [fees, total] = await Promise.all([
    prisma.fee.findMany({
      where,
      include: {
        student: {
          select: { firstName: true, lastName: true, studentId: true, class: true },
        },
        payments: true,
      },
      orderBy: { dueDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.fee.count({ where }),
  ]);

  return NextResponse.json({
    fees,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth("fees:write");
  if (error) return error;

  try {
    const body = await req.json();
    const data = feeSchema.parse(body);

    const fee = await prisma.fee.create({
      data: {
        studentId: data.studentId,
        feeType: data.feeType,
        title: data.title,
        amount: data.amount,
        dueDate: new Date(data.dueDate),
        academicYear: data.academicYear,
        month: data.month,
        description: data.description,
      },
      include: {
        student: {
          select: { firstName: true, lastName: true, studentId: true },
        },
      },
    });

    await createAuditLog({
      userId: session!.user.id,
      action: "CREATE",
      entity: "Fee",
      entityId: fee.id,
      newData: fee,
    });

    return NextResponse.json(fee, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create fee";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
