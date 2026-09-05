import { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SCHOOL_INFO } from "@/lib/school-data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Little Champs School website and portals.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy Policy" subtitle="Legal" />
      <AnimatedSection className="section-padding">
        <div className="container-custom max-w-3xl prose prose-slate dark:prose-invert">
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {SCHOOL_INFO.name} respects your privacy. We collect only information necessary for
            admissions, student records, fee management, and school communications. Data is stored
            securely and is not shared with third parties except where required by law.
          </p>
          <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white mt-8 mb-3">Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-400">
            <li>Student and parent contact details submitted via admission forms</li>
            <li>Account credentials for portal access</li>
            <li>Fee payment and academic records for enrolled students</li>
          </ul>
          <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white mt-8 mb-3">Contact</h2>
          <p className="text-slate-600 dark:text-slate-400">
            For privacy inquiries, email {SCHOOL_INFO.email} or call {SCHOOL_INFO.phone}.
          </p>
        </div>
      </AnimatedSection>
    </>
  );
}
