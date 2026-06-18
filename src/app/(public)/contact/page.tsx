"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { PageHero } from "@/components/shared/page-hero";
import { AnimatedSection } from "@/components/shared/animated-section";
import { SectionHeader } from "@/components/shared/section-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema } from "@/lib/validations";
import { SCHOOL_INFO } from "@/lib/school-data";
import type { z } from "zod";

type ContactForm = z.infer<typeof contactSchema>;

const DEPARTMENTS = [
  { name: "Admissions Office", phone: "+91 98765 43210", email: "admissions@littlechamps.edu" },
  { name: "Accounts Department", phone: "+91 98765 43211", email: "accounts@littlechamps.edu" },
  { name: "Academic Office", phone: "+91 98765 43212", email: "academic@littlechamps.edu" },
  { name: "Transport Department", phone: "+91 98765 43213", email: "transport@littlechamps.edu" },
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
                  <item.icon className="h-8 w-8 text-gold mx-auto mb-3" />
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
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name *</Label>
                        <Input id="name" {...register("name")} />
                        {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input id="phone" {...register("phone")} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" {...register("email")} />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input id="subject" {...register("subject")} />
                    </div>
                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea id="message" rows={5} {...register("message")} />
                    </div>
                    <Button type="submit" variant="gold" className="gap-2" disabled={isSubmitting}>
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
                      <Clock className="h-5 w-5 text-gold" />
                      <div>
                        <p className="font-medium">Weekdays</p>
                        <p className="text-sm text-muted-foreground">{SCHOOL_INFO.timings.weekdays}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gold" />
                      <div>
                        <p className="font-medium">Saturday</p>
                        <p className="text-sm text-muted-foreground">{SCHOOL_INFO.timings.saturday}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gold" />
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
              <iframe
                title="Little Champs School Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.0!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjYiTiA3MsKwNTInMzkuNyJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </AnimatedSection>
    </>
  );
}
