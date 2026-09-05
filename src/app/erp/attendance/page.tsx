"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ClipboardList, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ERPPageHeader } from "@/components/erp/page-header";
import { apiFetch } from "@/lib/api-client";

type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY" | "EXCUSED";

interface ClassOption {
  id: string;
  name: string;
  grade: number;
  section: string | null;
  _count: { students: number };
}

interface AttendanceRow {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    rollNumber: string;
    studentId: string;
  };
  attendance: { id: string; status: AttendanceStatus; remarks: string | null } | null;
}

const STATUS_OPTIONS: AttendanceStatus[] = ["PRESENT", "ABSENT", "LATE", "HALF_DAY", "EXCUSED"];

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

export default function AttendancePage() {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [classId, setClassId] = useState("");
  const [date, setDate] = useState(todayISO());
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, AttendanceStatus>>({});
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [loadingRows, setLoadingRows] = useState(false);
  const [saving, setSaving] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    apiFetch<{ classes: ClassOption[] }>("/api/classes")
      .then((data) => {
        const list = data.classes || [];
        setClasses(list);
        const withStudents = list.find((c) => c._count.students > 0);
        if (withStudents) setClassId(withStudents.id);
        else if (list.length > 0) setClassId(list[0].id);
      })
      .catch(() => toast.error("Failed to load classes. Check you are signed in as admin."))
      .finally(() => setLoadingClasses(false));
  }, []);

  const loadAttendance = useCallback(async (selectedClassId: string, selectedDate: string) => {
    if (!selectedClassId || !selectedDate) return;
    setLoadingRows(true);
    try {
      const data = await apiFetch<{ records: AttendanceRow[] }>(
        `/api/attendance?classId=${encodeURIComponent(selectedClassId)}&date=${encodeURIComponent(selectedDate)}`
      );
      setRows(data.records || []);
      const initial: Record<string, AttendanceStatus> = {};
      (data.records || []).forEach((row) => {
        initial[row.student.id] = row.attendance?.status ?? "PRESENT";
      });
      setStatusMap(initial);
    } catch {
      setRows([]);
      setStatusMap({});
    } finally {
      setLoadingRows(false);
    }
  }, []);

  useEffect(() => {
    if (panelOpen && classId && date) {
      loadAttendance(classId, date);
    }
  }, [panelOpen, classId, date, loadAttendance]);

  const summary = useMemo(() => {
    const values = Object.values(statusMap);
    return {
      present: values.filter((s) => s === "PRESENT").length,
      absent: values.filter((s) => s === "ABSENT").length,
      total: rows.length,
    };
  }, [statusMap, rows.length]);

  const markToday = () => {
    setDate(todayISO());
    setPanelOpen(true);
    if (classId) loadAttendance(classId, todayISO());
  };

  const saveAttendance = async () => {
    if (!classId || !date || rows.length === 0) {
      toast.error("Select a class with students first");
      return;
    }
    setSaving(true);
    try {
      const records = rows.map((row) => ({
        studentId: row.student.id,
        status: statusMap[row.student.id] || "PRESENT",
      }));
      await apiFetch("/api/attendance", {
        method: "POST",
        body: JSON.stringify({ classId, date, records }),
      });
      toast.success(`Attendance saved for ${records.length} students`);
      loadAttendance(classId, date);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <ERPPageHeader
        title="Attendance"
        description="Mark and manage student attendance"
      />

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-brand-yellow dark:text-amber-400" />
            Mark Attendance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Select a class and date, then mark each student as present, absent, or late.
          </p>
          <Button variant="default" onClick={markToday} disabled={loadingClasses}>
            {classes.length === 0 && !loadingClasses
              ? "No classes — run db:seed first"
              : "Mark Today's Attendance"}
          </Button>

          {(panelOpen || rows.length > 0) && (
            <div className="space-y-4 pt-4 border-t border-border">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="classId">Class</Label>
                  <Select value={classId} onValueChange={setClassId} disabled={loadingClasses}>
                    <SelectTrigger id="classId" className="mt-1">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name}{cls.section ? ` - ${cls.section}` : ""} ({cls._count.students} students)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="attendanceDate">Date</Label>
                  <input
                    id="attendanceDate"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>

              {loadingRows ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : rows.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No active students in this class.</p>
              ) : (
                <>
                  <div className="flex flex-wrap gap-2 text-sm">
                    <Badge variant="success">Present: {summary.present}</Badge>
                    <Badge variant="destructive">Absent: {summary.absent}</Badge>
                    <Badge variant="secondary">Total: {summary.total}</Badge>
                  </div>
                  <div className="overflow-x-auto -mx-1 px-1">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Roll No.</TableHead>
                          <TableHead>Student</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow key={row.student.id}>
                            <TableCell>{row.student.rollNumber}</TableCell>
                            <TableCell>
                              <p className="font-medium">{row.student.firstName} {row.student.lastName}</p>
                              <p className="text-xs text-muted-foreground">{row.student.studentId}</p>
                            </TableCell>
                            <TableCell>
                              <Select
                                value={statusMap[row.student.id] || "PRESENT"}
                                onValueChange={(v) =>
                                  setStatusMap((prev) => ({ ...prev, [row.student.id]: v as AttendanceStatus }))
                                }
                              >
                                <SelectTrigger className="w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {STATUS_OPTIONS.map((s) => (
                                    <SelectItem key={s} value={s}>{s.replace("_", " ")}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <Button className="gap-2" onClick={saveAttendance} disabled={saving}>
                    <Save className="h-4 w-4" />
                    {saving ? "Saving..." : "Save Attendance"}
                  </Button>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
