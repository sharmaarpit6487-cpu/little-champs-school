"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Trophy,
  GraduationCap,
  Leaf,
  Medal,
  Users,
  Building,
  Heart,
  Target,
  Shield,
  MessageCircle,
  Calendar,
  Star,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection, SlideUp } from "@/components/shared/animated-section";
import { StatsCounter } from "@/components/shared/stats-counter";
import { SectionHeader } from "@/components/shared/section-header";
import {
  SCHOOL_INFO,
  ACHIEVEMENTS,
  WHY_CHOOSE_US,
  FACILITIES,
  SUCCESS_STORIES,
} from "@/lib/school-data";

const iconMap: Record<string, React.ElementType> = {
  trophy: Trophy,
  graduation: GraduationCap,
  leaf: Leaf,
  medal: Medal,
  users: Users,
  building: Building,
  heart: Heart,
  target: Target,
  shield: Shield,
  message: MessageCircle,
};

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen hero-gradient text-white overflow-hidden flex items-center">
        <div className="absolute inset-0 hero-pattern opacity-30" />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 right-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"
        />

        <div className="container-custom relative section-padding pt-32 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Badge className="mb-6 bg-gold/20 text-gold border-gold/30">
                Est. {SCHOOL_INFO.established} &bull; CBSE Affiliated
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Welcome to{" "}
                <span className="text-gold">{SCHOOL_INFO.name}</span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-xl">
                {SCHOOL_INFO.tagline}. We nurture young minds with world-class
                education, modern facilities, and a caring community.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/admissions">
                  <Button variant="gold" size="lg" className="gap-2">
                    Apply for Admission
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-gold/20 blur-2xl" />
                <Image
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&h=600&fit=crop"
                  alt="Students at Little Champs School"
                  width={600}
                  height={600}
                  className="relative rounded-3xl object-cover shadow-2xl"
                  priority
                />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-6 -left-6 glass-card p-4 rounded-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gold flex items-center justify-center">
                      <Star className="h-6 w-6 text-navy" />
                    </div>
                    <div>
                      <p className="font-bold text-navy text-2xl">
                        {SCHOOL_INFO.stats.passRate}%
                      </p>
                      <p className="text-sm text-muted-foreground">Pass Rate</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-muted/50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            <StatsCounter value={SCHOOL_INFO.stats.students} label="Students" suffix="+" />
            <StatsCounter value={SCHOOL_INFO.stats.teachers} label="Teachers" suffix="+" />
            <StatsCounter value={SCHOOL_INFO.stats.years} label="Years of Excellence" suffix="+" />
            <StatsCounter value={SCHOOL_INFO.stats.awards} label="Awards Won" suffix="+" />
            <StatsCounter value={SCHOOL_INFO.stats.passRate} label="Pass Rate" suffix="%" decimals={1} />
            <StatsCounter value={SCHOOL_INFO.stats.alumni} label="Alumni" suffix="+" />
          </div>
        </div>
      </section>

      {/* Achievements */}
      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <SectionHeader
            subtitle="Our Pride"
            title="School Achievements"
            description="Recognition and excellence that define our commitment to quality education"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {ACHIEVEMENTS.map((item, i) => {
              const Icon = iconMap[item.icon] || Trophy;
              return (
                <SlideUp key={i} delay={i * 0.1}>
                  <Card className="glass-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
                    <CardContent className="p-6 text-center">
                      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10">
                        <Icon className="h-7 w-7 text-gold" />
                      </div>
                      <Badge variant="gold" className="mb-3">
                        {item.year}
                      </Badge>
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </SlideUp>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Principal's Message */}
      <AnimatedSection className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Image
                src={SCHOOL_INFO.principal.image}
                alt={SCHOOL_INFO.principal.name}
                width={500}
                height={500}
                className="rounded-3xl object-cover shadow-2xl"
              />
              <div className="absolute -bottom-4 -right-4 glass-card p-4 rounded-2xl">
                <p className="font-display font-bold text-lg">{SCHOOL_INFO.principal.name}</p>
                <p className="text-sm text-muted-foreground">Principal</p>
              </div>
            </div>
            <div>
              <SectionHeader
                subtitle="Leadership"
                title="Principal's Message"
                align="left"
              />
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 h-8 w-8 text-gold/30" />
                <p className="text-muted-foreground leading-relaxed text-lg pl-6">
                  {SCHOOL_INFO.principal.message}
                </p>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                — {SCHOOL_INFO.principal.qualification}
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Why Choose Us */}
      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <SectionHeader
            subtitle="Excellence"
            title="Why Choose Little Champs?"
            description="Discover what makes us the preferred choice for parents and students"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE_US.map((item, i) => {
              const Icon = iconMap[item.icon] || Star;
              return (
                <SlideUp key={i} delay={i * 0.1}>
                  <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full border-0 bg-muted/50">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy text-white group-hover:bg-gold group-hover:text-navy transition-colors">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </SlideUp>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* Facilities */}
      <AnimatedSection className="section-padding bg-navy text-white">
        <div className="container-custom">
          <SectionHeader
            subtitle="Campus"
            title="World-Class Facilities"
            description="State-of-the-art infrastructure designed for holistic learning"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FACILITIES.map((facility, i) => (
              <SlideUp key={i} delay={i * 0.1}>
                <div className="group relative overflow-hidden rounded-2xl aspect-[4/3]">
                  <Image
                    src={facility.image}
                    alt={facility.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-semibold text-xl mb-1">{facility.title}</h3>
                    <p className="text-sm text-white/70">{facility.description}</p>
                  </div>
                </div>
              </SlideUp>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Success Stories */}
      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <SectionHeader
            subtitle="Alumni"
            title="Student Success Stories"
            description="Hear from our students who have achieved remarkable success"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {SUCCESS_STORIES.map((story, i) => (
              <SlideUp key={i} delay={i * 0.1}>
                <Card className="glass-card h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Image
                        src={story.image}
                        alt={story.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{story.name}</h3>
                        <p className="text-sm text-muted-foreground">{story.class}</p>
                      </div>
                    </div>
                    <Badge variant="gold" className="mb-3">
                      {story.achievement}
                    </Badge>
                    <p className="text-sm text-muted-foreground italic">
                      &ldquo;{story.quote}&rdquo;
                    </p>
                  </CardContent>
                </Card>
              </SlideUp>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Admission CTA */}
      <section className="section-padding bg-gradient-to-r from-navy to-navy-light text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Begin Your Child&apos;s Journey of Excellence
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Admissions are now open for the academic year 2025-26. Secure your
              child&apos;s future with quality education at Little Champs School.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/admissions">
                <Button variant="gold" size="lg" className="gap-2">
                  Apply Now
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Info */}
      <AnimatedSection className="section-padding bg-muted/30">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Calendar className="h-8 w-8 text-gold mx-auto mb-3" />
              <h3 className="font-semibold mb-1">School Hours</h3>
              <p className="text-sm text-muted-foreground">{SCHOOL_INFO.timings.weekdays}</p>
            </div>
            <div>
              <MessageCircle className="h-8 w-8 text-gold mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Get in Touch</h3>
              <p className="text-sm text-muted-foreground">{SCHOOL_INFO.phone}</p>
            </div>
            <div>
              <GraduationCap className="h-8 w-8 text-gold mx-auto mb-3" />
              <h3 className="font-semibold mb-1">Visit Us</h3>
              <p className="text-sm text-muted-foreground">
                {SCHOOL_INFO.address}, {SCHOOL_INFO.city}
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
