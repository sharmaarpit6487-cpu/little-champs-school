import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  const { error } = await requireAuth("students:read");
  if (error) return error;

  const classes = await prisma.class.findMany({
    where: { isActive: true },
    orderBy: [{ grade: "asc" }, { section: "asc" }],
    select: {
      id: true,
      name: true,
      grade: true,
      section: true,
      _count: { select: { students: { where: { isActive: true } } } },
    },
  });

  return NextResponse.json({ classes });
}
