"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, LogIn, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { SchoolLogo } from "@/components/layout/school-logo";
import { NAV_LINKS, SCHOOL_INFO } from "@/lib/school-data";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass-nav py-0" : "bg-transparent py-1"
      )}
    >
      <div className="hidden md:block bg-blue-500/10 dark:bg-blue-950/40 border-b border-slate-200/60 dark:border-slate-800">
        <div className="container-custom flex items-center justify-between h-9 px-4 text-xs text-slate-600 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <Phone className="h-3 w-3 text-brand-blue" />
            {SCHOOL_INFO.phone}
          </span>
          <span>{SCHOOL_INFO.classes} &bull; {SCHOOL_INFO.city}, {SCHOOL_INFO.state}</span>
        </div>
      </div>

      <nav className="container-custom flex items-center justify-between h-16 md:h-[4.5rem] px-4 md:px-6">
        <Link href="/" aria-label="Go to homepage">
          <SchoolLogo size="md" />
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3.5 py-2 text-sm font-semibold rounded-xl transition-all duration-200",
                isActive(link.href)
                  ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950"
                  : "text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/60 dark:hover:bg-blue-950/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/admissions" className="hidden md:block">
            <Button variant="orange" size="sm">
              Apply Now
            </Button>
          </Link>
          <Link href="/login" className="hidden sm:block">
            <Button variant="outline" size="sm" className="gap-1.5 border-2">
              <LogIn className="h-4 w-4" />
              Portal
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-slate-700 dark:text-slate-300"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden"
          >
            <div className="container-custom py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-3 text-sm font-semibold rounded-xl transition-colors",
                    isActive(link.href)
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950"
                      : "text-slate-600 dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-blue-950"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <Link href="/admissions">
                  <Button variant="orange" className="w-full">Apply for Admission</Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" className="w-full gap-2">
                    <LogIn className="h-4 w-4" />
                    Portal Login
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
