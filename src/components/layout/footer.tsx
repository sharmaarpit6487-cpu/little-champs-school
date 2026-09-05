import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Clock,
} from "lucide-react";
import { SchoolLogo } from "@/components/layout/school-logo";
import { SCHOOL_INFO, NAV_LINKS, FOOTER_PROGRAMS } from "@/lib/school-data";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-950 border-t border-blue-100 dark:border-gray-800">
      <div className="container-custom section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div className="space-y-5">
            <SchoolLogo size="lg" />
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Providing quality education from Nursery to Class 8 with love, creativity
              and excellence since {SCHOOL_INFO.established}.
            </p>
            <div className="flex gap-2">
              {[
                { icon: Facebook, href: SCHOOL_INFO.social.facebook, color: "hover:bg-blue-600", label: "Facebook" },
                { icon: Instagram, href: SCHOOL_INFO.social.instagram, color: "hover:bg-pink-500", label: "Instagram" },
                { icon: Twitter, href: SCHOOL_INFO.social.twitter, color: "hover:bg-sky-500", label: "Twitter" },
                { icon: Youtube, href: SCHOOL_INFO.social.youtube, color: "hover:bg-red-500", label: "YouTube" },
              ].map(({ icon: Icon, href, label, color }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 shadow-sm ${color} hover:text-white transition-all duration-200`}
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-slate-800 dark:text-white">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-blue transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/login" className="text-sm text-slate-600 hover:text-brand-blue transition-colors">
                  Portal Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-slate-800 dark:text-white">
              Our Programs
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_PROGRAMS.map((program) => (
                <li key={program}>
                  <Link
                    href="/#programs"
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-blue transition-colors"
                  >
                    {program}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4 text-slate-800 dark:text-white">
              Contact Info
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand-blue" />
                <span>{SCHOOL_INFO.address}, {SCHOOL_INFO.pincode}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <Phone className="h-4 w-4 shrink-0 text-brand-green" />
                <a href={`tel:${SCHOOL_INFO.phone}`} className="hover:text-brand-blue">{SCHOOL_INFO.phone}</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="h-4 w-4 shrink-0 text-brand-orange" />
                <a href={`mailto:${SCHOOL_INFO.email}`} className="hover:text-brand-blue">{SCHOOL_INFO.email}</a>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-600">
                <Clock className="h-4 w-4 mt-0.5 shrink-0 text-brand-yellow" />
                <span>Mon-Sat: {SCHOOL_INFO.timings.weekdays}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {SCHOOL_INFO.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <Link href="/privacy" className="hover:text-brand-blue transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-blue transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
