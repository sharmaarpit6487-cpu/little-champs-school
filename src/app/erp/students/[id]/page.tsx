"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Edit, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ERPPageHeader } from "@/components/erp/page-header";
import { formatDate } from "@/lib/utils";

interface StudentDetail {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  class: { name: string };
  division: string;
  rollNumber: string;
  address: string;
  city: string;
  phone?: string;
  email?: string;
  admissionDate: string;
  parents: { parent: { firstName: string; lastName: string; phone: string; email: string } }[];
}

export default function StudentDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/students/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Student not found");
        return r.json();
      })
      .then(setStudent)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" aria-label="Loading" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 dark:text-slate-400 mb-4">{error || "Student not found"}</p>
        <Link href="/erp/students">
          <Button variant="outline">Back to Students</Button>
        </Link>
      </div>
    );
  }

  const parent = student.parents[0]?.parent;

  return (
    <div className="space-y-6">
      <ERPPageHeader
        title={`${student.firstName} ${student.lastName}`}
        description={student.studentId}
        action={
          <div className="flex gap-2">
            <Link href="/erp/students">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            </Link>
            <Link href={`/erp/students/${id}/edit`}>
              <Button variant="default" className="gap-2">
                <Edit className="h-4 w-4" /> Edit
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border-0 shadow-soft">
          <CardHeader><CardTitle>Student Information</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Class</span><span className="font-semibold">{student.class.name} - {student.division}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Roll Number</span><span className="font-semibold">{student.rollNumber}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Gender</span><Badge variant="secondary">{student.gender}</Badge></div>
            <div className="flex justify-between"><span className="text-slate-500">Date of Birth</span><span>{formatDate(student.dateOfBirth)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Admission Date</span><span>{formatDate(student.admissionDate)}</span></div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-0 shadow-soft">
          <CardHeader><CardTitle>Contact & Address</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-slate-600 dark:text-slate-400">{student.address}, {student.city}</p>
            {student.phone && <p>Phone: {student.phone}</p>}
            {student.email && <p>Email: {student.email}</p>}
            {parent && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <p className="font-semibold mb-1">Parent: {parent.firstName} {parent.lastName}</p>
                <p className="text-slate-500">{parent.phone} &bull; {parent.email}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
