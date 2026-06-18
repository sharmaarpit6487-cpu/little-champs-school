"use client";

import { useEffect, useState } from "react";
import { UserPlus, CheckCircle, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

interface Admission {
  id: string;
  applicationNo: string;
  studentName: string;
  applyingClass: string;
  parentName: string;
  parentPhone: string;
  status: string;
  createdAt: string;
}

const statusVariant: Record<string, "warning" | "success" | "destructive" | "default"> = {
  PENDING: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  ENROLLED: "success",
  UNDER_REVIEW: "default",
};

export default function AdmissionsPage() {
  const [admissions, setAdmissions] = useState<Admission[]>([]);

  useEffect(() => {
    fetch("/api/admissions")
      .then((r) => r.json())
      .then(setAdmissions)
      .catch(() => setAdmissions([]));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Admissions</h1>
        <p className="text-muted-foreground">Review and manage admission applications</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-4">
        {["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"].map((status) => (
          <Card key={status}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {admissions.filter((a) => a.status === status).length}
              </p>
              <p className="text-sm text-muted-foreground capitalize">
                {status.toLowerCase().replace("_", " ")}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-gold" />
            Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {admissions.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No admission applications yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application No.</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admissions.map((admission) => (
                  <TableRow key={admission.id}>
                    <TableCell className="font-mono text-sm">
                      {admission.applicationNo}
                    </TableCell>
                    <TableCell className="font-medium">{admission.studentName}</TableCell>
                    <TableCell>{admission.applyingClass}</TableCell>
                    <TableCell>
                      <p>{admission.parentName}</p>
                      <p className="text-xs text-muted-foreground">{admission.parentPhone}</p>
                    </TableCell>
                    <TableCell>{formatDate(admission.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[admission.status] || "default"}>
                        {admission.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {admission.status === "PENDING" && (
                          <>
                            <Button variant="ghost" size="icon" className="text-green-600">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
