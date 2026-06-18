import { Users, IndianRupee, UserPlus, ClipboardCheck, AlertCircle } from "lucide-react";
import { StatsCard } from "@/components/erp/stats-card";
import { RevenueChart } from "@/components/erp/revenue-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export default async function ERPDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Little Champs School ERP
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents}
          change="+12 this month"
          changeType="positive"
          iconName="users"
          delay={0}
        />
        <StatsCard
          title="Fee Collected (This Month)"
          value={formatCurrency(stats.totalCollected)}
          change="On track"
          changeType="positive"
          iconName="rupee"
          iconColor="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          delay={0.1}
        />
        <StatsCard
          title="Pending Fees"
          value={formatCurrency(stats.pendingFees)}
          change="Requires attention"
          changeType="negative"
          iconName="alert"
          iconColor="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-gold" />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentPayments.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent payments. Run seed to populate data.
              </p>
            ) : (
              <div className="space-y-4">
                {stats.recentPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {payment.student.firstName} {payment.student.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payment.student.studentId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-green-600">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(payment.paidAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Announcements</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentAnnouncements.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No announcements yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.recentAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="gold">{announcement.type}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(announcement.publishedAt)}
                    </span>
                  </div>
                  <h4 className="font-medium text-sm">{announcement.title}</h4>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
