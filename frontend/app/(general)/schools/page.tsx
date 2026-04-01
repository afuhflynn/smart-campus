"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  MapPin,
  GraduationCap,
  Filter,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";
import { useQueryStates, debounce } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { schoolService } from "@/lib/mocks/school-service";
import Link from "next/link";
import Image from "next/image";
import { searchParamsSchema } from "@/nuqs";

export default function SchoolsPage() {
  const [params, setParams] = useQueryStates(searchParamsSchema);

  const { data: schools, isLoading } = useQuery({
    queryKey: ["schools", params.q, location],
    queryFn: async () => {
      const allSchools = await schoolService.getSchools();
      return allSchools.filter((s) => {
        const matchesSearch =
          s.name.toLowerCase().includes(params.q.toLowerCase()) ||
          s.description.toLowerCase().includes(params.q.toLowerCase());
        const matchesLocation = s.location
          .toLowerCase()
          .includes(params?.city?.toLowerCase() as string);
        return matchesSearch && matchesLocation;
      });
    },
  });

  return (
    <PublicLayout>
      <div className="bg-muted/30 border-b">
        <div className="container py-12 md:py-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Discover Schools
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Find the perfect institution for your academic goals. Filter by
            location, program, and more.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64 space-y-8">
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="School name..."
                      className="pl-9"
                      value={params.q}
                      onChange={(e) =>
                        setParams(
                          {
                            ...params,
                            q: e.target.value,
                          },
                          {
                            limitUrlUpdates: debounce(500),
                            shallow: true,
                          }
                        )
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="City or state..."
                      className="pl-9"
                      value={params.city as string}
                      onChange={(e) =>
                        setParams(
                          {
                            ...params,
                            city: e.target.value,
                          },
                          {
                            limitUrlUpdates: debounce(500),
                            shallow: true,
                          }
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <h4 className="font-medium mb-3">Program Type</h4>
              <div className="space-y-2">
                {[
                  "Undergraduate",
                  "Postgraduate",
                  "Online",
                  "Professional",
                ].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors"
                  >
                    <input type="checkbox" className="rounded border-muted" />
                    {type}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Schools List */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {schools?.length || 0}
                </span>{" "}
                schools
              </p>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" /> Sort by: Featured
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-100 rounded-3xl bg-muted animate-pulse"
                  ></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {schools?.map((school) => (
                  <Card
                    key={school.id}
                    className="overflow-hidden rounded-3xl border-0 shadow-sm hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="relative h-48">
                      <Image
                        src={school.banner}
                        alt={school.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-primary hover:bg-white backdrop-blur-sm border-0 px-3 py-1">
                          Featured
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {school.name}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPin className="h-3 w-3" /> {school.location}
                          </div>
                        </div>
                        <div className="h-12 w-12 rounded-xl border bg-white p-1 shrink-0 shadow-sm">
                          <Image
                            src={school.logo}
                            alt={school.name}
                            width={48}
                            height={48}
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {school.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant="secondary" className="font-normal">
                          <GraduationCap className="h-3 w-3 mr-1" />{" "}
                          {school.tuition}
                        </Badge>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Link href={`/schools/${school.slug}`} className="w-full">
                        <Button className="w-full rounded-xl font-bold group-hover:gap-3 transition-all">
                          View Profile <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {!isLoading && schools?.length === 0 && (
              <div className="text-center py-20 bg-muted/20 rounded-4xl border-2 border-dashed">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-semibold">No schools found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters.
                </p>
                <Button
                  variant="link"
                  onClick={() => {
                    setParams({
                      ...params,
                      q: "",
                      city: "",
                    });
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
