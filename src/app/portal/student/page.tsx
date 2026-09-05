"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ClipboardCheck, Bell, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PortalShell } from "@/components/layout/portal-shell";
import { apiFetch } from "@/lib/api-client";
import { formatCurrency, formatDate } from "@/lib/utils";

interface PortalData {
  student: {
    firstName: string;
    lastName: string;
    studentId: string;
    rollNumber: string;
    division: string;
    class: { name: string; section: string | null };
  };
  attendancePercent: number;
  fees: Array<{
    id: string;
    title: string;
    amount: number;
    status: string;
    dueDate: string;
  }>;
  grades: Array<{
    marks: number;
    grade: string;
    subject: { name: string };
  }>;
  announcements: Array<{
    id: string;
    title: string;
    type: string;
    publishedAt: string;
  }>;
}

export default function StudentPortal() {
  const [data, setData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<PortalData>("/api/me/student")
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const student = data?.student;

  return (
    <PortalShell badge="Student Portal">
      <div>
        {loading ? (
          <Skeleton className="h-10 w-64" />
        ) : (
          <>
            <h1 className="page-heading">Hello, {student?.firstName ?? "Student"}!</h1>
            <p className="page-subheading">
              {student
                ? `${student.class.name}${student.class.section ? ` (${student.class.section})` : ""} — Division ${student.division} • Roll ${student.rollNumber}`
                : "Your profile is loading"}
            </p>
          </>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Attendance", value: loading ? "—" : `${data?.attendancePercent ?? 0}%`, icon: ClipboardCheck, color: "from-green-500 to-emerald-400" },
          { title: "Subjects", value: loading ? "—" : String(data?.grades?.length ?? 0), icon: BookOpen, color: "from-blue-600 to-sky-500" },
          { title: "Notices", value: loading ? "—" : String(data?.announcements?.length ?? 0), icon: Bell, color: "from-purple-500 to-pink-400" },
          { title: "Pending Fees", value: loading ? "—" : String(data?.fees?.filter((f) => f.status !== "PAID").length ?? 0), icon: IndianRupee, color: "from-orange-500 to-amber-400" },
        ].map((stat) => (
          <Card key={stat.title} className="rounded-2xl border-0 shadow-soft">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">{stat.title}</p>
                <p className="text-xl font-display font-bold text-slate-800 dark:text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-0 shadow-soft">
          <CardHeader><CardTitle>Academic Performance</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : data?.grades?.length ? (
              data.grades.map((g) => (
                <div key={g.subject.name} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">{g.subject.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500">{g.marks}/100</span>
                    <Badge variant="warning">{g.grade ?? "—"}</Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No grades recorded yet.</p>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-soft">
          <CardHeader><CardTitle>Notices & Announcements</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : data?.announcements?.length ? (
              data.announcements.map((notice) => (
                <div key={notice.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">{notice.title}</p>
                    <p className="text-xs text-slate-400">{formatDate(notice.publishedAt)}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">{notice.type}</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No announcements.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardHeader><CardTitle>Fee Status</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <Skeleton className="h-20 w-full" />
          ) : data?.fees?.length ? (
            data.fees.map((fee) => (
              <div key={fee.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-sm">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">{fee.title}</p>
                  <p className="text-xs text-muted-foreground">Due {formatDate(fee.dueDate)}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(fee.amount)}</p>
                  <Badge variant={fee.status === "PAID" ? "success" : "warning"}>{fee.status}</Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">No fee records.</p>
          )}
        </CardContent>
      </Card>

      <div className="text-center pt-2">
        <Link href="/" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold">
          ← Back to school website
        </Link>
      </div>
    </PortalShell>
  );
}
