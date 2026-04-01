"use client";

import { use } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  GraduationCap,
  Users,
  Star,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { schoolService } from "@/lib/mocks/school-service";
import { DynamicForm } from "@/components/shared/dynamic-form";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";

export default function SchoolProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data: school, isLoading } = useQuery({
    queryKey: ["school", slug],
    queryFn: () => schoolService.getSchoolBySlug(slug),
  });

  if (isLoading)
    return <div className="container py-20 text-center">Loading...</div>;
  if (!school)
    return <div className="container py-20 text-center">School not found.</div>;

  const handleApply = (data: any) => {
    console.log("Application submitted:", data);
    toast.success("Application submitted successfully!", {
      description:
        "You will be notified once the school reviews your application.",
    });
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <div className="relative h-[400px] md:h-[500px]">
        <Image
          src={school.banner}
          alt={school.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full">
          <div className="container pb-12">
            <Link
              href="/schools"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Schools
            </Link>
            <div className="flex flex-col md:flex-row items-end gap-6">
              <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl border-4 border-white bg-white p-2 shadow-2xl">
                <Image
                  src={school.logo}
                  alt={school.name}
                  width={128}
                  height={128}
                  className="rounded-2xl"
                />
              </div>
              <div className="flex-1 text-white">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                  {school.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {school.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" /> {school.tuition}
                  </span>
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-current" /> 4.9 (120 reviews)
                  </span>
                </div>
              </div>
              <div className="hidden md:block">
                <Link href={`/schools/${slug}/apply`}>
                  <Button
                    size="lg"
                    className="rounded-2xl px-10 font-bold shadow-xl shadow-primary/20 h-14"
                  >
                    Apply Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4">About the Institution</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {school.description} Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo
                consequat.
              </p>
            </section>

            <Tabs defaultValue="programs" className="w-full">
              <TabsList className="w-full justify-start h-12 bg-muted/50 p-1 rounded-xl mb-8">
                <TabsTrigger value="programs" className="rounded-lg px-8">
                  Programs
                </TabsTrigger>
                <TabsTrigger value="facilities" className="rounded-lg px-8">
                  Facilities
                </TabsTrigger>
                <TabsTrigger value="testimonials" className="rounded-lg px-8">
                  Testimonials
                </TabsTrigger>
              </TabsList>

              <TabsContent value="programs" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "Computer Science",
                    "Data Science",
                    "Artificial Intelligence",
                    "Cybersecurity",
                  ].map((prog) => (
                    <Card
                      key={prog}
                      className="border-0 bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <CardContent className="p-6 flex items-center justify-between">
                        <div>
                          <h4 className="font-bold">{prog}</h4>
                          <p className="text-sm text-muted-foreground">
                            4 Years • Full-time
                          </p>
                        </div>
                        <Badge variant="outline">B.Sc.</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="facilities">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {[
                    { name: "Modern Labs", icon: CheckCircle2 },
                    { name: "Digital Library", icon: CheckCircle2 },
                    { name: "Sports Complex", icon: CheckCircle2 },
                    { name: "Student Housing", icon: CheckCircle2 },
                    { name: "Innovation Hub", icon: CheckCircle2 },
                    { name: "Medical Center", icon: CheckCircle2 },
                  ].map((f) => (
                    <div
                      key={f.name}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <f.icon className="h-5 w-5 text-primary" />
                      <span>{f.name}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <section id="apply-section" className="pt-12 border-t">
              <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-center text-primary-foreground relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold mb-4">
                    Start Your Journey
                  </h2>
                  <p className="text-primary-foreground/80 text-lg mb-10 max-w-xl mx-auto">
                    Our multi-step application process is designed to be simple
                    and efficient. Get started today!
                  </p>
                  <Link href={`/schools/${slug}/apply`}>
                    <Button
                      size="lg"
                      variant="secondary"
                      className="rounded-2xl px-12 font-bold h-16 text-lg"
                    >
                      Begin Application
                    </Button>
                  </Link>
                </div>
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="rounded-3xl border-0 shadow-xl shadow-muted/50 overflow-hidden">
              <div className="bg-primary p-6 text-primary-foreground">
                <h3 className="text-xl font-bold">Quick Facts</h3>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      Students
                    </p>
                    <p className="font-bold">15,000+</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      Tuition
                    </p>
                    <p className="font-bold">{school.tuition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">
                      Location
                    </p>
                    <p className="font-bold">{school.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 bg-muted/30">
              <CardContent className="p-6">
                <h4 className="font-bold mb-4">Need help?</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  Our admissions team is here to help you with any questions
                  about the application process.
                </p>
                <Button variant="outline" className="w-full rounded-xl">
                  Contact Admissions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
