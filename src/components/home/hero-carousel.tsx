"use client";

import { ImageCarousel } from "@/components/shared/image-carousel";
import { SCHOOL_IMAGES } from "@/lib/school-images";

const HERO_SLIDES = [
  {
    src: SCHOOL_IMAGES.campus,
    alt: "Little Champs School campus in Bhiwandi",
    title: "Our Campus",
    subtitle: "A safe, welcoming place to learn and grow",
  },
  {
    src: SCHOOL_IMAGES.digitalClassroom,
    alt: "Digital smart classroom at Little Champs School",
    title: "Smart Classrooms",
    subtitle: "Interactive digital learning for every child",
  },
  {
    src: SCHOOL_IMAGES.studentsClassroom,
    alt: "Students learning in classroom",
    title: "Student Activities",
    subtitle: "Hands-on learning every day",
  },
  {
    src: SCHOOL_IMAGES.festivalCelebration,
    alt: "School festival celebration",
    title: "School Events",
    subtitle: "Celebrations that build confidence",
  },
  {
    src: SCHOOL_IMAGES.studentsAchievement,
    alt: "Student achievements at Little Champs School",
    title: "Student Achievements",
    subtitle: "Born To Win",
  },
];

export function HeroCarousel() {
  return (
    <div className="relative max-w-xl mx-auto lg:ml-auto w-full">
      <div className="absolute -inset-4 bg-gradient-to-br from-brand-blue/20 to-brand-yellow/20 rounded-[2rem] blur-2xl" />
      <ImageCarousel
        slides={HERO_SLIDES}
        intervalMs={5000}
        aspectClass="aspect-[4/3] md:aspect-[16/11]"
        variant="hero"
        className="relative"
      />
    </div>
  );
}
