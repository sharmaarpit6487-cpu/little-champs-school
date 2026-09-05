"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ERPPageHeader } from "@/components/erp/page-header";
import { apiFetch } from "@/lib/api-client";
import { studentSchema } from "@/lib/validations";
import { PASSWORD_MIN_LENGTH } from "@/lib/users";
import type { z } from "zod";

type StudentForm = z.infer<typeof studentSchema>;

interface ClassOption {
  id: string;
  label: string;
}

export default function NewStudentPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [classesLoading, setClassesLoading] = useState(true);

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<StudentForm>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      admissionDate: new Date().toISOString().split("T")[0],
      createPortalAccount: false,
    },
  });

  const createPortalAccount = watch("createPortalAccount");

  useEffect(() => {
    apiFetch<{ classes: { id: string; name: string; section: string | null; grade: number }[] }>("/api/classes")
      .then((data) => {
        setClasses(
          (data.classes || []).map((cls) => ({
            id: cls.id,
            label: cls.section ? `${cls.name} - Section ${cls.section}` : cls.name,
          }))
        );
      })
      .catch(() => setClasses([]))
      .finally(() => setClassesLoading(false));
  }, []);

  const onSubmit = async (data: StudentForm) => {
    setIsSubmitting(true);
    try {
      const result = await apiFetch<{ id: string }>("/api/students", {
        method: "POST",
        body: JSON.stringify(data),
      });
      toast.success(
        data.createPortalAccount
          ? "Student created with portal login"
          : "Student created successfully"
      );
      router.push(`/erp/students/${result.id}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create student");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <ERPPageHeader
        title="Add New Student"
        description="Create a new student record"
        action={
          <Link href="/erp/students">
            <Button variant="outline" className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Button>
          </Link>
        }
      />

      <Card className="rounded-2xl border-0 shadow-soft max-w-3xl">
        <CardHeader><CardTitle>Student Details</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" autoFocus aria-invalid={!!errors.firstName} {...register("firstName")} className="mt-1" />
                {errors.firstName && <p className="text-sm text-destructive mt-1" role="alert">{errors.firstName.message}</p>}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" aria-invalid={!!errors.lastName} {...register("lastName")} className="mt-1" />
                {errors.lastName && <p className="text-sm text-destructive mt-1" role="alert">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input id="dateOfBirth" type="date" aria-invalid={!!errors.dateOfBirth} {...register("dateOfBirth")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger id="gender" className="mt-1">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="classId">Class *</Label>
                {classes.length > 0 ? (
                  <Controller
                    name="classId"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} disabled={classesLoading}>
                        <SelectTrigger id="classId" className="mt-1">
                          <SelectValue placeholder={classesLoading ? "Loading..." : "Select class"} />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.id}>{cls.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                ) : (
                  <Input id="classId" placeholder="Class ID" {...register("classId")} className="mt-1" />
                )}
              </div>
              <div>
                <Label htmlFor="division">Division *</Label>
                <Input id="division" placeholder="A" {...register("division")} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="rollNumber">Roll Number *</Label>
                <Input id="rollNumber" {...register("rollNumber")} className="mt-1" />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Textarea id="address" {...register("address")} className="mt-1" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div><Label htmlFor="city">City *</Label><Input id="city" {...register("city")} className="mt-1" /></div>
              <div><Label htmlFor="state">State *</Label><Input id="state" {...register("state")} className="mt-1" /></div>
              <div><Label htmlFor="pincode">Pincode *</Label><Input id="pincode" {...register("pincode")} className="mt-1" /></div>
            </div>
            <div>
              <Label htmlFor="admissionDate">Admission Date *</Label>
              <Input id="admissionDate" type="date" {...register("admissionDate")} className="mt-1" />
            </div>
            <hr className="border-slate-200 dark:border-slate-800" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">Parent Information</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label htmlFor="parentFirstName">Parent First Name *</Label><Input id="parentFirstName" {...register("parentFirstName")} className="mt-1" /></div>
              <div><Label htmlFor="parentLastName">Parent Last Name *</Label><Input id="parentLastName" {...register("parentLastName")} className="mt-1" /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div><Label htmlFor="parentEmail">Parent Email *</Label><Input id="parentEmail" type="email" {...register("parentEmail")} className="mt-1" /></div>
              <div><Label htmlFor="parentPhone">Parent Phone *</Label><Input id="parentPhone" {...register("parentPhone")} className="mt-1" /></div>
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="createPortalAccount"
                  className="mt-1 h-4 w-4 rounded border-slate-300"
                  {...register("createPortalAccount")}
                />
                <div>
                  <Label htmlFor="createPortalAccount" className="font-semibold">Create student portal login</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Allows the student to sign in and view their own profile, attendance, and fees.
                  </p>
                </div>
              </div>
              {createPortalAccount && (
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  <div className="sm:col-span-2">
                    <Label htmlFor="portalEmail">Portal Email *</Label>
                    <Input id="portalEmail" type="email" placeholder="student@littlechamps.edu" {...register("portalEmail")} className="mt-1" />
                    {errors.portalEmail && <p className="text-sm text-destructive mt-1" role="alert">{errors.portalEmail.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input id="password" type="password" autoComplete="new-password" {...register("password")} className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">Min {PASSWORD_MIN_LENGTH} chars, letters and numbers</p>
                    {errors.password && <p className="text-sm text-destructive mt-1" role="alert">{errors.password.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input id="confirmPassword" type="password" autoComplete="new-password" {...register("confirmPassword")} className="mt-1" />
                    {errors.confirmPassword && <p className="text-sm text-destructive mt-1" role="alert">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" variant="default" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Creating..." : "Create Student"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
