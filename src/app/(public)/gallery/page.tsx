"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Play } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection } from "@/components/shared/animated-section";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const GALLERY_ITEMS = [
  { id: 1, title: "Annual Day 2024", category: "events", image: "https://images.unsplash.com/photo-1509062522246-3755597927d7?w=600&h=400&fit=crop", type: "image" },
  { id: 2, title: "Science Exhibition", category: "academic", image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop", type: "image" },
  { id: 3, title: "Sports Day", category: "sports", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba7951?w=600&h=400&fit=crop", type: "image" },
  { id: 4, title: "Classroom Learning", category: "academic", image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=400&fit=crop", type: "image" },
  { id: 5, title: "Art Competition", category: "cultural", image: "https://images.unsplash.com/photo-1460661419201-fd4cecdfcd13?w=600&h=400&fit=crop", type: "image" },
  { id: 6, title: "Independence Day", category: "events", image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop", type: "image" },
  { id: 7, title: "Library Session", category: "academic", image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop", type: "image" },
  { id: 8, title: "Basketball Tournament", category: "sports", image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=600&h=400&fit=crop", type: "image" },
  { id: 9, title: "School Tour Video", category: "campus", image: "https://images.unsplash.com/photo-1562774053-701939374585?w=600&h=400&fit=crop", type: "video" },
];

const CATEGORIES = ["all", "events", "academic", "sports", "cultural", "campus"];

export default function GalleryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<typeof GALLERY_ITEMS[0] | null>(null);

  const filtered = GALLERY_ITEMS.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <PageHero
        title="Gallery"
        subtitle="Memories"
        description="Explore moments of learning, achievement, and joy at Little Champs School."
      />

      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search gallery..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  variant={category === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat)}
                  className="capitalize"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
                  <Badge variant="gold" className="mb-2 capitalize">{item.category}</Badge>
                  <h3 className="text-white font-semibold">{item.title}</h3>
                </div>
                {item.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="h-6 w-6 text-navy ml-1" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-12">No items found matching your search.</p>
          )}
        </div>
      </AnimatedSection>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full aspect-video"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                className="object-contain"
              />
              <p className="text-white text-center mt-4 text-lg">{selectedImage.title}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
