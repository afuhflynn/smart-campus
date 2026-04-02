import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import {
  Search,
  CheckCircle2,
  Users,
  School,
  GraduationCap,
  Star,
} from "lucide-react";
import Link from "next/link";
import { SearchBar } from "@/components/home/search-bar";

export default function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-16 pb-24 md:pt-44 md:pb-65">
        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              Trusted by 50+ Universities and Institutions in Cameroon
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight text-foreground md:text-7xl mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 space-y-3 flex-col flex">
              <span>Architecting the</span>
              <span>
                Future of <span className="text-primary">Education</span>
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-900">
              SmartCampus is a refined ecosystem designed for institutions that
              prioritize architectural precision in digital management.
            </p>

            <div className="mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <div className="relative group">
                <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-primary to-secondary opacity-25 blur transition duration-1000 group-hover:opacity-40"></div>
                <SearchBar />
              </div>
            </div>
          </div>
        </div>

        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30 border-y">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: "Active Students", value: "100K+", icon: Users },
              { label: "Partner Schools", value: "500+", icon: School },
              { label: "Programs", value: "2,000+", icon: GraduationCap },
              { label: "Success Rate", value: "98%", icon: Star },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-background shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-lg text-muted-foreground">
              We've built the ultimate toolkit for students and institutions to
              thrive in the digital age.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Discovery",
                description:
                  "Find the perfect school with our AI-powered search and comparison tools.",
                icon: Search,
              },
              {
                title: "One-Click Apply",
                description:
                  "Apply to multiple schools using a single, unified profile. No more repetitive forms.",
                icon: CheckCircle2,
              },
              {
                title: "Campus Management",
                description:
                  "Manage attendance, grades, and payments all in one beautiful dashboard.",
                icon: GraduationCap,
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl border bg-background hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 md:px-16 md:py-24 text-center text-primary-foreground">
            <div className="relative z-10 mx-auto max-w-3xl">
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl mb-6">
                Ready to start your journey?
              </h2>
              <p className="text-xl text-primary-foreground/80 mb-10">
                Join thousands of students who have already found their dream
                school through Smart Campus.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto rounded-full font-bold text-lg px-10 h-14"
                >
                  Get Started Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto rounded-full font-bold text-lg px-10 h-14 border-primary-foreground/20 hover:bg-primary-foreground/10"
                >
                  Contact Sales
                </Button>
              </div>
            </div>

            {/* CTA Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-20%] left-[-10%] w-[50%] h-full bg-white/10 rounded-full blur-[100px] -rotate-45"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-full bg-secondary/20 rounded-full blur-[100px] rotate-45"></div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
