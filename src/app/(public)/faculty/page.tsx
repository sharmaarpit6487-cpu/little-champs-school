"use client";

import { useState } from "react";
import { Search, Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection, SlideUp } from "@/components/shared/animated-section";
import { SchoolImage } from "@/components/shared/school-image";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SCHOOL_INFO } from "@/lib/school-data";
import { SCHOOL_IMAGES } from "@/lib/school-images";
import { getInitials } from "@/lib/utils";

const FACULTY = [
  {
    id: 1,
    name: SCHOOL_INFO.principal.name,
    designation: "Principal",
    department: "Administration",
    qualification: SCHOOL_INFO.principal.qualification,
    experience: 20,
    image: SCHOOL_IMAGES.principal,
    email: SCHOOL_INFO.email,
    phone: SCHOOL_INFO.phone,
  },
  {
    id: 2,
    name: "Mr. Rajesh Kumar",
    designation: "Vice Principal",
    department: "Administration",
    qualification: "M.Ed., M.Sc.",
    experience: 15,
    email: "viceprincipal@littlechamps.edu",
    phone: SCHOOL_INFO.alternatePhone,
  },
  {
    id: 3,
    name: "Mrs. Anjali Desai",
    designation: "HOD - English",
    department: "Languages",
    qualification: "M.A. English, B.Ed.",
    experience: 12,
    email: "academic@littlechamps.edu",
    phone: SCHOOL_INFO.phone,
  },
  {
    id: 4,
    name: "Mr. Suresh Menon",
    designation: "HOD - Mathematics",
    department: "Mathematics",
    qualification: "M.Sc. Mathematics, B.Ed.",
    experience: 14,
    email: "academic@littlechamps.edu",
    phone: SCHOOL_INFO.phone,
  },
  {
    id: 5,
    name: "Mrs. Deepa Iyer",
    designation: "Art Teacher",
    department: "Arts",
    qualification: "M.F.A., B.Ed.",
    experience: 10,
    email: "academic@littlechamps.edu",
    phone: SCHOOL_INFO.phone,
  },
  {
    id: 6,
    name: "Mr. Amit Patel",
    designation: "Sports Director",
    department: "Physical Education",
    qualification: "M.P.Ed.",
    experience: 11,
    email: "academic@littlechamps.edu",
    phone: SCHOOL_INFO.phone,
  },
];

const DEPARTMENTS = ["All", "Administration", "Languages", "Mathematics", "Arts", "Physical Education"];

export default function FacultyPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const filtered = FACULTY.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(search.toLowerCase()) ||
      teacher.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept = department === "All" || teacher.department === department;
    return matchesSearch && matchesDept;
  });

  return (
    <>
      <PageHero
        title="Faculty Directory"
        subtitle="Our Team"
        description="Meet our dedicated team of educators committed to nurturing excellence in every student."
        image={SCHOOL_IMAGES.classPhoto}
        imageAlt="Little Champs School faculty and students"
      />

      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or designation..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {DEPARTMENTS.map((dept) => (
                <Button
                  key={dept}
                  variant={department === dept ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDepartment(dept)}
                >
                  {dept}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((teacher, i) => (
              <SlideUp key={teacher.id} delay={i * 0.05}>
                <Card className="overflow-hidden rounded-3xl border-0 shadow-soft hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                  <div className="relative h-64 bg-slate-100 dark:bg-slate-800">
                    {"image" in teacher && teacher.image ? (
                      <SchoolImage
                        src={teacher.image}
                        alt={teacher.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover object-top"
                        rounded={false}
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-blue/10 to-brand-yellow/10">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-sky text-white font-display text-2xl font-bold shadow-lg">
                          {getInitials(teacher.name)}
                        </div>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg">{teacher.name}</h3>
                    <p className="text-sm text-brand-yellow dark:text-amber-400 font-medium">{teacher.designation}</p>
                    <Badge variant="secondary" className="mt-2 mb-3">{teacher.department}</Badge>
                    <p className="text-xs text-muted-foreground mb-1">{teacher.qualification}</p>
                    <p className="text-xs text-muted-foreground mb-4">{teacher.experience}+ years experience</p>
                    <div className="space-y-1">
                      <a href={`mailto:${teacher.email}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                        <Mail className="h-3 w-3" /> {teacher.email}
                      </a>
                      <a href={`tel:${teacher.phone}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
                        <Phone className="h-3 w-3" /> {teacher.phone}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              </SlideUp>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
