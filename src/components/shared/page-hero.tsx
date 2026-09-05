"use client";

import { motion } from "framer-motion";
import { SchoolImage } from "@/components/shared/school-image";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}

export function PageHero({ title, subtitle, description, image, imageAlt }: PageHeroProps) {
  return (
    <section className="relative hero-gradient overflow-hidden min-h-[280px]">
      {image && (
        <div className="absolute inset-0">
          <SchoolImage
            src={image}
            alt={imageAlt || title}
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-25 dark:opacity-20"
            rounded={false}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAFBFD] via-[#FAFBFD]/92 to-[#FAFBFD]/75 dark:from-slate-900 dark:via-slate-900/92 dark:to-slate-900/75" />
        </div>
      )}

      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-blob" aria-hidden="true" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-amber-400/10 dark:bg-amber-400/5 rounded-full blur-3xl animate-blob [animation-delay:2s]" aria-hidden="true" />

      <div className={cn("container-custom relative section-padding pt-28 md:pt-36 pb-16", image && "z-10")}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          {subtitle && (
            <span className="inline-block px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-sm font-bold uppercase tracking-wide mb-4">
              {subtitle}
            </span>
          )}
          <h1 className="font-display text-4xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
