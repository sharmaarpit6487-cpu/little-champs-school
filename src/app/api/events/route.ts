import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { eventSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

export async function GET() {
  const { error } = await requireAuth("events:read");
  if (error) return error;

  const events = await prisma.event.findMany({
    where: { isPublished: true },
    orderBy: { startDate: "asc" },
  });

  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth("events:write");
  if (error) return error;

  try {
    const body = await req.json();
    const data = eventSchema.parse(body);

    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        location: data.location,
        createdBy: session!.user.id,
        isPublished: true,
      },
    });

    await createAuditLog({
      userId: session!.user.id,
      action: "CREATE",
      entity: "Event",
      entityId: event.id,
      newData: event,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create event";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
