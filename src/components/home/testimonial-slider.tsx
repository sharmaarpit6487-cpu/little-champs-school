"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TESTIMONIALS } from "@/lib/school-data";
import { getInitials } from "@/lib/utils";

export function TestimonialSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => setCurrent((c) => (c + 1) % TESTIMONIALS.length);
  const testimonial = TESTIMONIALS[current];

  return (
    <div className="relative max-w-4xl mx-auto" role="region" aria-label="Parent testimonials">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
          className="glass-card p-8 md:p-12 text-center relative"
        >
          <Quote className="absolute top-6 left-6 h-10 w-10 text-blue-500/15" aria-hidden="true" />
          <div className="flex justify-center gap-1 mb-6" aria-label={`${testimonial.rating} out of 5 stars`}>
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed mb-8 italic">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-brand-blue to-brand-sky text-white font-display font-bold text-lg ring-4 ring-blue-100 dark:ring-blue-900"
              aria-hidden="true"
            >
              {getInitials(testimonial.name)}
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-slate-800 dark:text-white">{testimonial.name}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">{testimonial.role}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-4 mt-6">
        <Button variant="outline" size="icon" onClick={prev} className="rounded-full" aria-label="Previous testimonial">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-2" role="tablist" aria-label="Testimonial navigation">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === current ? "w-8 bg-blue-600" : "w-2.5 bg-blue-200 dark:bg-blue-800"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
              aria-selected={i === current}
              role="tab"
            />
          ))}
        </div>
        <Button variant="outline" size="icon" onClick={next} className="rounded-full" aria-label="Next testimonial">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
