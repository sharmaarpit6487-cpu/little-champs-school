"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  GraduationCap,
  IndianRupee,
  Bell,
  Download,
  LogOut,
  User,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SCHOOL_INFO } from "@/lib/school-data";
import { formatCurrency } from "@/lib/utils";

export default function ParentPortal() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-navy text-white">
        <div className="container-custom flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold text-navy">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display font-bold text-sm">{SCHOOL_INFO.name}</p>
              <p className="text-xs text-white/60">Parent Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container-custom p-6 space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold">
            Welcome, {session?.user?.name}
          </h1>
          <p className="text-muted-foreground">Parent Portal Dashboard</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Children", value: "1", icon: User, color: "bg-blue-100 text-blue-700" },
            { title: "Pending Fees", value: formatCurrency(5500), icon: IndianRupee, color: "bg-amber-100 text-amber-700" },
            { title: "Notices", value: "3", icon: Bell, color: "bg-purple-100 text-purple-700" },
            { title: "Documents", value: "5", icon: Download, color: "bg-green-100 text-green-700" },
          ].map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6 flex items-center gap-4">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Child Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-xl">
                  A
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Aarav Sharma</h3>
                  <p className="text-sm text-muted-foreground">Class 8 - A &bull; Roll No: 15</p>
                  <p className="text-xs text-muted-foreground font-mono">LCS20240001</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Attendance</p>
                  <p className="font-semibold text-green-600">92%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Academic Performance</p>
                  <p className="font-semibold">A Grade</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fee Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "Tuition Fee - January", amount: 5500, status: "PENDING", due: "Jan 10, 2025" },
                { title: "Tuition Fee - December", amount: 5500, status: "PAID", due: "Dec 10, 2024" },
              ].map((fee) => (
                <div key={fee.title} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{fee.title}</p>
                    <p className="text-xs text-muted-foreground">Due: {fee.due}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(fee.amount)}</p>
                    <Badge variant={fee.status === "PAID" ? "success" : "warning"}>
                      {fee.status}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                Download Receipts
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: "Parent-Teacher Meeting - Dec 28", type: "ACADEMIC", date: "Dec 10, 2024" },
              { title: "Fee Payment Deadline - January", type: "FEE", date: "Dec 20, 2024" },
              { title: "Winter Break Schedule", type: "URGENT", date: "Dec 15, 2024" },
            ].map((notice) => (
              <div key={notice.title} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="font-medium text-sm">{notice.title}</p>
                  <p className="text-xs text-muted-foreground">{notice.date}</p>
                </div>
                <Badge variant="secondary">{notice.type}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to school website
          </Link>
        </div>
      </main>
    </div>
  );
}
