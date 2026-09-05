import { Metadata } from "next";
import { Calendar, ArrowRight, Bell } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection, SlideUp } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { SchoolImage } from "@/components/shared/school-image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { SCHOOL_IMAGES } from "@/lib/school-images";
import { SCHOOL_INFO } from "@/lib/school-data";

export const metadata: Metadata = {
  title: "News & Events",
  description: "Stay updated with celebrations, activities, and announcements from Little Champs School, Bhiwandi.",
};

const EVENTS = [
  {
    id: 1,
    title: "Red Day Celebration",
    description: "Students dressed in red for a vibrant day of colours, rhymes, and creative activities — a Little Champs favourite!",
    date: "2025-06-15",
    type: "CULTURAL",
    image: SCHOOL_IMAGES.redDayBoys,
    location: "Little Champs School Campus",
  },
  {
    id: 2,
    title: "Fancy Dress Competition",
    description: "Young champs showcased creativity and confidence in our annual fancy dress event.",
    date: "2025-05-20",
    type: "CULTURAL",
    image: SCHOOL_IMAGES.fancyDress,
    location: "School Auditorium",
  },
  {
    id: 3,
    title: "Fruit Day Activity",
    description: "Hands-on learning about healthy eating — students explored colours, tastes, and nutrition together.",
    date: "2025-04-10",
    type: "ACADEMIC",
    image: SCHOOL_IMAGES.fruitDay,
    location: "Pre-Primary Block",
  },
  {
    id: 4,
    title: "Father's Day Celebration",
    description: "A heartwarming tribute to fathers with performances, crafts, and special moments shared on campus.",
    date: "2025-06-21",
    type: "CULTURAL",
    image: SCHOOL_IMAGES.fathersDayCelebration,
    location: "Main Hall",
  },
  {
    id: 5,
    title: "Festival Celebration",
    description: "Students celebrated our rich cultural heritage with music, dance, and traditional festivities.",
    date: "2025-03-25",
    type: "CULTURAL",
    image: SCHOOL_IMAGES.festivalCelebration,
    location: "School Ground",
  },
  {
    id: 6,
    title: "Student Achievements",
    description: "Our students proudly display awards from state-level competitions and co-curricular events.",
    date: "2025-02-01",
    type: "SPORTS",
    image: SCHOOL_IMAGES.studentsAchievement,
    location: "Little Champs School",
  },
];

const ANNOUNCEMENTS = [
  { id: 1, title: "Admissions Open for 2025-26", type: "GENERAL", date: "2025-01-01", content: "Online applications are now being accepted for Nursery to Class 8." },
  { id: 2, title: "Summer Vacation Schedule", type: "URGENT", date: "2025-04-15", content: "School timings and vacation dates will be shared via the parent portal and notice board." },
  { id: 3, title: "Fee Payment Reminder", type: "FEE", date: "2025-04-01", content: "Please ensure monthly fees are paid by the 10th to avoid late charges." },
  { id: 4, title: "Parent-Teacher Meeting", type: "ACADEMIC", date: "2025-03-28", content: "PTM scheduled for all classes. Please confirm your attendance with the class teacher." },
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "Why Activity-Based Learning Works",
    excerpt: "From fruit day to fancy dress — how hands-on activities build confidence in young learners.",
    author: SCHOOL_INFO.principal.name,
    date: "2025-01-15",
    image: SCHOOL_IMAGES.fruitDay,
  },
  {
    id: 2,
    title: "Celebrating Every Little Champ",
    excerpt: "Red Day, Father's Day, and festival celebrations — building memories that last a lifetime.",
    author: SCHOOL_INFO.principal.name,
    date: "2024-12-10",
    image: SCHOOL_IMAGES.celebration,
  },
];

const typeColors: Record<string, "default" | "destructive" | "gold" | "success" | "warning"> = {
  CULTURAL: "gold",
  ACADEMIC: "default",
  SPORTS: "success",
  URGENT: "destructive",
  FEE: "warning",
  GENERAL: "secondary" as "default",
};

export default function NewsPage() {
  return (
    <>
      <PageHero
        title="News & Events"
        subtitle="Updates"
        description="Celebrations, activities, and important announcements from Little Champs School."
        image={SCHOOL_IMAGES.celebration}
        imageAlt="School celebration at Little Champs"
      />

      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <SectionHeader title="Recent Events" description="Real moments captured on our campus" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EVENTS.map((event, i) => (
              <SlideUp key={event.id} delay={i * 0.08}>
                <Card className="overflow-hidden rounded-2xl border-0 shadow-soft hover:shadow-xl transition-all h-full card-hover">
                  <div className="relative h-52">
                    <SchoolImage
                      src={event.image}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      rounded={false}
                    />
                    <Badge className="absolute top-4 left-4" variant={typeColors[event.type] || "default"}>
                      {event.type}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.date)}
                    </div>
                    <h3 className="font-display font-bold text-lg mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                    <p className="text-xs text-muted-foreground">{event.location}</p>
                  </CardContent>
                </Card>
              </SlideUp>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-padding bg-muted/30">
        <div className="container-custom">
          <SectionHeader title="Announcements & Notices" />
          <div className="space-y-4 max-w-3xl mx-auto">
            {ANNOUNCEMENTS.map((announcement, i) => (
              <SlideUp key={announcement.id} delay={i * 0.05}>
                <Card className="rounded-2xl border-0 shadow-soft">
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/50">
                      <Bell className="h-5 w-5 text-brand-yellow dark:text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold">{announcement.title}</h3>
                        <Badge variant={typeColors[announcement.type] || "default"} className="text-xs">
                          {announcement.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{announcement.content}</p>
                      <p className="text-xs text-muted-foreground mt-2">{formatDate(announcement.date)}</p>
                    </div>
                  </CardContent>
                </Card>
              </SlideUp>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <SectionHeader title="From Our Principal" />
          <div className="grid md:grid-cols-2 gap-6">
            {BLOG_POSTS.map((post, i) => (
              <SlideUp key={post.id} delay={i * 0.1}>
                <Card className="overflow-hidden rounded-2xl border-0 shadow-soft hover:shadow-xl transition-all card-hover">
                  <div className="grid sm:grid-cols-2">
                    <div className="relative min-h-[200px] sm:min-h-full">
                      <SchoolImage
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 300px"
                        rounded={false}
                      />
                    </div>
                    <CardContent className="p-6 flex flex-col justify-center">
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatDate(post.date)} &bull; {post.author}
                      </p>
                      <h3 className="font-display font-bold text-lg mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                      <Button variant="link" className="p-0 h-auto gap-1 self-start">
                        Read More <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              </SlideUp>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
