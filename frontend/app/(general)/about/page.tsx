"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  Users,
  Heart,
  ShieldCheck,
  Globe,
  Zap,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <div className="relative bg-muted/30 border-b overflow-hidden">
        <div className="container py-24 md:py-40 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight mb-8">
              Revolutionizing <span className="text-primary">Education</span>{" "}
              Management.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              We're on a mission to empower institutions and students with the
              world's most intuitive and powerful campus platform.
            </p>
          </div>
        </div>
        {/* Abstract background */}
        <div className="absolute top-0 right-0 w-1/2 h-full -z-10 opacity-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[150px]"></div>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="py-32">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[4rem] bg-muted overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000"
                  alt="Team working"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-12 -right-12 p-12 bg-primary text-primary-foreground rounded-[3rem] shadow-2xl hidden lg:block">
                <p className="text-4xl font-extrabold mb-2">10M+</p>
                <p className="text-sm font-bold uppercase tracking-widest opacity-80">
                  Users Worldwide
                </p>
              </div>
            </div>
            <div className="space-y-12">
              <div className="space-y-6">
                <h2 className="text-4xl font-bold tracking-tight">
                  Our Mission
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  To bridge the gap between technology and education, making
                  campus management seamless, accessible, and data-driven for
                  everyone.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {[
                  {
                    title: "Innovation",
                    desc: "Always pushing the boundaries of what's possible in EdTech.",
                    icon: Zap,
                  },
                  {
                    title: "Accessibility",
                    desc: "Built for everyone, everywhere, on any device.",
                    icon: Globe,
                  },
                  {
                    title: "Trust",
                    desc: "Security and privacy are at the core of everything we do.",
                    icon: ShieldCheck,
                  },
                  {
                    title: "Community",
                    desc: "Empowering students and educators to thrive together.",
                    icon: Heart,
                  },
                ].map((item) => (
                  <div key={item.title} className="space-y-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h4 className="font-bold text-lg">{item.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-32 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-bold tracking-tight mb-6">
              Meet the Visionaries
            </h2>
            <p className="text-xl text-muted-foreground">
              A diverse team of educators, engineers, and designers dedicated to
              the future of education.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "CEO & Founder",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
              },
              {
                name: "Marcus Thorne",
                role: "CTO",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
              },
              {
                name: "Elena Rodriguez",
                role: "Head of Product",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
              },
              {
                name: "David Kim",
                role: "Head of Design",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
              },
            ].map((member) => (
              <div key={member.name} className="group text-center">
                <div className="relative mx-auto mb-6 h-48 w-48 rounded-[2.5rem] bg-background overflow-hidden shadow-xl group-hover:shadow-primary/20 transition-all duration-500 group-hover:-translate-y-2">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold mb-1">{member.name}</h4>
                <p className="text-sm text-muted-foreground font-medium">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-32">
        <div className="container">
          <div className="bg-primary rounded-[4rem] p-12 md:p-24 text-center text-primary-foreground relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
                Join the Revolution
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-12 leading-relaxed">
                Whether you're an institution looking to scale or a student
                ready to start your journey, Smart Campus is here for you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="xl"
                  variant="secondary"
                  className="w-full sm:w-auto rounded-2xl font-bold px-12 h-16 text-lg"
                >
                  Get Started
                </Button>
                <Button
                  size="xl"
                  variant="outline"
                  className="w-full sm:w-auto rounded-2xl font-bold px-12 h-16 text-lg border-white/20 hover:bg-white/10"
                >
                  View Careers
                </Button>
              </div>
            </div>
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
              <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[100%] bg-white rounded-full blur-[120px] -rotate-45"></div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
