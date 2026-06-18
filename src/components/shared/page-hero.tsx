"use client";

import { motion } from "framer-motion";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  description?: string;
}

export function PageHero({ title, subtitle, description }: PageHeroProps) {
  return (
    <section className="relative hero-gradient text-white overflow-hidden">
      <div className="absolute inset-0 hero-pattern opacity-30" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

      <div className="container-custom relative section-padding pt-32 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {subtitle && (
            <p className="text-gold font-semibold text-sm uppercase tracking-wider mb-3">
              {subtitle}
            </p>
          )}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {title}
          </h1>
          {description && (
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
