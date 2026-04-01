"use client";

import { useQuery } from "@tanstack/react-query";
import { schoolService } from "@/lib/mocks/school-service";
import { useParams } from "next/navigation";
import { PublicLayout } from "@/components/layout/public-layout";
import { MultiStepApplication } from "@/components/shared/multi-step-application";
import { Loader2 } from "lucide-react";

export default function ApplyPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: school, isLoading } = useQuery({
    queryKey: ["school", slug],
    queryFn: () => schoolService.getSchoolBySlug(slug),
  });

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PublicLayout>
    );
  }

  if (!school) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">School not found</h1>
          <p className="text-muted-foreground">
            The school you are looking for does not exist.
          </p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-muted/30 min-h-screen">
        <MultiStepApplication
          school={school}
          registrationFields={school.registration_fields}
        />
      </div>
    </PublicLayout>
  );
}
