"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IndianRupee, Bell, User, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PortalShell } from "@/components/layout/portal-shell";
import { apiFetch } from "@/lib/api-client";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";

interface ChildFee {
  id: string;
  title: string;
  amount: number;
  status: string;
  dueDate: string;
  lateFee: number;
  payments: { amount: number }[];
}

interface ChildGrade {
  marks: number;
  grade: string;
  subject: { name: string };
}

interface Child {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  division: string;
  class: { name: string; section: string | null };
  attendancePercent: number;
  pendingFeesTotal: number;
  fees: ChildFee[];
  grades: ChildGrade[];
  isPrimary: boolean;
}

interface ParentPortalData {
  parent: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  children: Child[];
  totalPendingFees: number;
  announcements: Array<{
    id: string;
    title: string;
    content: string;
    type: string;
    publishedAt: string;
  }>;
}

export default function ParentPortal() {
  const [data, setData] = useState<ParentPortalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<ParentPortalData>("/api/me/parent")
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  const children = data?.children ?? [];

  return (
    <PortalShell badge="Parent Portal">
      <div>
        {loading ? (
          <Skeleton className="h-10 w-64" />
        ) : (
          <>
            <h1 className="page-heading">
              Welcome, {data?.parent?.firstName ?? "Parent"}
            </h1>
            <p className="page-subheading">Parent Portal Dashboard</p>
          </>
        )}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Children",
            value: loading ? "—" : String(children.length),
            icon: User,
            color: "from-blue-600 to-sky-500",
          },
          {
            title: "Pending Fees",
            value: loading ? "—" : formatCurrency(data?.totalPendingFees ?? 0),
            icon: IndianRupee,
            color: "from-orange-500 to-amber-400",
          },
          {
            title: "Notices",
            value: loading ? "—" : String(data?.announcements?.length ?? 0),
            icon: Bell,
            color: "from-purple-500 to-pink-400",
          },
          {
            title: "Documents",
            value: loading ? "—" : String(children.reduce((n, c) => n + c.fees.length, 0)),
            icon: Download,
            color: "from-green-500 to-emerald-400",
          },
        ].map((stat) => (
          <Card key={stat.title} className="rounded-2xl border-0 shadow-soft">
            <CardContent className="p-5 flex items-center gap-4">
              <div
                className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg shrink-0`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
                  {stat.title}
                </p>
                <p className="text-xl font-display font-bold text-slate-800 dark:text-white truncate">
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : children.length === 0 ? (
        <Card className="rounded-2xl border-0 shadow-soft">
          <CardContent className="py-12 text-center text-muted-foreground">
            No children linked to your account. Please contact the school office.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {children.map((child) => (
            <div key={child.id} className="grid lg:grid-cols-2 gap-6">
              <Card className="rounded-2xl border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>
                    {child.firstName} {child.lastName}
                    {child.isPrimary && (
                      <Badge variant="secondary" className="ml-2">Primary</Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 flex items-center justify-center text-white font-bold text-xl shrink-0"
                      aria-hidden="true"
                    >
                      {getInitials(`${child.firstName} ${child.lastName}`)}
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
                        {child.firstName} {child.lastName}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {child.class.name}
                        {child.class.section ? ` (${child.class.section})` : ""} • Division {child.division} • Roll {child.rollNumber}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-mono font-semibold">
                        {child.studentId}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded-xl bg-green-50 dark:bg-green-950/40">
                      <p className="text-slate-500 dark:text-slate-400">Attendance</p>
                      <p className="font-bold text-green-600 dark:text-green-400 text-lg">
                        {child.attendancePercent}%
                      </p>
                    </div>
                    <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40">
                      <p className="text-slate-500 dark:text-slate-400">Subjects</p>
                      <p className="font-bold text-blue-600 dark:text-blue-400 text-lg">
                        {child.grades.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>Fee Status — {child.firstName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {child.fees.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No fee records</p>
                  ) : (
                    child.fees.slice(0, 5).map((fee) => (
                      <div
                        key={fee.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 gap-3"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">
                            {fee.title}
                          </p>
                          <p className="text-xs text-slate-400">Due: {formatDate(fee.dueDate)}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-bold text-slate-800 dark:text-white">
                            {formatCurrency(fee.amount + fee.lateFee)}
                          </p>
                          <Badge variant={fee.status === "PAID" ? "success" : "warning"}>
                            {fee.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                  {child.pendingFeesTotal > 0 && (
                    <p className="text-sm font-semibold text-orange-600 dark:text-orange-400 pt-2">
                      Outstanding: {formatCurrency(child.pendingFeesTotal)}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {!loading && data?.announcements && data.announcements.length > 0 && (
        <Card className="rounded-2xl border-0 shadow-soft">
          <CardHeader>
            <CardTitle>School Notices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.announcements.map((a) => (
              <div
                key={a.id}
                className="p-4 rounded-xl border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-semibold text-sm">{a.title}</p>
                  <Badge variant="secondary">{a.type}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{a.content}</p>
                <p className="text-xs text-slate-400 mt-2">{formatDate(a.publishedAt)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="text-center pt-2">
        <Link
          href="/"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-semibold"
        >
          ← Back to school website
        </Link>
      </div>
    </PortalShell>
  );
}
