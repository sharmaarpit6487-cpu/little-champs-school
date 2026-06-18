import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { admissionSchema } from "@/lib/validations";
import { generateApplicationNo } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth("admissions:read");
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const admissions = await prisma.admission.findMany({
    where: status ? { status: status as "PENDING" | "APPROVED" | "REJECTED" } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(admissions);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = admissionSchema.parse(body);

    const admission = await prisma.admission.create({
      data: {
        applicationNo: generateApplicationNo(),
        studentName: data.studentName,
        dateOfBirth: new Date(data.dateOfBirth),
        gender: data.gender,
        applyingClass: data.applyingClass,
        parentName: data.parentName,
        parentEmail: data.parentEmail,
        parentPhone: data.parentPhone,
        address: data.address,
        previousSchool: data.previousSchool,
      },
    });

    return NextResponse.json(admission, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to submit application";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
