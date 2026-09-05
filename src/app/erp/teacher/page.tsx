import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  ClipboardList,
  Users,
  Bell,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import { authOptions } from "@/lib/auth";
import { ERPPageHeader } from "@/components/erp/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import prisma from "@/lib/prisma";

export default async function TeacherDashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "TEACHER") {
    redirect("/erp");
  }

  const teacher = await prisma.teacher.findFirst({
    where: { userId: session.user.id, isActive: true },
    include: {
      subjects: {
        include: {
          class: {
            include: {
              _count: { select: { students: { where: { isActive: true } } } },
            },
          },
          subject: true,
        },
      },
    },
  });

  const assignedClasses = teacher?.subjects ?? [];
  const classIds = [...new Set(assignedClasses.map((cs) => cs.classId))];

  const totalStudents =
    classIds.length > 0
      ? await prisma.student.count({
          where: { isActive: true, classId: { in: classIds } },
        })
      : await prisma.student.count({ where: { isActive: true } });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const attendanceMarkedToday = await prisma.attendance.count({
    where: {
      date: today,
      ...(classIds.length > 0 && { classId: { in: classIds } }),
    },
  });

  const announcements = await prisma.announcement.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: 5,
    select: { id: true, title: true, type: true, publishedAt: true },
  });

  return (
    <div className="space-y-6">
      <ERPPageHeader
        title={`Welcome, ${teacher?.firstName ?? session.user.name}`}
        description={
          teacher
            ? `${teacher.designation} • ${teacher.department}`
            : "Teacher dashboard"
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-0 shadow-soft">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-950/50 flex items-center justify-center">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Students</p>
              <p className="text-2xl font-bold">{totalStudents}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-soft">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-950/50 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assigned Classes</p>
              <p className="text-2xl font-bold">{classIds.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-soft">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Marked Today</p>
              <p className="text-2xl font-bold">{attendanceMarkedToday}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-0 shadow-soft">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-amber-100 dark:bg-amber-950/50 flex items-center justify-center">
              <Bell className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Notices</p>
              <p className="text-2xl font-bold">{announcements.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-0 shadow-soft">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-3">
            <Link href="/erp/attendance">
              <Button variant="default" className="w-full gap-2 justify-start h-12">
                <ClipboardList className="h-4 w-4" />
                Mark Attendance
              </Button>
            </Link>
            <Link href="/erp/students">
              <Button variant="outline" className="w-full gap-2 justify-start h-12">
                <Users className="h-4 w-4" />
                View Students
              </Button>
            </Link>
            <Link href="/erp/announcements">
              <Button variant="outline" className="w-full gap-2 justify-start h-12">
                <Bell className="h-4 w-4" />
                Announcements
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-soft">
          <CardHeader>
            <CardTitle>My Classes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignedClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No class assignments yet. Contact the admin office to assign subjects.
              </p>
            ) : (
              assignedClasses.map((cs) => (
                <div
                  key={cs.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                >
                  <div>
                    <p className="font-semibold text-sm">
                      {cs.class.name}
                      {cs.class.section ? ` (${cs.class.section})` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">{cs.subject.name}</p>
                  </div>
                  <Badge variant="secondary">
                    {cs.class._count.students} students
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {announcements.length > 0 && (
        <Card className="rounded-2xl border-0 shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Announcements</CardTitle>
            <Link href="/erp/announcements">
              <Button variant="ghost" size="sm" className="gap-1">
                View all <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {announcements.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <p className="font-medium text-sm">{a.title}</p>
                <Badge variant="secondary">{a.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
