import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight, Bell } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection, SlideUp } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "News & Events",
  description: "Stay updated with the latest news, events, and announcements from Little Champs School.",
};

const EVENTS = [
  {
    id: 1,
    title: "Annual Day Celebration 2025",
    description: "Join us for our grand Annual Day celebration featuring cultural performances, awards ceremony, and special guest appearances.",
    date: "2025-03-15",
    type: "CULTURAL",
    image: "https://images.unsplash.com/photo-1509062522246-3755597927d7?w=600&h=400&fit=crop",
    location: "School Auditorium",
  },
  {
    id: 2,
    title: "Science Exhibition",
    description: "Students showcase innovative science projects and experiments. Open to parents and visitors.",
    date: "2025-02-20",
    type: "ACADEMIC",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop",
    location: "Science Block",
  },
  {
    id: 3,
    title: "Inter-School Sports Meet",
    description: "Annual sports competition with participating schools from across the district.",
    date: "2025-01-25",
    type: "SPORTS",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba7951?w=600&h=400&fit=crop",
    location: "Sports Complex",
  },
];

const ANNOUNCEMENTS = [
  { id: 1, title: "Admissions Open for 2025-26", type: "GENERAL", date: "2025-01-01", content: "Online applications are now being accepted for all classes." },
  { id: 2, title: "Winter Break Schedule", type: "URGENT", date: "2024-12-15", content: "School will remain closed from Dec 24 to Jan 2. Classes resume on Jan 3." },
  { id: 3, title: "Fee Payment Deadline - January", type: "FEE", date: "2024-12-20", content: "January month fees must be paid by 10th January 2025 to avoid late fees." },
  { id: 4, title: "Parent-Teacher Meeting", type: "ACADEMIC", date: "2024-12-10", content: "PTM scheduled for December 28, 2024. Please confirm your attendance." },
];

const BLOG_POSTS = [
  {
    id: 1,
    title: "The Importance of Holistic Education",
    excerpt: "Why modern education must go beyond academics to develop well-rounded individuals.",
    author: "Dr. Priya Sharma",
    date: "2024-11-15",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop",
    slug: "importance-of-holistic-education",
  },
  {
    id: 2,
    title: "Preparing Students for the Digital Age",
    excerpt: "How our technology-integrated curriculum prepares students for future careers.",
    author: "Mr. Rajesh Kumar",
    date: "2024-10-20",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=250&fit=crop",
    slug: "preparing-students-digital-age",
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
        description="Stay informed about upcoming events, important announcements, and school news."
      />

      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <SectionHeader title="Upcoming Events" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {EVENTS.map((event, i) => (
              <SlideUp key={event.id} delay={i * 0.1}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  <div className="relative h-48">
                    <Image src={event.image} alt={event.title} fill className="object-cover" />
                    <Badge className="absolute top-4 left-4" variant={typeColors[event.type] || "default"}>
                      {event.type}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.date)}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                    <p className="text-xs text-muted-foreground">📍 {event.location}</p>
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
                <Card>
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10">
                      <Bell className="h-5 w-5 text-gold" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
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
          <SectionHeader title="From Our Blog" />
          <div className="grid md:grid-cols-2 gap-6">
            {BLOG_POSTS.map((post, i) => (
              <SlideUp key={post.id} delay={i * 0.1}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="grid sm:grid-cols-2">
                    <div className="relative h-48 sm:h-auto">
                      <Image src={post.image} alt={post.title} fill className="object-cover" />
                    </div>
                    <CardContent className="p-6 flex flex-col justify-center">
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatDate(post.date)} &bull; {post.author}
                      </p>
                      <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                      <Button variant="link" className="p-0 h-auto gap-1">
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
