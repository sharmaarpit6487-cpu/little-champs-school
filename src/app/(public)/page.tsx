"use client";


import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Users,
  Sparkles,
  Heart,
  Baby,
  Blocks,
  Palette,
  BookOpen,
  GraduationCap,
  Monitor,
  Laptop,
  Trophy,
  Music,
  FlaskConical,
  Bus,
  Phone,
  Mail,
  MapPin,
  Clock,
  FileText,
  CheckCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SchoolLogo } from "@/components/layout/school-logo";
import { AnimatedSection, SlideUp } from "@/components/shared/animated-section";
import { StatsCounter } from "@/components/shared/stats-counter";
import { SectionHeader } from "@/components/shared/section-header";
import { TestimonialSlider } from "@/components/home/testimonial-slider";
import { GallerySection } from "@/components/home/gallery-section";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { PrincipalSection } from "@/components/home/principal-section";
import { AchievementsSection } from "@/components/home/achievements-section";
import { SchoolMap } from "@/components/shared/school-map";
import { SchoolImage } from "@/components/shared/school-image";
import { SCHOOL_IMAGES } from "@/lib/school-images";
import {
  SCHOOL_INFO,
  ABOUT_FEATURES,
  PROGRAMS,
  WHY_CHOOSE_US,
  FACILITIES,
  ADMISSION_STEPS,
} from "@/lib/school-data";

const aboutIcons: Record<string, React.ElementType> = {
  shield: Shield,
  users: Users,
  sparkles: Sparkles,
  heart: Heart,
};

const programIcons: Record<string, React.ElementType> = {
  baby: Baby,
  blocks: Blocks,
  palette: Palette,
  book: BookOpen,
  graduation: GraduationCap,
};

const whyIcons: Record<string, React.ElementType> = {
  monitor: Monitor,
  laptop: Laptop,
  bookOpen: BookOpen,
  trophy: Trophy,
  music: Music,
  flask: FlaskConical,
  bus: Bus,
  shield: Shield,
};

const stepIcons: Record<string, React.ElementType> = {
  phone: Phone,
  file: FileText,
  users: Users,
  check: CheckCircle,
};

const heroStats = [
  { value: SCHOOL_INFO.stats.students, suffix: "+", label: "Students", color: "text-brand-blue" },
  { value: SCHOOL_INFO.stats.teachers, suffix: "+", label: "Teachers", color: "text-brand-green" },
  { value: SCHOOL_INFO.stats.care, suffix: "%", label: "Care", color: "text-brand-orange" },
  { value: SCHOOL_INFO.stats.years, suffix: "+", label: "Years of Excellence", color: "text-purple-600" },
];

export default function HomePage() {
  return (
    <>
      {/* SECTION 1 - HERO */}
      <section className="relative min-h-screen hero-gradient overflow-hidden flex items-center pt-24 md:pt-28">
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-20 left-[5%] w-80 h-80 bg-brand-yellow/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/3 left-1/4 w-40 h-40 bg-brand-orange/10 rounded-full blur-2xl animate-float" />

        {/* Floating decorative shapes */}
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-32 right-[15%] hidden lg:block w-16 h-16 rounded-2xl bg-brand-yellow/30 backdrop-blur-sm"
        />
        <motion.div
          animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute bottom-40 right-[25%] hidden lg:block w-12 h-12 rounded-full bg-brand-green/30"
        />
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-48 left-[10%] hidden lg:block w-10 h-10 rounded-xl bg-brand-orange/25"
        />

        <div className="container-custom relative section-padding pb-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className="mb-6 lg:hidden">
                <SchoolLogo size="lg" />
              </div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 shadow-soft text-sm font-semibold text-blue-600 dark:text-blue-400 mb-6">
                <Star className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
                Nursery to Class 8 &bull; Est. {SCHOOL_INFO.established}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 dark:text-white leading-[1.1] mb-6">
                Where Young Minds{" "}
                <span className="text-gradient">Grow</span> and{" "}
                <span className="text-gradient-warm">Dreams Begin</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-xl">
                Providing quality education from Nursery to Class 8 with love,
                creativity and excellence.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/admissions">
                  <Button variant="orange" size="lg" className="gap-2">
                    Apply for Admission
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/#facilities">
                  <Button variant="outline" size="lg">
                    Explore Campus
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <HeroCarousel />
            </motion.div>
          </div>

          {/* Hero stats row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          >
            {heroStats.map((stat) => (
              <div key={stat.label} className="glass-card p-5 text-center card-hover">
                <StatsCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  label={stat.label}
                  color={stat.color}
                />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 - ABOUT */}
      <AnimatedSection id="about" className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-3 bg-gradient-to-br from-brand-blue/10 to-brand-yellow/10 rounded-[2rem]" />
          <SchoolImage
            src={SCHOOL_IMAGES.campus}
            alt="Little Champs School campus in Bhiwandi"
                width={600}
                height={500}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="relative w-full aspect-[6/5] shadow-card"
              />
              <div className="absolute -bottom-6 -right-4 md:-right-8 glass-card px-6 py-4">
                <p className="font-display font-bold text-2xl text-brand-blue">{SCHOOL_INFO.stats.years}+</p>
                <p className="text-sm text-slate-500 font-semibold">Years of Excellence</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <SectionHeader
                subtitle="About Us"
                title="Welcome to Little Champs School"
                description="A friendly, nurturing environment where every child discovers their potential through play, creativity, and caring guidance."
                align="left"
              />
              <div className="grid sm:grid-cols-2 gap-4">
                {ABOUT_FEATURES.map((feature, i) => {
                  const Icon = aboutIcons[feature.icon] || Heart;
                  return (
                    <SlideUp key={feature.title} delay={i * 0.1}>
                      <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 card-hover border border-blue-50 dark:border-gray-800">
                        <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-3`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-display font-bold text-slate-800 dark:text-white mb-1">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                      </div>
                    </SlideUp>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* SECTION 2B - PRINCIPAL MESSAGE */}
      <PrincipalSection />

      {/* SECTION 3 - PROGRAMS */}
      <AnimatedSection id="programs" className="section-padding bg-gradient-to-b from-blue-50/80 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-custom">
          <SectionHeader
            subtitle="Programs"
            title="Our Learning Programs"
            description="Age-appropriate curriculum designed for every stage of your child's development"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {PROGRAMS.map((program, i) => {
              const Icon = programIcons[program.icon] || BookOpen;
              return (
                <SlideUp key={program.title} delay={i * 0.08}>
                  <div className={`group ${program.bg} dark:bg-slate-900 rounded-3xl p-6 h-full card-hover border border-white dark:border-slate-800 shadow-soft`}>
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${program.color} text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-1">
                      {program.title}
                    </h3>
                    <p className="text-xs font-semibold text-brand-blue mb-2">{program.age}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{program.description}</p>
                  </div>
                </SlideUp>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* SECTION 4 - WHY CHOOSE US */}
      <AnimatedSection className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom">
          <SectionHeader
            subtitle="Why Choose Us"
            title="Everything Your Child Needs to Thrive"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_CHOOSE_US.map((item, i) => {
              const Icon = whyIcons[item.icon] || Star;
              return (
                <SlideUp key={item.title} delay={i * 0.06}>
                  <div className="group p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-gray-800 shadow-soft card-hover text-center">
                    <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl ${item.color} text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="font-display font-bold text-slate-800 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                  </div>
                </SlideUp>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      {/* SECTION 5 - FACILITIES */}
      <AnimatedSection id="facilities" className="section-padding bg-gradient-to-b from-amber-50/50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-custom">
          <SectionHeader
            subtitle="Facilities"
            title="A Campus Built for Learning & Play"
            description="Modern, colorful spaces where children explore, create, and grow"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FACILITIES.map((facility, i) => (
              <SlideUp key={facility.title} delay={i * 0.08}>
                <div className="group relative aspect-[4/3] rounded-3xl overflow-hidden shadow-card card-hover">
                  <SchoolImage
                    src={facility.image}
                    alt={facility.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="group-hover:scale-110 transition-transform duration-500"
                    rounded={false}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/90 via-brand-blue/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display font-bold text-xl text-white mb-1">{facility.title}</h3>
                    <p className="text-sm text-white/80">{facility.description}</p>
                  </div>
                </div>
              </SlideUp>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* SECTION 6 - ACHIEVEMENTS */}
      <AchievementsSection />

      {/* SECTION 7 - TESTIMONIALS */}
      <AnimatedSection className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom">
          <SectionHeader
            subtitle="Testimonials"
            title="What Parents Say About Us"
            description="Hear from families who trust Little Champs with their children's education"
          />
          <TestimonialSlider />
        </div>
      </AnimatedSection>

      {/* SECTION 8 - GALLERY */}
      <GallerySection />

      {/* SECTION 9 - ADMISSION PROCESS */}
      <AnimatedSection className="section-padding bg-gradient-to-b from-green-50/50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container-custom">
          <SectionHeader
            subtitle="Admissions"
            title="Simple Admission Process"
            description="Four easy steps to join the Little Champs family"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ADMISSION_STEPS.map((step, i) => {
              const Icon = stepIcons[step.icon] || CheckCircle;
              return (
                <SlideUp key={step.step} delay={i * 0.1}>
                  <div className="relative p-6 rounded-3xl bg-white dark:bg-slate-900 shadow-soft card-hover border border-green-100 dark:border-gray-800 text-center h-full">
                    {i < ADMISSION_STEPS.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-brand-green/30" />
                    )}
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-green to-emerald-400 text-white font-display font-bold text-xl shadow-lg">
                      {step.step}
                    </div>
                    <Icon className="h-6 w-6 text-brand-green mx-auto mb-3" />
                    <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{step.description}</p>
                  </div>
                </SlideUp>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <Link href="/admissions">
              <Button variant="green" size="lg" className="gap-2">
                Start Your Application <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* SECTION 10 - CONTACT */}
      <AnimatedSection id="contact" className="section-padding bg-white dark:bg-slate-950">
        <div className="container-custom">
          <SectionHeader
            subtitle="Contact"
            title="Get in Touch With Us"
            description="We'd love to hear from you. Visit us or reach out anytime."
          />
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Phone, title: "Phone", content: SCHOOL_INFO.phone, color: "bg-green-100 text-brand-green", href: `tel:${SCHOOL_INFO.phone}` },
                { icon: Mail, title: "Email", content: SCHOOL_INFO.email, color: "bg-blue-100 text-brand-blue", href: `mailto:${SCHOOL_INFO.email}` },
                { icon: MapPin, title: "Address", content: `${SCHOOL_INFO.address}, ${SCHOOL_INFO.city}`, color: "bg-orange-100 text-brand-orange" },
                { icon: Clock, title: "Working Hours", content: SCHOOL_INFO.timings.weekdays, color: "bg-amber-100 text-amber-600" },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-gray-800 card-hover">
                  <div className={`inline-flex p-3 rounded-xl ${item.color} mb-3`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display font-bold text-slate-800 dark:text-white mb-1">{item.title}</h3>
                  {item.href ? (
                    <a href={item.href} className="text-sm text-slate-600 hover:text-brand-blue transition-colors">{item.content}</a>
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.content}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="rounded-3xl overflow-hidden shadow-card h-80 lg:h-auto min-h-[320px] border border-blue-100">
              <SchoolMap />
            </div>
            <p className="text-center mt-3 lg:col-span-2">
              <a
                href={SCHOOL_INFO.mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-brand-blue hover:underline"
              >
                Open in Google Maps
              </a>
            </p>
          </div>
          <div className="text-center mt-8">
            <Link href="/contact">
              <Button variant="default" size="lg">Contact Form</Button>
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
