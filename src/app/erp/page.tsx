import Link from "next/link";
import {
  UserPlus,
  ClipboardCheck,
  IndianRupee,
  ArrowRight,
} from "lucide-react";
import { StatsCard } from "@/components/erp/stats-card";
import { RevenueChart } from "@/components/erp/revenue-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";

async function getDashboardStats() {
  try {
    const [
      totalStudents,
      pendingFees,
      newAdmissions,
      recentPayments,
      recentAnnouncements,
    ] = await Promise.all([
      prisma.student.count({ where: { isActive: true } }),
      prisma.fee.aggregate({
        where: { status: { in: ["PENDING", "OVERDUE", "PARTIAL"] } },
        _sum: { amount: true },
      }),
      prisma.admission.count({
        where: {
          status: "PENDING",
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.feePayment.findMany({
        take: 5,
        orderBy: { paidAt: "desc" },
        include: {
          student: { select: { firstName: true, lastName: true, studentId: true } },
        },
      }),
      prisma.announcement.findMany({
        take: 5,
        orderBy: { publishedAt: "desc" },
        where: { isPublished: true },
      }),
    ]);

    const totalCollected = await prisma.feePayment.aggregate({
      _sum: { amount: true },
      where: {
        paidAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    return {
      totalStudents,
      totalCollected: totalCollected._sum.amount || 0,
      pendingFees: pendingFees._sum.amount || 0,
      newAdmissions,
      recentPayments,
      recentAnnouncements,
    };
  } catch {
    return {
      totalStudents: 0,
      totalCollected: 0,
      pendingFees: 0,
      newAdmissions: 0,
      recentPayments: [],
      recentAnnouncements: [],
    };
  }
}

const QUICK_ACTIONS = [
  { href: "/erp/students/new", label: "Add Student", icon: UserPlus, color: "bg-brand-blue" },
  { href: "/erp/fees", label: "Collect Fee", icon: IndianRupee, color: "bg-brand-green" },
  { href: "/erp/announcements", label: "Announcement", icon: ClipboardCheck, color: "bg-brand-orange" },
  { href: "/erp/reports", label: "Export Report", icon: IndianRupee, color: "bg-purple-500" },
];

const badgeVariant: Record<string, "default" | "warning" | "success" | "sky"> = {
  GENERAL: "sky",
  URGENT: "warning",
  FEE: "warning",
  ACADEMIC: "success",
  EVENT: "default",
};

export default async function ERPDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
            Dashboard
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Welcome to Little Champs School ERP
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.href} href={action.href}>
              <Button variant="outline" size="sm" className="gap-2 rounded-xl border-slate-200">
                <span className={`flex h-6 w-6 items-center justify-center rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-3.5 w-3.5" />
                </span>
                {action.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          change="+12 this month"
          changeType="positive"
          iconName="users"
          delay={0}
        />
        <StatsCard
          title="Fee Collected"
          value={formatCurrency(stats.totalCollected)}
          change="This month"
          changeType="positive"
          iconName="rupee"
          delay={0.1}
        />
        <StatsCard
          title="Pending Fees"
          value={formatCurrency(stats.pendingFees)}
          change="Requires attention"
          changeType="negative"
          iconName="alert"
          delay={0.2}
        />
        <StatsCard
          title="New Admissions"
          value={stats.newAdmissions}
          change="Last 30 days"
          changeType="neutral"
          iconName="userPlus"
          delay={0.3}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>

        <Card className="rounded-2xl border-0 shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-lg flex items-center gap-2 text-slate-800 dark:text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                <ClipboardCheck className="h-4 w-4 text-brand-green" />
              </span>
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentPayments.length === 0 ? (
              <div className="text-center py-10">
                <IndianRupee className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No recent payments</p>
                <p className="text-xs text-slate-400 mt-1">Run seed to populate data</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-gray-800/50 hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-green to-emerald-400 flex items-center justify-center text-white text-xs font-bold">
                        {payment.student.firstName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-800 dark:text-white">
                          {payment.student.firstName} {payment.student.lastName}
                        </p>
                        <p className="text-xs text-slate-400">{payment.student.studentId}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-brand-green">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-xs text-slate-400">{formatDate(payment.paidAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/erp/fees" className="block mt-4">
              <Button variant="ghost" size="sm" className="w-full gap-1 text-brand-blue">
                View All Payments <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-lg text-slate-800 dark:text-white">
              Recent Announcements
            </CardTitle>
            <Link href="/erp/announcements">
              <Button variant="ghost" size="sm" className="text-brand-blue gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentAnnouncements.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No announcements yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.recentAnnouncements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="p-4 rounded-xl border border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={badgeVariant[announcement.type] || "default"}>
                      {announcement.type}
                    </Badge>
                    <span className="text-xs text-slate-400">
                      {formatDate(announcement.publishedAt)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-white">
                    {announcement.title}
                  </h4>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
