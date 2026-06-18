"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  ClipboardCheck,
  Bell,
  Download,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SCHOOL_INFO } from "@/lib/school-data";

export default function StudentPortal() {
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
              <p className="text-xs text-white/60">Student Portal</p>
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
            Hello, {session?.user?.name}!
          </h1>
          <p className="text-muted-foreground">Class 8 - A &bull; Roll No: 15</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Attendance", value: "92%", icon: ClipboardCheck, color: "bg-green-100 text-green-700" },
            { title: "Subjects", value: "8", icon: BookOpen, color: "bg-blue-100 text-blue-700" },
            { title: "Notices", value: "3", icon: Bell, color: "bg-purple-100 text-purple-700" },
            { title: "Documents", value: "4", icon: Download, color: "bg-amber-100 text-amber-700" },
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
              <CardTitle>Academic Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { subject: "Mathematics", marks: 88, grade: "A" },
                { subject: "Science", marks: 92, grade: "A+" },
                { subject: "English", marks: 85, grade: "A" },
                { subject: "Hindi", marks: 78, grade: "B+" },
                { subject: "Social Studies", marks: 82, grade: "A" },
              ].map((subject) => (
                <div key={subject.subject} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <span className="font-medium text-sm">{subject.subject}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm">{subject.marks}/100</span>
                    <Badge variant="gold">{subject.grade}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notices & Announcements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "Mid-Term Exam Schedule", type: "ACADEMIC", date: "Jan 5, 2025" },
                { title: "Science Project Submission", type: "ACADEMIC", date: "Jan 15, 2025" },
                { title: "Sports Day Registration", type: "GENERAL", date: "Jan 20, 2025" },
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
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Download Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {["Report Card - Term 1", "ID Card", "Fee Receipt - Dec 2024", "Syllabus"].map(
                (doc) => (
                  <Button key={doc} variant="outline" className="justify-start gap-2">
                    <Download className="h-4 w-4" />
                    {doc}
                  </Button>
                )
              )}
            </div>
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
