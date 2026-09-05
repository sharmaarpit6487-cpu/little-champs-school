"use client";

import { useCallback, useEffect, useState } from "react";
import { GraduationCap, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ERPPageHeader } from "@/components/erp/page-header";
import { apiFetch } from "@/lib/api-client";
import { teacherSchema } from "@/lib/validations";
import { PASSWORD_MIN_LENGTH } from "@/lib/users";
import { formatDate } from "@/lib/utils";
import type { z } from "zod";

type TeacherForm = z.infer<typeof teacherSchema>;

interface Teacher {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  qualification: string;
  experience: number;
  dateOfJoining: string;
  bio?: string | null;
}

const emptyForm: TeacherForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  department: "",
  designation: "",
  qualification: "",
  experience: 0,
  dateOfJoining: new Date().toISOString().split("T")[0],
  bio: "",
  createPortalAccount: false,
};

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<TeacherForm>({
    resolver: zodResolver(teacherSchema),
    defaultValues: emptyForm,
  });

  const createPortalAccount = watch("createPortalAccount");

  const loadTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<{ teachers: Teacher[] }>("/api/teachers");
      setTeachers(data.teachers || []);
    } catch {
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeachers();
  }, [loadTeachers]);

  const openCreate = () => {
    setEditing(null);
    reset(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (teacher: Teacher) => {
    setEditing(teacher);
    reset({
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      department: teacher.department,
      designation: teacher.designation,
      qualification: teacher.qualification,
      experience: teacher.experience,
      dateOfJoining: teacher.dateOfJoining.split("T")[0],
      bio: teacher.bio || "",
      createPortalAccount: false,
    });
    setDialogOpen(true);
  };

  const onSubmit = async (data: TeacherForm) => {
    setSubmitting(true);
    try {
      const url = editing ? `/api/teachers/${editing.id}` : "/api/teachers";
      const method = editing ? "PUT" : "POST";
      await apiFetch(url, {
        method,
        body: JSON.stringify(data),
      });
      toast.success(editing ? "Teacher updated" : "Teacher added successfully");
      setDialogOpen(false);
      loadTeachers();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (teacher: Teacher) => {
    if (!confirm(`Remove ${teacher.firstName} ${teacher.lastName} from active faculty?`)) return;
    try {
      await apiFetch(`/api/teachers/${teacher.id}`, { method: "DELETE" });
      toast.success("Teacher deactivated");
      loadTeachers();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <ERPPageHeader
        title="Teachers"
        description="Manage faculty and staff records"
        action={
          <Button variant="default" className="gap-2" onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add Teacher
          </Button>
        }
      />

      <Card className="rounded-2xl border-0 shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-brand-yellow dark:text-amber-400" />
            Faculty Directory
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : teachers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No teachers yet.</p>
              <Button variant="outline" onClick={openCreate}>Add your first teacher</Button>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-1 px-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow key={teacher.id}>
                      <TableCell className="font-mono text-sm">{teacher.employeeId}</TableCell>
                      <TableCell>
                        <p className="font-medium">{teacher.firstName} {teacher.lastName}</p>
                        <p className="text-xs text-muted-foreground">{teacher.email}</p>
                      </TableCell>
                      <TableCell>{teacher.department}</TableCell>
                      <TableCell>{teacher.designation}</TableCell>
                      <TableCell>{formatDate(teacher.dateOfJoining)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" aria-label={`Edit ${teacher.firstName}`} onClick={() => openEdit(teacher)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" aria-label={`Delete ${teacher.firstName}`} onClick={() => handleDelete(teacher)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Teacher" : "Add Teacher"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" {...register("firstName")} className="mt-1" />
                {errors.firstName && <p className="text-sm text-destructive mt-1" role="alert">{errors.firstName.message}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" {...register("lastName")} className="mt-1" />
                {errors.lastName && <p className="text-sm text-destructive mt-1" role="alert">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" {...register("email")} className="mt-1" />
                {errors.email && <p className="text-sm text-destructive mt-1" role="alert">{errors.email.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" {...register("phone")} className="mt-1" />
                {errors.phone && <p className="text-sm text-destructive mt-1" role="alert">{errors.phone.message}</p>}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department *</Label>
                <Input id="department" {...register("department")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="designation">Designation *</Label>
                <Input id="designation" {...register("designation")} className="mt-1" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="qualification">Qualification *</Label>
                <Input id="qualification" {...register("qualification")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="experience">Experience (years) *</Label>
                <Input id="experience" type="number" min={0} {...register("experience", { valueAsNumber: true })} className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="dateOfJoining">Date of Joining *</Label>
              <Input id="dateOfJoining" type="date" {...register("dateOfJoining")} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" {...register("bio")} className="mt-1" rows={3} />
            </div>
            {!editing && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="createPortalAccount"
                    className="mt-1 h-4 w-4 rounded border-slate-300"
                    {...register("createPortalAccount")}
                  />
                  <div>
                    <Label htmlFor="createPortalAccount" className="font-semibold">Create teacher login</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Teacher can sign in to mark attendance and view assigned classes.
                    </p>
                  </div>
                </div>
                {createPortalAccount && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <Label htmlFor="portalEmail">Login Email *</Label>
                      <Input id="portalEmail" type="email" placeholder="teacher@littlechamps.edu" {...register("portalEmail")} className="mt-1" />
                      {errors.portalEmail && <p className="text-sm text-destructive mt-1" role="alert">{errors.portalEmail.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="password">Password *</Label>
                      <Input id="password" type="password" {...register("password")} className="mt-1" />
                      <p className="text-xs text-muted-foreground mt-1">Min {PASSWORD_MIN_LENGTH} chars</p>
                      {errors.password && <p className="text-sm text-destructive mt-1" role="alert">{errors.password.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input id="confirmPassword" type="password" {...register("confirmPassword")} className="mt-1" />
                      {errors.confirmPassword && <p className="text-sm text-destructive mt-1" role="alert">{errors.confirmPassword.message}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Saving..." : editing ? "Update Teacher" : "Create Teacher"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
