"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SchoolImage } from "@/components/shared/school-image";
import { GALLERY_FEATURED } from "@/lib/school-images";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BENTO_LAYOUT = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
] as const;

export function GalleryMasonry({ compact = false }: { compact?: boolean }) {
  const items = GALLERY_FEATURED;

  if (compact) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <GalleryTile key={item.id} item={item} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4 auto-rows-[200px] md:auto-rows-[minmax(180px,1fr)]">
      {items.map((item, i) => (
        <GalleryTile
          key={item.id}
          item={item}
          index={i}
          className={BENTO_LAYOUT[i]}
          featured={i === 0}
        />
      ))}
    </div>
  );
}

function GalleryTile({
  item,
  index,
  className,
  featured = false,
}: {
  item: (typeof GALLERY_FEATURED)[number];
  index: number;
  className?: string;
  featured?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className={cn(
        "group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-shadow duration-500 min-h-[220px]",
        className
      )}
    >
      <SchoolImage
        src={item.image}
        alt={item.alt}
        fill
        sizes={featured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
        className="group-hover:scale-110 transition-transform duration-700"
        rounded={false}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 via-brand-blue/15 to-transparent opacity-75 group-hover:opacity-95 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-yellow mb-1 block">
          {item.category}
        </span>
        <p className={cn(
          "text-white font-display font-bold leading-tight",
          featured ? "text-xl md:text-2xl" : "text-base md:text-lg"
        )}>
          {item.title}
        </p>
      </div>
    </motion.div>
  );
}

export function GallerySection() {
  return (
    <section id="gallery" className="section-padding bg-white dark:bg-slate-950">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 text-sm font-bold uppercase tracking-wide mb-3">
              Gallery
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-800 dark:text-white">
              Life at Little Champs
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2 max-w-xl">
              Real photos from our campus — Red Day, fancy dress, fruit day, Father&apos;s Day, and proud student achievements.
            </p>
          </div>
          <Link href="/gallery">
            <Button variant="outline" className="gap-2">
              View Full Gallery <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <GalleryMasonry />
      </div>
    </section>
  );
}
