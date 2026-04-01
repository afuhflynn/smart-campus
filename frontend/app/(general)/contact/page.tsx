"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  HelpCircle,
  Twitter,
  Linkedin,
  Github,
} from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent!", {
      description: "We'll get back to you as soon as possible.",
    });
  };

  return (
    <PublicLayout>
      <div className="bg-muted/30 border-b">
        <div className="container py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have questions? We're here to help. Reach out to our team and we'll
            get back to you within 24 hours.
          </p>
        </div>
      </div>

      <div className="container py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Contact Info */}
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight">
                Contact Information
              </h2>
              <p className="text-muted-foreground">
                Fill out the form and our team will get back to you within 24
                hours.
              </p>
            </div>

            <div className="space-y-8">
              {[
                { icon: Phone, label: "Phone", value: "+1 (555) 000-0000" },
                { icon: Mail, label: "Email", value: "hello@smartcampus.com" },
                {
                  icon: MapPin,
                  label: "Office",
                  value: "123 Education Way, San Francisco, CA",
                },
              ].map((item) => (
                <div key={item.label} className="flex gap-6">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">
                      {item.label}
                    </p>
                    <p className="text-lg font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6">
                Follow Us
              </p>
              <div className="flex gap-4">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 rounded-xl hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2 border-0 shadow-2xl shadow-primary/5 rounded-[3rem] overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <Input
                      placeholder="John"
                      className="h-12 rounded-xl bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-primary/20"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <Input
                      placeholder="Doe"
                      className="h-12 rounded-xl bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-primary/20"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    className="h-12 rounded-xl bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-primary/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input
                    placeholder="How can we help?"
                    className="h-12 rounded-xl bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-primary/20"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea
                    placeholder="Tell us more about your inquiry..."
                    className="min-h-[150px] rounded-2xl bg-muted/30 border-0 focus-visible:ring-1 focus-visible:ring-primary/20 p-4"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20"
                >
                  Send Message <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Preview */}
        <div className="mt-32 text-center space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Quick answers to common questions about Smart Campus.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
            {[
              {
                q: "Is there a free trial?",
                a: "Yes, we offer a 14-day free trial for institutions to explore all our premium features.",
              },
              {
                q: "How secure is my data?",
                a: "We use industry-standard encryption and follow strict GDPR guidelines to ensure your data is always safe.",
              },
              {
                q: "Can I cancel my subscription?",
                a: "Of course. You can cancel or downgrade your plan at any time from your billing dashboard.",
              },
              {
                q: "Do you offer student discounts?",
                a: "Smart Campus is free for students! Institutions pay for the platform to provide it to their campus.",
              },
            ].map((faq, i) => (
              <div key={i} className="space-y-3 p-6 rounded-3xl bg-muted/30">
                <h4 className="font-bold flex items-center gap-2">
                  <HelpCircle className="h-4 w-4 text-primary" /> {faq.q}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
          <Button variant="link" className="text-primary font-bold">
            View all FAQs <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
}
