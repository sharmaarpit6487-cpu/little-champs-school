import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { SCHOOL_INFO, NAV_LINKS } from "@/lib/school-data";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold text-navy">
                <GraduationCap className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xl">{SCHOOL_INFO.name}</h3>
                <p className="text-sm text-white/70">{SCHOOL_INFO.motto}</p>
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              Established in {SCHOOL_INFO.established}, we have been shaping young minds
              with excellence in education for over {SCHOOL_INFO.stats.years} years.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: SCHOOL_INFO.social.facebook },
                { icon: Instagram, href: SCHOOL_INFO.social.instagram },
                { icon: Twitter, href: SCHOOL_INFO.social.twitter },
                { icon: Youtube, href: SCHOOL_INFO.social.youtube },
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-gold hover:text-navy transition-colors"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold">Quick Links</h4>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/login"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  Portal Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/70">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-gold" />
                <span>
                  {SCHOOL_INFO.address}, {SCHOOL_INFO.city}, {SCHOOL_INFO.state} -{" "}
                  {SCHOOL_INFO.pincode}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <span>{SCHOOL_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/70">
                <Mail className="h-4 w-4 shrink-0 text-gold" />
                <span>{SCHOOL_INFO.email}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 text-gold">School Timings</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <span className="text-white font-medium">Weekdays:</span>{" "}
                {SCHOOL_INFO.timings.weekdays}
              </li>
              <li>
                <span className="text-white font-medium">Saturday:</span>{" "}
                {SCHOOL_INFO.timings.saturday}
              </li>
              <li>
                <span className="text-white font-medium">Office Hours:</span>{" "}
                {SCHOOL_INFO.timings.office}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/50">
            &copy; {new Date().getFullYear()} {SCHOOL_INFO.name}. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/50">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
