"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SchoolImage } from "@/components/shared/school-image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CarouselSlide {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
}

interface ImageCarouselProps {
  slides: CarouselSlide[];
  /** Auto-advance interval in ms */
  intervalMs?: number;
  className?: string;
  aspectClass?: string;
  priorityFirst?: boolean;
  variant?: "hero" | "compact";
}

export function ImageCarousel({
  slides,
  intervalMs = 4500,
  className,
  aspectClass = "aspect-[16/10]",
  priorityFirst = true,
  variant = "hero",
}: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex((next + count) % count);
    },
    [count]
  );

  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = setInterval(() => go(index + 1), intervalMs);
    return () => clearInterval(timer);
  }, [count, paused, intervalMs, index, go]);

  if (count === 0) return null;

  return (
    <div
      className={cn("relative group", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl shadow-2xl shadow-blue-500/15 bg-slate-100 dark:bg-slate-800",
          aspectClass
        )}
      >
        {slides.map((s, i) => (
          <div
            key={s.src}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              i === index ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
            aria-hidden={i !== index}
          >
            <SchoolImage
              src={s.src}
              alt={s.alt}
              fill
              sizes={variant === "hero" ? "(max-width: 1024px) 100vw, 560px" : "(max-width: 768px) 100vw, 480px"}
              className="object-cover"
              priority={priorityFirst && i === 0}
              rounded={false}
            />
            {(s.title || s.subtitle) && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-6 pt-16">
                {s.title && (
                  <p className="text-white font-display font-bold text-lg md:text-xl">{s.title}</p>
                )}
                {s.subtitle && (
                  <p className="text-white/85 text-sm mt-1">{s.subtitle}</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            onClick={() => go(index - 1)}
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-md opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
            onClick={() => go(index + 1)}
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                )}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
