import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/api-auth";
import { announcementSchema } from "@/lib/validations";
import { createAuditLog } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const { error } = await requireAuth("announcements:read");
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const publishedOnly = searchParams.get("publishedOnly") !== "false";

  const announcements = await prisma.announcement.findMany({
    where: publishedOnly ? { isPublished: true } : undefined,
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json({ announcements });
}

export async function POST(req: NextRequest) {
  const { error, session } = await requireAuth("announcements:write");
  if (error) return error;

  try {
    const body = await req.json();
    const data = announcementSchema.parse(body);

    const targetRoles =
      data.targetRoles && data.targetRoles.length > 0
        ? (data.targetRoles as Role[])
        : [Role.ADMIN, Role.TEACHER, Role.PARENT, Role.STUDENT, Role.ACCOUNTANT];

    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        type: data.type,
        targetRoles,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        createdBy: session!.user.id,
        isPublished: true,
      },
    });

    await createAuditLog({
      userId: session!.user.id,
      action: "CREATE",
      entity: "Announcement",
      entityId: announcement.id,
      newData: announcement,
    });

    return NextResponse.json(announcement, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create announcement";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
