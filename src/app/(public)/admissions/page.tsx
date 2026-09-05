"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { FileText, CheckCircle, IndianRupee } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection, SlideUp } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { admissionSchema } from "@/lib/validations";
import { ADMISSION_STEPS, FEE_STRUCTURE } from "@/lib/school-data";
import { SCHOOL_IMAGES } from "@/lib/school-images";
import { formatCurrency } from "@/lib/utils";
import type { z } from "zod";

type AdmissionForm = z.infer<typeof admissionSchema>;

const APPLYING_CLASSES = [
  "Nursery", "KG", "Class 1", "Class 2", "Class 3", "Class 4",
  "Class 5", "Class 6", "Class 7", "Class 8",
];

export default function AdmissionsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AdmissionForm>({
    resolver: zodResolver(admissionSchema),
  });

  const onSubmit = async (data: AdmissionForm) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to submit");
      toast.success(`Application submitted! Your application number is ${result.applicationNo}`);
      reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        title="Admissions"
        subtitle="Join Us"
        description="Begin your child's journey of excellence. Admissions open for 2025-26 academic year."
        image={SCHOOL_IMAGES.studentsAchievement}
        imageAlt="Little Champs School students"
      />

      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <SectionHeader title="Admission Process" />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADMISSION_STEPS.map((step) => (
              <SlideUp key={step.step} delay={step.step * 0.1}>
                <Card className="text-center h-full relative">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-lg">
                      {step.step}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
              </SlideUp>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <SectionHeader
                title="Online Application Form"
                align="left"
              />
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div>
                      <Label htmlFor="studentName">Student Name *</Label>
                      <Input
                        id="studentName"
                        autoFocus
                        aria-invalid={!!errors.studentName}
                        {...register("studentName")}
                      />
                      {errors.studentName && (
                        <p className="text-sm text-destructive mt-1" role="alert">{errors.studentName.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          aria-invalid={!!errors.dateOfBirth}
                          {...register("dateOfBirth")}
                        />
                        {errors.dateOfBirth && (
                          <p className="text-sm text-destructive mt-1" role="alert">{errors.dateOfBirth.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="gender">Gender *</Label>
                        <Controller
                          name="gender"
                          control={control}
                          render={({ field }) => (
                            <>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger id="gender" aria-invalid={!!errors.gender}>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="MALE">Male</SelectItem>
                                  <SelectItem value="FEMALE">Female</SelectItem>
                                  <SelectItem value="OTHER">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              {errors.gender && (
                                <p className="text-sm text-destructive mt-1" role="alert">{errors.gender.message}</p>
                              )}
                            </>
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="applyingClass">Applying for Class *</Label>
                      <Controller
                        name="applyingClass"
                        control={control}
                        render={({ field }) => (
                          <>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <SelectTrigger id="applyingClass" aria-invalid={!!errors.applyingClass}>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                              <SelectContent>
                                {APPLYING_CLASSES.map((c) => (
                                  <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            {errors.applyingClass && (
                              <p className="text-sm text-destructive mt-1" role="alert">{errors.applyingClass.message}</p>
                            )}
                          </>
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                      <Input id="parentName" aria-invalid={!!errors.parentName} {...register("parentName")} />
                      {errors.parentName && (
                        <p className="text-sm text-destructive mt-1" role="alert">{errors.parentName.message}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="parentEmail">Parent Email *</Label>
                        <Input id="parentEmail" type="email" aria-invalid={!!errors.parentEmail} {...register("parentEmail")} />
                        {errors.parentEmail && (
                          <p className="text-sm text-destructive mt-1" role="alert">{errors.parentEmail.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="parentPhone">Parent Phone *</Label>
                        <Input id="parentPhone" aria-invalid={!!errors.parentPhone} {...register("parentPhone")} />
                        {errors.parentPhone && (
                          <p className="text-sm text-destructive mt-1" role="alert">{errors.parentPhone.message}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Textarea id="address" aria-invalid={!!errors.address} {...register("address")} />
                      {errors.address && (
                        <p className="text-sm text-destructive mt-1" role="alert">{errors.address.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="previousSchool">Previous School</Label>
                      <Input id="previousSchool" {...register("previousSchool")} />
                    </div>
                    <Button type="submit" variant="default" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <SectionHeader title="Required Documents" align="left" />
                <Card>
                  <CardContent className="p-6 space-y-3">
                    {[
                      "Birth Certificate (original + copy)",
                      "Previous school records/Transfer certificate",
                      "Passport size photographs (4 copies)",
                      "Aadhaar card copy (student & parent)",
                      "Address proof",
                      "Medical fitness certificate",
                    ].map((doc) => (
                      <div key={doc} className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-brand-yellow dark:text-amber-400 shrink-0" />
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              <div>
                <SectionHeader title="Eligibility Criteria" align="left" />
                <Card>
                  <CardContent className="p-6 space-y-3">
                    {[
                      "Age criteria as per CBSE norms",
                      "Minimum 50% in previous class (for Class 2 onwards)",
                      "Transfer certificate from previous school",
                      "Successful interaction session",
                    ].map((criteria) => (
                      <div key={criteria} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                        <span className="text-sm">{criteria}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <SectionHeader
            subtitle="Fees"
            title="Fee Structure Overview"
            description="Monthly fee breakdown (Transport optional)"
          />
          <Card className="rounded-2xl border-0 shadow-soft">
            <CardContent className="p-0 overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Tuition</TableHead>
                    <TableHead>Transport</TableHead>
                    <TableHead>Exam Fee</TableHead>
                    <TableHead className="text-right">Total/Month</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {FEE_STRUCTURE.map((fee) => (
                    <TableRow key={fee.class}>
                      <TableCell className="font-medium">{fee.class}</TableCell>
                      <TableCell>{formatCurrency(fee.tuition)}</TableCell>
                      <TableCell>{formatCurrency(fee.transport)}</TableCell>
                      <TableCell>{formatCurrency(fee.exam)}</TableCell>
                      <TableCell className="text-right font-semibold text-brand-yellow dark:text-amber-400">
                        {formatCurrency(fee.total)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          <p className="text-sm text-muted-foreground mt-4 text-center flex items-center justify-center gap-1">
            <IndianRupee className="h-4 w-4" />
            One-time admission fee and annual charges apply. Contact office for detailed breakdown.
          </p>
        </div>
      </AnimatedSection>
    </>
  );
}
