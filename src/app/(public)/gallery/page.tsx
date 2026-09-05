"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SchoolImage } from "@/components/shared/school-image";
import { GALLERY_ITEMS, GALLERY_CATEGORIES, SCHOOL_IMAGES, type GalleryCategory } from "@/lib/school-images";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function GalleryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("All");
  const [lightbox, setLightbox] = useState<(typeof GALLERY_ITEMS)[number] | null>(null);

  const filtered = GALLERY_ITEMS.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <PageHero
        title="Photo Gallery"
        subtitle="Campus Life"
        description="Real moments from celebrations, classroom learning, and student achievements at Little Champs School, Bhiwandi."
        image={SCHOOL_IMAGES.campusWide}
      />

      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search photos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {GALLERY_CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-8">
            {filtered.length} photo{filtered.length !== 1 ? "s" : ""}
            {category !== "All" ? ` in ${category}` : ""}
          </p>

          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">No photos match your search.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((item, i) => (
                <motion.button
                  key={item.id}
                  type="button"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 8) * 0.05 }}
                  onClick={() => setLightbox(item)}
                  className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 text-left"
                  aria-label={`View ${item.title}`}
                >
                  <SchoolImage
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="group-hover:scale-110 transition-transform duration-700"
                    rounded={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span className="text-xs font-semibold text-brand-yellow uppercase tracking-wide">
                      {item.category}
                    </span>
                    <p className="text-white font-display font-bold text-base mt-1 translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                      {item.title}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10"
              onClick={() => setLightbox(null)}
              aria-label="Close gallery lightbox"
            >
              <X className="h-6 w-6" />
            </Button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-5xl w-full max-h-[85vh] rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <SchoolImage
                src={lightbox.image}
                alt={lightbox.alt}
                width={1200}
                height={900}
                sizes="100vw"
                className="w-full h-auto max-h-[85vh] object-contain bg-black"
                rounded={false}
                priority
              />
              <p className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white font-semibold text-center">
                {lightbox.title}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
