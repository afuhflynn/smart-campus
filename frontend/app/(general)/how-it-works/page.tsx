"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  CheckCircle2,
  Users,
  School,
  GraduationCap,
  ArrowRight,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <div className="bg-muted/30 border-b">
        <div className="container py-20 md:py-32 text-center">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6">
            How it <span className="text-primary">Works</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Smart Campus simplifies the entire educational journey, from finding
            your dream school to managing your daily campus life.
          </p>
        </div>
      </div>

      {/* For Students */}
      <section className="py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-8">
              <Badge className="rounded-full px-4 py-1.5 bg-primary/10 text-primary border-0 font-bold uppercase tracking-widest text-xs">
                For Students
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight">
                Your journey to success, simplified.
              </h2>
              <div className="space-y-12">
                {[
                  {
                    step: "01",
                    title: "Discover",
                    desc: "Browse through hundreds of verified schools and programs using our advanced filters.",
                    icon: Search,
                  },
                  {
                    step: "02",
                    title: "Apply",
                    desc: "Fill out a single application profile and apply to multiple institutions with one click.",
                    icon: Zap,
                  },
                  {
                    step: "03",
                    title: "Manage",
                    desc: "Once admitted, track your attendance, grades, and payments all in one place.",
                    icon: GraduationCap,
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-6">
                    <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/20">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="rounded-xl px-10 font-bold h-14">
                Find your School <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-12">
                <div className="w-full h-full rounded-[2rem] bg-background shadow-2xl border flex flex-col overflow-hidden">
                  <div className="h-12 border-b bg-muted/30 flex items-center px-4 gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 p-8 space-y-6">
                    <div className="h-8 w-48 bg-muted rounded-lg"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-24 bg-primary/5 rounded-xl border border-primary/10"></div>
                      <div className="h-24 bg-secondary/5 rounded-xl border border-secondary/10"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 w-full bg-muted rounded"></div>
                      <div className="h-4 w-full bg-muted rounded"></div>
                      <div className="h-4 w-2/3 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 p-6 bg-background rounded-3xl shadow-2xl border animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">
                      Status
                    </p>
                    <p className="font-bold">Admitted!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Schools */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="flex-1 space-y-8">
              <Badge className="rounded-full px-4 py-1.5 bg-secondary/10 text-secondary border-0 font-bold uppercase tracking-widest text-xs">
                For Institutions
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight">
                Empower your administration.
              </h2>
              <div className="space-y-12">
                {[
                  {
                    step: "01",
                    title: "Setup",
                    desc: "Create your school profile and customize your registration forms in minutes.",
                    icon: School,
                  },
                  {
                    step: "02",
                    title: "Process",
                    desc: "Review applications, manage student records, and automate notifications.",
                    icon: Shield,
                  },
                  {
                    step: "03",
                    title: "Scale",
                    desc: "Access deep analytics and insights to grow your institution's reach.",
                    icon: Globe,
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-6">
                    <div className="flex-shrink-0 h-14 w-14 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center text-xl font-bold shadow-lg shadow-secondary/20">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                size="lg"
                variant="secondary"
                className="rounded-xl px-10 font-bold h-14"
              >
                Partner with Us <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 relative">
              <div className="aspect-square rounded-[3rem] bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center p-12">
                <div className="w-full h-full rounded-[2rem] bg-background shadow-2xl border flex flex-col overflow-hidden">
                  <div className="h-12 border-b bg-muted/30 flex items-center px-4 gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="flex-1 p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="h-8 w-32 bg-muted rounded-lg"></div>
                      <div className="h-8 w-8 bg-primary/10 rounded-full"></div>
                    </div>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="h-12 bg-muted/30 rounded-xl border border-dashed"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

import { Badge } from "@/components/ui/badge";
