import { Metadata } from "next";
import { Award, Eye, Target, Building2, CheckCircle, Heart } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection, SlideUp } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { SchoolImage } from "@/components/shared/school-image";
import { Card, CardContent } from "@/components/ui/card";
import { SCHOOL_INFO } from "@/lib/school-data";
import { SCHOOL_IMAGES } from "@/lib/school-images";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Little Champs School — a trusted Nursery to Class 8 institution in Bhiwandi, Maharashtra.",
};

const HISTORY_MILESTONES = [
  { year: 1999, event: "Little Champs School founded with a vision to nurture young learners" },
  { year: 2005, event: "Expanded programs from Nursery through primary grades" },
  { year: 2012, event: "Introduced activity-based learning and co-curricular programs" },
  { year: 2018, event: "Campus upgraded with modern classrooms and learning resources" },
  { year: 2023, event: "Students excel at state-level competitions and karate championships" },
  { year: 2025, event: "Continuing 25+ years of excellence — Born To Win" },
];

const CAMPUS_HIGHLIGHTS = [
  { icon: Building2, title: "Welcoming Campus", desc: "A safe, child-friendly environment in Kamatghar, Bhiwandi" },
  { icon: Award, title: "Nursery to Class 8", desc: "Complete preschool, primary, and middle school programs" },
  { icon: Heart, title: "Caring Teachers", desc: "Experienced educators who know every child by name" },
  { icon: CheckCircle, title: "Activity-Based Learning", desc: "Red Day, fruit day, fancy dress, and hands-on learning" },
];

const CAMPUS_PHOTOS = [
  { src: SCHOOL_IMAGES.campus, alt: "Little Champs School campus", title: "Our Campus" },
  { src: SCHOOL_IMAGES.digitalClassroom, alt: "Digital classroom at Little Champs School", title: "Smart Classrooms" },
  { src: SCHOOL_IMAGES.festivalCelebration, alt: "Festival celebration", title: "Celebrations" },
  { src: SCHOOL_IMAGES.digitalClass, alt: "Digital learning classroom", title: "Digital Learning" },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="About Us"
        subtitle="Our Story"
        description="Over 25 years of nurturing young minds in Bhiwandi — from Nursery to Class 8, with love, care, and excellence."
        image={SCHOOL_IMAGES.campus}
        imageAlt="Little Champs School campus in Bhiwandi"
      />

      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-3 bg-gradient-to-br from-brand-blue/10 to-brand-yellow/10 rounded-[2rem]" />
              <SchoolImage
                src={SCHOOL_IMAGES.campusWide}
                alt="Little Champs School building"
                width={600}
                height={450}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="relative w-full aspect-[4/3] shadow-card"
              />
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeader
                subtitle="Heritage"
                title="Our History"
                align="left"
              />
              <p className="text-muted-foreground leading-relaxed mb-6">
                Founded in {SCHOOL_INFO.established}, Little Champs School began with a simple belief —
                every child is born to win. From a small beginning in Bhiwandi, we have grown into a
                trusted institution serving families across Kamatghar and surrounding areas with
                quality education from Nursery to Class 8.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Under the leadership of {SCHOOL_INFO.principal.name}, we continue to blend academic
                rigour with joyful learning — celebrating Red Day, fruit day, fancy dress, Father&apos;s Day,
                and every milestone that makes childhood memorable.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              {HISTORY_MILESTONES.map((milestone, i) => (
                <SlideUp key={i} delay={i * 0.08}>
                  <div className="flex gap-4 items-start">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-blue-900 font-bold text-sm">
                      {String(milestone.year).slice(-2)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 dark:text-white">{milestone.year}</p>
                      <p className="text-muted-foreground text-sm">{milestone.event}</p>
                    </div>
                  </div>
                </SlideUp>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {CAMPUS_PHOTOS.map((photo, i) => (
                <SlideUp key={photo.title} delay={i * 0.1}>
                  <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-soft card-hover">
                    <SchoolImage
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      className="group-hover:scale-105 transition-transform duration-500"
                      rounded={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 to-transparent opacity-80" />
                    <p className="absolute bottom-3 left-3 text-white font-semibold text-sm">{photo.title}</p>
                  </div>
                </SlideUp>
              ))}
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Eye className="h-8 w-8 text-brand-yellow dark:text-amber-400" />
                  <h3 className="font-display text-2xl font-bold">Our Vision</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To be Bhiwandi&apos;s most trusted school for early and primary education — where every
                  child discovers their potential, builds confidence, and grows with joy in a safe,
                  nurturing environment.
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-8 w-8 text-brand-yellow dark:text-amber-400" />
                  <h3 className="font-display text-2xl font-bold">Our Mission</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To provide activity-based, child-centred education from Nursery to Class 8 — fostering
                  academic excellence, creative expression, moral values, and the spirit of &ldquo;Born To Win&rdquo;
                  in every Little Champ.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-padding bg-muted/30">
        <div className="container-custom">
          <SectionHeader
            subtitle="Campus"
            title="Why Families Choose Us"
            description="A real school with real moments — not a template, but our Little Champs family"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CAMPUS_HIGHLIGHTS.map((item, i) => (
              <SlideUp key={i} delay={i * 0.1}>
                <Card className="text-center h-full rounded-2xl border-0 shadow-soft card-hover">
                  <CardContent className="p-6">
                    <item.icon className="h-10 w-10 text-brand-yellow dark:text-amber-400 mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </SlideUp>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-padding bg-gradient-to-r from-brand-blue to-brand-sky text-white relative overflow-hidden">
        <div className="container-custom relative">
          <SectionHeader
            subtitle="Our Motto"
            title={`"${SCHOOL_INFO.motto}"`}
            light
          />
          <p className="text-center text-white/90 max-w-2xl mx-auto text-lg leading-relaxed">
            At Little Champs School, we believe every child carries unlimited potential.
            With caring teachers, a safe campus, and celebrations that build confidence,
            we help each student become the champion they were born to be.
          </p>
        </div>
      </AnimatedSection>
    </>
  );
}
