import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { z } from "zod";

const settingsSchema = z.record(z.string(), z.string());

export async function GET() {
  const { error } = await requireAuth("settings:read");
  if (error) return error;

  const settings = await prisma.schoolSettings.findMany({
    orderBy: { key: "asc" },
  });

  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return NextResponse.json({ settings: map, items: settings });
}

export async function PUT(req: NextRequest) {
  const { error } = await requireAuth("settings:write");
  if (error) return error;

  try {
    const body = await req.json();
    const data = settingsSchema.parse(body.settings ?? body);

    await prisma.$transaction(
      Object.entries(data).map(([key, value]) =>
        prisma.schoolSettings.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to save settings";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
