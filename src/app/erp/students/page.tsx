"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search, Eye, Edit, X, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ERPPageHeader } from "@/components/erp/page-header";
import { apiFetch } from "@/lib/api-client";
import { SCHOOL_CLASS_LEVELS } from "@/lib/school-classes";
import { getInitials, formatDate } from "@/lib/utils";

interface Student {
  id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  division: string;
  photo?: string;
  admissionDate: string;
  class: { name: string; grade: number; section: string | null };
  fees: { id: string; status: string }[];
}

interface ClassRow {
  id: string;
  name: string;
  grade: number;
  section: string | null;
}

const SECTION_OPTIONS = ["A", "B", "C", "D"];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [divisionFilter, setDivisionFilter] = useState("all");
  const [classIdFilter, setClassIdFilter] = useState("all");
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [withoutPortal, setWithoutPortal] = useState(0);
  const [bulkPassword, setBulkPassword] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkResult, setBulkResult] = useState<{
    created: number;
    skipped: number;
    accounts: { studentId: string; name: string; email: string }[];
  } | null>(null);

  useEffect(() => {
    apiFetch<{ withoutPortalAccount: number }>("/api/students/bulk-portal")
      .then((data) => setWithoutPortal(data.withoutPortalAccount))
      .catch(() => setWithoutPortal(0));
  }, []);

  useEffect(() => {
    apiFetch<{ classes: ClassRow[] }>("/api/classes")
      .then((data) => setClasses(data.classes || []))
      .catch(() => setClasses([]));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const classOptionsForGrade = useMemo(() => {
    if (gradeFilter === "all") return classes;
    const grade = parseInt(gradeFilter, 10);
    return classes.filter((c) => c.grade === grade);
  }, [classes, gradeFilter]);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (classIdFilter !== "all") params.set("classId", classIdFilter);
      else if (gradeFilter !== "all") params.set("grade", gradeFilter);
      if (divisionFilter !== "all") params.set("division", divisionFilter);
      params.set("limit", "100");

      const data = await apiFetch<{ students: Student[] }>(
        `/api/students?${params.toString()}`
      );
      setStudents(data.students || []);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [search, gradeFilter, divisionFilter, classIdFilter]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setGradeFilter("all");
    setDivisionFilter("all");
    setClassIdFilter("all");
  };

  const hasActiveFilters =
    search || gradeFilter !== "all" || divisionFilter !== "all" || classIdFilter !== "all";

  const handleBulkPortal = async () => {
    if (bulkPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setBulkLoading(true);
    try {
      const body: { defaultPassword: string; classId?: string } = {
        defaultPassword: bulkPassword,
      };
      if (classIdFilter !== "all") body.classId = classIdFilter;

      const result = await apiFetch<{
        created: number;
        skipped: number;
        accounts: { studentId: string; name: string; email: string }[];
      }>("/api/students/bulk-portal", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setBulkResult(result);
      setWithoutPortal((n) => Math.max(0, n - result.created));
      toast.success(`Created ${result.created} portal account(s)`);
      if (result.skipped > 0) {
        toast.message(`${result.skipped} skipped (email already in use)`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Bulk portal creation failed");
    } finally {
      setBulkLoading(false);
    }
  };

  const openBulkDialog = () => {
    setBulkResult(null);
    setBulkPassword("");
    setBulkDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <ERPPageHeader
        title="Students"
        description="Manage student records and profiles"
        action={
          <div className="flex flex-wrap gap-2">
            {withoutPortal > 0 && (
              <Button variant="outline" className="gap-2" onClick={openBulkDialog}>
                <KeyRound className="h-4 w-4" />
                Portal accounts ({withoutPortal})
              </Button>
            )}
            <Link href="/erp/students/new">
              <Button variant="default" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Student
              </Button>
            </Link>
          </div>
        }
      />

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardHeader className="space-y-4">
          <CardTitle>All Students</CardTitle>
          <div className="flex flex-col gap-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or student ID..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10"
                aria-label="Search students"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Class</label>
                <Select
                  value={gradeFilter}
                  onValueChange={(v) => {
                    setGradeFilter(v);
                    setClassIdFilter("all");
                  }}
                >
                  <SelectTrigger aria-label="Filter by class">
                    <SelectValue placeholder="All Classes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    {SCHOOL_CLASS_LEVELS.map((level) => (
                      <SelectItem key={level.label} value={String(level.grade)}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {gradeFilter !== "all" && classOptionsForGrade.length > 1 && (
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Section</label>
                  <Select value={classIdFilter} onValueChange={setClassIdFilter}>
                    <SelectTrigger aria-label="Filter by section group">
                      <SelectValue placeholder="All sections" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sections</SelectItem>
                      {classOptionsForGrade.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.section ? `Section ${c.section}` : c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Division</label>
                <Select value={divisionFilter} onValueChange={setDivisionFilter}>
                  <SelectTrigger aria-label="Filter by division">
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Divisions</SelectItem>
                    {SECTION_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s}>Division {s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={clearFilters}
                  disabled={!hasActiveFilters}
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No students match your filters</p>
              {hasActiveFilters ? (
                <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
              ) : (
                <Link href="/erp/students/new">
                  <Button variant="outline">Add your first student</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto -mx-1 px-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>ID</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Roll No.</TableHead>
                    <TableHead>Admission</TableHead>
                    <TableHead>Fee Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={student.photo} />
                            <AvatarFallback>
                              {getInitials(`${student.firstName} ${student.lastName}`)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {student.firstName} {student.lastName}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{student.studentId}</TableCell>
                      <TableCell>
                        {student.class.name}
                        {student.class.section ? ` (${student.class.section})` : ""} — {student.division}
                      </TableCell>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>{formatDate(student.admissionDate)}</TableCell>
                      <TableCell>
                        {student.fees.length > 0 ? (
                          <Badge variant="warning">Pending</Badge>
                        ) : (
                          <Badge variant="success">Clear</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Link href={`/erp/students/${student.id}`}>
                            <Button variant="ghost" size="icon" aria-label={`View ${student.firstName}`}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/erp/students/${student.id}/edit`}>
                            <Button variant="ghost" size="icon" aria-label={`Edit ${student.firstName}`}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
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

      <Dialog open={bulkDialogOpen} onOpenChange={setBulkDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bulk portal accounts</DialogTitle>
            <DialogDescription>
              Create login accounts for active students without a portal user.
              {classIdFilter !== "all" && " Only students in the selected class filter will be included."}
            </DialogDescription>
          </DialogHeader>

          {bulkResult ? (
            <div className="space-y-3">
              <p className="text-sm">
                Created <strong>{bulkResult.created}</strong> account(s).
                {bulkResult.skipped > 0 && ` Skipped ${bulkResult.skipped}.`}
              </p>
              {bulkResult.accounts.length > 0 && (
                <div className="max-h-48 overflow-y-auto rounded-lg border p-3 space-y-2 text-sm">
                  {bulkResult.accounts.map((a) => (
                    <div key={a.studentId} className="flex justify-between gap-2">
                      <span className="font-medium truncate">{a.name}</span>
                      <span className="text-muted-foreground font-mono text-xs truncate">{a.email}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Share the default password you set with each student securely. They can change it after first login.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-password">Default password for all accounts</Label>
                <Input
                  id="bulk-password"
                  type="password"
                  placeholder="Min. 8 characters"
                  value={bulkPassword}
                  onChange={(e) => setBulkPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            {bulkResult ? (
              <Button onClick={() => setBulkDialogOpen(false)}>Done</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setBulkDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleBulkPortal} disabled={bulkLoading}>
                  {bulkLoading ? "Creating…" : "Create accounts"}
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
