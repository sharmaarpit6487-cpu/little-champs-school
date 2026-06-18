"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Mail, Phone } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection, SlideUp } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const FACULTY = [
  { id: 1, name: "Dr. Priya Sharma", designation: "Principal", department: "Administration", qualification: "Ph.D. in Education", experience: 25, image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop", email: "principal@littlechamps.edu", phone: "+91 98765 43200" },
  { id: 2, name: "Mr. Rajesh Kumar", designation: "Vice Principal", department: "Administration", qualification: "M.Ed., M.Sc. Physics", experience: 20, image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop", email: "viceprincipal@littlechamps.edu", phone: "+91 98765 43201" },
  { id: 3, name: "Mrs. Anjali Desai", designation: "HOD - English", department: "Languages", qualification: "M.A. English, B.Ed.", experience: 15, image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop", email: "anjali.desai@littlechamps.edu", phone: "+91 98765 43202" },
  { id: 4, name: "Mr. Suresh Menon", designation: "HOD - Mathematics", department: "Mathematics", qualification: "M.Sc. Mathematics, B.Ed.", experience: 18, image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop", email: "suresh.menon@littlechamps.edu", phone: "+91 98765 43203" },
  { id: 5, name: "Dr. Kavita Nair", designation: "HOD - Science", department: "Science", qualification: "Ph.D. Chemistry, B.Ed.", experience: 16, image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf0?w=300&h=300&fit=crop", email: "kavita.nair@littlechamps.edu", phone: "+91 98765 43204" },
  { id: 6, name: "Mr. Amit Patel", designation: "Sports Director", department: "Physical Education", qualification: "M.P.Ed., NIS Certificate", experience: 12, image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop", email: "amit.patel@littlechamps.edu", phone: "+91 98765 43205" },
  { id: 7, name: "Mrs. Deepa Iyer", designation: "Art Teacher", department: "Arts", qualification: "M.F.A., B.Ed.", experience: 10, image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop", email: "deepa.iyer@littlechamps.edu", phone: "+91 98765 43206" },
  { id: 8, name: "Mr. Vikram Singh", designation: "Computer Science Teacher", department: "Computer Science", qualification: "M.Tech. CSE, B.Ed.", experience: 8, image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop", email: "vikram.singh@littlechamps.edu", phone: "+91 98765 43207" },
];

const DEPARTMENTS = ["All", "Administration", "Languages", "Mathematics", "Science", "Physical Education", "Arts", "Computer Science"];

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

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((teacher, i) => (
              <SlideUp key={teacher.id} delay={i * 0.05}>
                <Card className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                  <div className="relative h-56 bg-muted">
                    <Image
                      src={teacher.image}
                      alt={teacher.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg">{teacher.name}</h3>
                    <p className="text-sm text-gold font-medium">{teacher.designation}</p>
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
