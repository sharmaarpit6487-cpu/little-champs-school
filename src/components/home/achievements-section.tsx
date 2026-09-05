"use client";

import { Trophy, Medal, GraduationCap, Sparkles } from "lucide-react";
import { ImageCarousel } from "@/components/shared/image-carousel";
import { AnimatedSection, SlideUp } from "@/components/shared/animated-section";
import { StatsCounter } from "@/components/shared/stats-counter";
import {
  SCHOOL_IMAGES,
  ACHIEVEMENT_CARDS,
  ACHIEVEMENT_COUNTERS,
} from "@/lib/school-images";

const cardIcons = {
  trophy: Trophy,
  medal: Medal,
  graduation: GraduationCap,
  sparkles: Sparkles,
};

const ACHIEVEMENT_SLIDES = [
  {
    src: SCHOOL_IMAGES.studentsAchievement,
    alt: "Little Champs School student achievements and awards",
    title: "Student Achievements",
  },
  {
    src: SCHOOL_IMAGES.competition,
    alt: "Students participating in school competition",
    title: "Competition Day",
  },
  {
    src: SCHOOL_IMAGES.redDayBoys,
    alt: "Red Day celebration",
    title: "Red Day",
  },
  {
    src: SCHOOL_IMAGES.celebration,
    alt: "School celebration event",
    title: "School Celebrations",
  },
];

export function AchievementsSection() {
  return (
    <AnimatedSection className="section-padding bg-white dark:bg-slate-950">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <SlideUp>
            <ImageCarousel
              slides={ACHIEVEMENT_SLIDES}
              intervalMs={4500}
              aspectClass="aspect-[4/3]"
              variant="compact"
            />
          </SlideUp>

          <div>
            <SlideUp delay={0.1}>
              <span className="inline-flex items-center gap-2 text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-white mb-6">
                <span aria-hidden="true">🏆</span> Student Achievements
              </span>
            </SlideUp>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {ACHIEVEMENT_CARDS.map((card, i) => {
                const Icon = cardIcons[card.icon];
                return (
                  <SlideUp key={card.title} delay={0.15 + i * 0.05}>
                    <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-soft card-hover">
                      <div className="inline-flex p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-brand-blue mb-3">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-display font-bold text-slate-800 dark:text-white">
                        {card.title}
                      </h3>
                    </div>
                  </SlideUp>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {ACHIEVEMENT_COUNTERS.map((counter, i) => (
                <SlideUp key={counter.label} delay={0.35 + i * 0.05}>
                  <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-brand-blue/5 to-brand-yellow/5 dark:from-slate-900 dark:to-slate-800 border border-blue-100 dark:border-slate-800">
                    <StatsCounter
                      value={counter.value}
                      suffix={counter.suffix}
                      label={counter.label}
                      color="text-brand-blue"
                    />
                  </div>
                </SlideUp>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
