import { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SCHOOL_INFO } from "@/lib/school-data";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Little Champs School website and portals.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero title="Terms of Service" subtitle="Legal" />
      <AnimatedSection className="section-padding">
        <div className="container-custom max-w-3xl">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            By using the {SCHOOL_INFO.name} website and online portals, you agree to use the platform
            responsibly and provide accurate information in all forms and applications.
          </p>
          <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white mt-8 mb-3">Use of Services</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
            <li>Portal access is restricted to authorized users only</li>
            <li>Admission applications must contain truthful information</li>
            <li>Fee payments are subject to school policies and schedules</li>
          </ul>
          <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white mt-8 mb-3">Contact</h2>
          <p className="text-slate-600 dark:text-slate-400">
            Questions about these terms? Contact us at {SCHOOL_INFO.email}.
          </p>
        </div>
      </AnimatedSection>
    </>
  );
}
