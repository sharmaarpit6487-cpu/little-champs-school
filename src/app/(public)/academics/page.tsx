import { Metadata } from "next";
import { BookOpen, Calendar, FileText, Download } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection, SlideUp } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { SchoolImage } from "@/components/shared/school-image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ACADEMIC_CALENDAR } from "@/lib/school-data";
import { SCHOOL_IMAGES } from "@/lib/school-images";

export const metadata: Metadata = {
  title: "Academics",
  description: "Explore our Nursery to Class 8 curriculum, academic calendar, and examination approach at Little Champs School.",
};

const CURRICULUM_LEVELS = [
  {
    level: "Pre-Primary (Nursery - KG)",
    subjects: ["English", "Hindi", "Numbers & Shapes", "Rhymes & Stories", "Art & Craft", "Music & Movement"],
    approach: "Play-based learning with fruit day, fancy dress, and sensory activities that make every day exciting.",
    image: SCHOOL_IMAGES.fruitDay,
  },
  {
    level: "Primary (Class 1-5)",
    subjects: ["English", "Hindi", "Mathematics", "EVS", "Computer Basics", "Art", "Music", "Physical Education"],
    approach: "Activity-based learning with emphasis on conceptual understanding, reading habits, and creative expression.",
    image: SCHOOL_IMAGES.digitalClass,
  },
  {
    level: "Middle School (Class 6-8)",
    subjects: ["English", "Hindi", "Mathematics", "Science", "Social Studies", "Computer Science", "Art", "Physical Education"],
    approach: "Structured curriculum with project-based learning, science activities, and preparation for higher grades.",
    image: SCHOOL_IMAGES.digitalClassroom,
  },
];

const EXAM_INFO = [
  { type: "Unit Tests", frequency: "Monthly", weightage: "10%" },
  { type: "Mid-Term", frequency: "Twice a year", weightage: "30%" },
  { type: "Annual Exam", frequency: "Once a year", weightage: "50%" },
  { type: "Project/Activity", frequency: "Ongoing", weightage: "10%" },
];

export default function AcademicsPage() {
  return (
    <>
      <PageHero
        title="Academics"
        subtitle="Education"
        description="A joyful, activity-rich curriculum from Nursery to Class 8 — designed for how children actually learn."
        image={SCHOOL_IMAGES.classImage}
        imageAlt="Students learning at Little Champs School"
      />

      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <SectionHeader
            subtitle="Curriculum"
            title="Our Academic Programs"
            description="Structured learning pathways from pre-primary through middle school"
          />
          <div className="space-y-8">
            {CURRICULUM_LEVELS.map((level, i) => (
              <SlideUp key={i} delay={i * 0.1}>
                <Card className="glass-card overflow-hidden">
                  <div className="grid lg:grid-cols-3 gap-0">
                    <div className="relative min-h-[220px] lg:min-h-full lg:col-span-1">
                      <SchoolImage
                        src={level.image}
                        alt={level.level}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        rounded={false}
                      />
                    </div>
                    <div className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <BookOpen className="h-6 w-6 text-brand-yellow dark:text-amber-400" />
                          {level.level}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{level.approach}</p>
                        <div className="flex flex-wrap gap-2">
                          {level.subjects.map((subject) => (
                            <Badge key={subject} variant="secondary">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              </SlideUp>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-padding bg-muted/30">
        <div className="container-custom">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="calendar" className="gap-2">
                <Calendar className="h-4 w-4" />
                Academic Calendar
              </TabsTrigger>
              <TabsTrigger value="exams" className="gap-2">
                <FileText className="h-4 w-4" />
                Examinations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="calendar">
              <SectionHeader title="Academic Calendar 2025-26" />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ACADEMIC_CALENDAR.map((month, i) => (
                  <Card key={i} className="rounded-2xl border-0 shadow-soft">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-brand-yellow dark:text-amber-400">{month.month}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-1">
                        {month.events.map((event) => (
                          <li key={event} className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />
                            {event}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="exams">
              <SectionHeader title="Examination System" />
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {EXAM_INFO.map((exam, i) => (
                  <Card key={i} className="rounded-2xl border-0 shadow-soft">
                    <CardContent className="p-6 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{exam.type}</h3>
                        <p className="text-sm text-muted-foreground">{exam.frequency}</p>
                      </div>
                      <Badge variant="warning">{exam.weightage}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-padding">
        <div className="container-custom text-center">
          <SectionHeader
            title="Download Syllabus"
            description="Access syllabus documents for each program level"
          />
          <div className="flex flex-wrap justify-center gap-4">
            {["Pre-Primary", "Primary", "Middle School"].map((level) => (
              <Button key={level} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                {level} Syllabus
              </Button>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}

