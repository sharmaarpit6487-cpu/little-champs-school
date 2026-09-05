"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { SchoolMap } from "@/components/shared/school-map";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema } from "@/lib/validations";
import { SCHOOL_INFO } from "@/lib/school-data";
import { SCHOOL_IMAGES } from "@/lib/school-images";
import type { z } from "zod";

type ContactForm = z.infer<typeof contactSchema>;

const DEPARTMENTS = [
  { name: "Admissions Office", phone: SCHOOL_INFO.phone, email: SCHOOL_INFO.email },
  { name: "Accounts Department", phone: SCHOOL_INFO.alternatePhone, email: "accounts@littlechamps.edu" },
  { name: "Academic Office", phone: SCHOOL_INFO.phone, email: "academic@littlechamps.edu" },
  { name: "Principal's Office", phone: SCHOOL_INFO.phone, email: SCHOOL_INFO.email },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
      toast.success("Message sent successfully! We'll get back to you soon.");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="Get in Touch"
        description="We'd love to hear from you. Reach out for admissions, inquiries, or any assistance."
        image={SCHOOL_IMAGES.campusWide}
        imageAlt="Little Champs School, Bhiwandi"
      />

      <AnimatedSection className="section-padding">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {[
              { icon: MapPin, title: "Address", content: `${SCHOOL_INFO.address}, ${SCHOOL_INFO.city}, ${SCHOOL_INFO.state} - ${SCHOOL_INFO.pincode}` },
              { icon: Phone, title: "Phone", content: SCHOOL_INFO.phone },
              { icon: Mail, title: "Email", content: SCHOOL_INFO.email },
            ].map((item, i) => (
              <Card key={i} className="glass-card text-center">
                <CardContent className="p-6">
                  <item.icon className="h-8 w-8 text-brand-yellow dark:text-amber-400 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <SectionHeader title="Send us a Message" align="left" />
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input id="name" autoFocus aria-invalid={!!errors.name} {...register("name")} />
                        {errors.name && <p className="text-sm text-destructive mt-1" role="alert">{errors.name.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input id="phone" aria-invalid={!!errors.phone} {...register("phone")} />
                        {errors.phone && <p className="text-sm text-destructive mt-1" role="alert">{errors.phone.message}</p>}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" aria-invalid={!!errors.email} {...register("email")} />
                      {errors.email && <p className="text-sm text-destructive mt-1" role="alert">{errors.email.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input id="subject" aria-invalid={!!errors.subject} {...register("subject")} />
                      {errors.subject && <p className="text-sm text-destructive mt-1" role="alert">{errors.subject.message}</p>}
                    </div>
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea id="message" rows={5} aria-invalid={!!errors.message} {...register("message")} />
                      {errors.message && <p className="text-sm text-destructive mt-1" role="alert">{errors.message.message}</p>}
                    </div>
                    <Button type="submit" variant="default" className="gap-2 w-full sm:w-auto" disabled={isSubmitting}>
                      <Send className="h-4 w-4" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <SectionHeader title="School Timings" align="left" />
                <Card>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-brand-yellow dark:text-amber-400" />
                      <div>
                        <p className="font-medium">Weekdays</p>
                        <p className="text-sm text-muted-foreground">{SCHOOL_INFO.timings.weekdays}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-brand-yellow dark:text-amber-400" />
                      <div>
                        <p className="font-medium">Saturday</p>
                        <p className="text-sm text-muted-foreground">{SCHOOL_INFO.timings.saturday}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-brand-yellow dark:text-amber-400" />
                      <div>
                        <p className="font-medium">Office Hours</p>
                        <p className="text-sm text-muted-foreground">{SCHOOL_INFO.timings.office}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <SectionHeader title="Department Contacts" align="left" />
                <div className="space-y-3">
                  {DEPARTMENTS.map((dept) => (
                    <Card key={dept.name}>
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-1">{dept.name}</h4>
                        <p className="text-sm text-muted-foreground">{dept.phone}</p>
                        <p className="text-sm text-muted-foreground">{dept.email}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <SectionHeader title="Find Us on Map" />
            <div className="rounded-2xl overflow-hidden h-96 bg-muted">
              <SchoolMap minHeight={384} />
            </div>
            <p className="text-center mt-3">
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
        </div>
      </AnimatedSection>
    </>
  );
}
