"use client";

import { useCallback, useEffect, useState } from "react";
import { UserPlus, CheckCircle, XCircle, Eye } from "lucide-react";
import { toast } from "sonner";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { ERPPageHeader } from "@/components/erp/page-header";
import { apiFetch } from "@/lib/api-client";

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
  const [viewing, setViewing] = useState<Admission | null>(null);

  const loadAdmissions = useCallback(async () => {
    try {
      const data = await apiFetch<Admission[]>("/api/admissions");
      setAdmissions(Array.isArray(data) ? data : []);
    } catch {
      setAdmissions([]);
    }
  }, []);

  useEffect(() => {
    loadAdmissions();
  }, [loadAdmissions]);

  const updateStatus = async (id: string, status: "APPROVED" | "REJECTED" | "UNDER_REVIEW") => {
    try {
      await apiFetch(`/api/admissions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Application ${status.toLowerCase()}`);
      loadAdmissions();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    }
  };
  return (
    <div className="space-y-6">
      <ERPPageHeader
        title="Admissions"
        description="Review and manage admission applications"
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"].map((status) => (
          <Card key={status} className="rounded-2xl border-0 shadow-soft">
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

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-brand-yellow dark:text-amber-400" />
            Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {admissions.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              No admission applications yet
            </p>
          ) : (
            <div className="overflow-x-auto -mx-1 px-1">
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
                        <Button variant="ghost" size="icon" aria-label={`View application ${admission.applicationNo}`} onClick={() => setViewing(admission)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {admission.status === "PENDING" && (
                          <>
                            <Button variant="ghost" size="icon" className="text-green-600" aria-label={`Approve ${admission.applicationNo}`} onClick={() => updateStatus(admission.id, "APPROVED")}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-600" aria-label={`Reject ${admission.applicationNo}`} onClick={() => updateStatus(admission.id, "REJECTED")}>
                              <XCircle className="h-4 w-4" />
                            </Button>                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application {viewing?.applicationNo}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Student:</span> {viewing.studentName}</p>
              <p><span className="font-semibold">Class:</span> {viewing.applyingClass}</p>
              <p><span className="font-semibold">Parent:</span> {viewing.parentName}</p>
              <p><span className="font-semibold">Phone:</span> {viewing.parentPhone}</p>
              <p><span className="font-semibold">Status:</span> {viewing.status}</p>
              <p><span className="font-semibold">Submitted:</span> {formatDate(viewing.createdAt)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
