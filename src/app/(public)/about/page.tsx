import { Metadata } from "next";
import Image from "next/image";
import { Award, Eye, Target, Building2, CheckCircle } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection, SlideUp } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { SCHOOL_INFO } from "@/lib/school-data";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Little Champs School's history, vision, mission, and world-class infrastructure.",
};

const HISTORY_MILESTONES = [
  { year: 1998, event: "Little Champs School founded with 50 students" },
  { year: 2005, event: "CBSE affiliation granted, new campus inaugurated" },
  { year: 2010, event: "Science labs and sports complex completed" },
  { year: 2015, event: "Digital learning initiative launched" },
  { year: 2020, event: "Green School certification achieved" },
  { year: 2024, event: "Best School Award - Maharashtra" },
];

const ACCREDITATIONS = [
  "CBSE Affiliated (Affiliation No: 1130123)",
  "ISO 9001:2015 Certified",
  "Green School Certification",
  "National Accreditation Board for Education",
  "British Council International School Award",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Us"
        subtitle="Our Story"
        description="Over 26 years of excellence in nurturing young minds and building future leaders."
      />

      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                subtitle="Heritage"
                title="Our History"
                align="left"
              />
              <p className="text-muted-foreground leading-relaxed mb-6">
                Founded in {SCHOOL_INFO.established}, Little Champs School began as a
                small institution with a big vision — to provide quality education that
                goes beyond textbooks. What started with just 50 students has grown into
                a premier educational institution with over {SCHOOL_INFO.stats.students}{" "}
                students and {SCHOOL_INFO.stats.teachers} dedicated faculty members.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our journey has been marked by continuous innovation, infrastructure
                development, and an unwavering commitment to academic excellence and
                character building.
              </p>
            </div>
            <div className="space-y-4">
              {HISTORY_MILESTONES.map((milestone, i) => (
                <SlideUp key={i} delay={i * 0.1}>
                  <div className="flex gap-4 items-start">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-navy font-bold text-sm">
                      {milestone.year}
                    </div>
                    <p className="text-muted-foreground pt-2">{milestone.event}</p>
                  </div>
                </SlideUp>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-8 w-8 text-gold" />
                  <h3 className="font-display text-2xl font-bold">Our Vision</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To be a globally recognized institution that nurtures innovative
                  thinkers, compassionate leaders, and lifelong learners who contribute
                  positively to society and excel in their chosen fields.
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-8 w-8 text-gold" />
                  <h3 className="font-display text-2xl font-bold">Our Mission</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To provide a stimulating learning environment that fosters academic
                  excellence, creative thinking, physical fitness, and moral values,
                  preparing students to meet the challenges of a dynamic world with
                  confidence and integrity.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <SectionHeader
            subtitle="Campus"
            title="Infrastructure"
            description="Modern facilities designed for comprehensive learning experiences"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, title: "5-Acre Campus", desc: "Spacious green campus with modern architecture" },
              { icon: Award, title: "15 Smart Classrooms", desc: "Interactive digital learning environments" },
              { icon: Target, title: "3 Science Labs", desc: "Fully equipped physics, chemistry, biology labs" },
              { icon: CheckCircle, title: "Sports Complex", desc: "Basketball, football, swimming, athletics" },
            ].map((item, i) => (
              <SlideUp key={i} delay={i * 0.1}>
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <item.icon className="h-10 w-10 text-gold mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </SlideUp>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-padding bg-navy text-white">
        <div className="container-custom">
          <SectionHeader
            subtitle="Recognition"
            title="Accreditation & Affiliations"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {ACCREDITATIONS.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white/10">
                <CheckCircle className="h-5 w-5 text-gold shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
