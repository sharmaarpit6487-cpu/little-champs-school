"use client";

import { motion } from "framer-motion";
import { SchoolImage } from "@/components/shared/school-image";
import { AnimatedSection, SlideUp } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { SCHOOL_INFO } from "@/lib/school-data";
import { SCHOOL_IMAGES } from "@/lib/school-images";

export function PrincipalSection() {
  return (
    <AnimatedSection className="section-padding bg-gradient-to-b from-blue-50/60 to-white dark:from-slate-900 dark:to-slate-950">
      <div className="container-custom">
        <SectionHeader
          subtitle="Leadership"
          title="Message From The Principal"
          description="A warm welcome from the heart of Little Champs School"
        />

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mt-4">
          <SlideUp className="order-1 lg:order-1">
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-brand-yellow/30 to-brand-blue/20 rounded-[2rem] -rotate-2" />
              <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-brand-yellow/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-blue-500/15 ring-1 ring-white/50 dark:ring-slate-800 bg-slate-100 dark:bg-slate-800">
                <SchoolImage
                  src={SCHOOL_IMAGES.principal}
                  alt={`${SCHOOL_INFO.principal.name}, Principal of Little Champs School`}
                  width={560}
                  height={700}
                  sizes="(max-width: 1024px) 90vw, 560px"
                  hover={false}
                  className="w-full aspect-[4/5] object-cover object-[center_22%] sm:object-[center_20%]"
                />
              </div>
            </motion.div>
          </SlideUp>

          <div className="order-2 lg:order-2 space-y-6">
            <SlideUp delay={0.1}>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
                Welcome to Little Champs School
              </h3>
            </SlideUp>
            <SlideUp delay={0.2}>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                {SCHOOL_INFO.principal.message}
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                We are committed to nurturing every child with care, creativity, and
                confidence — helping them discover their unique strengths through
                activity-based learning, dedicated teachers, and a safe, joyful campus
                here in Bhiwandi.
              </p>
            </SlideUp>
            <SlideUp delay={0.3}>
              <div className="pt-5 border-t border-slate-200 dark:border-slate-800 space-y-0.5">
                <p className="font-display text-xl font-bold text-slate-800 dark:text-white">
                  {SCHOOL_INFO.principal.name}
                </p>
                <p className="text-brand-blue font-semibold text-sm">Principal</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Little Champs School
                </p>
              </div>
            </SlideUp>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
