"use client";

import { motion } from "framer-motion";
import { SchoolImage } from "@/components/shared/school-image";
import { SCHOOL_IMAGES } from "@/lib/school-images";
import { SCHOOL_INFO } from "@/lib/school-data";

export function HeroCollage() {
  return (
    <div className="relative max-w-xl mx-auto lg:ml-auto w-full">
      <div className="absolute -inset-4 bg-gradient-to-br from-brand-blue/20 to-brand-yellow/20 rounded-[2rem] blur-2xl" />

      <div className="relative grid grid-cols-12 grid-rows-6 gap-3 aspect-[4/3]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="col-span-7 row-span-4 relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20 group"
        >
          <SchoolImage
            src={SCHOOL_IMAGES.campus}
            alt="Little Champs School campus in Bhiwandi"
            fill
            sizes="(max-width: 1024px) 60vw, 400px"
            className="group-hover:scale-105 transition-transform duration-700"
            priority
            rounded={false}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="col-span-5 row-span-3 relative rounded-3xl overflow-hidden shadow-xl group"
        >
          <SchoolImage
            src={SCHOOL_IMAGES.studentsAchievement}
            alt="Little Champs School students celebrating achievements"
            fill
            sizes="(max-width: 1024px) 35vw, 220px"
            className="group-hover:scale-105 transition-transform duration-700"
            priority
            rounded={false}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="col-span-5 row-span-3 relative rounded-3xl overflow-hidden shadow-xl group"
        >
          <SchoolImage
            src={SCHOOL_IMAGES.redDayGirls}
            alt="Red Day activities at Little Champs School"
            fill
            sizes="(max-width: 1024px) 35vw, 220px"
            className="group-hover:scale-105 transition-transform duration-700"
            priority
            rounded={false}
          />
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute -bottom-4 -left-4 md:-left-8 glass-card px-5 py-4 hidden sm:block rounded-2xl shadow-lg"
      >
        <p className="text-2xl font-display font-bold text-brand-blue">{SCHOOL_INFO.stats.students}+</p>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Happy Students</p>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute -top-2 -right-2 md:-right-6 glass-card px-5 py-4 hidden sm:block rounded-2xl shadow-lg"
      >
        <p className="text-2xl font-display font-bold text-brand-green">Born</p>
        <p className="text-xs font-semibold text-slate-500">To Win</p>
      </motion.div>
    </div>
  );
}
