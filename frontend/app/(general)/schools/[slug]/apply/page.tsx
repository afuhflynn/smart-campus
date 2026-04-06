"use client";

import { ArrowLeft, CheckCircle, LogIn, MapPin, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { PublicLayout } from "@/components/layout/public-layout";
import { MultiStepApplication } from "@/components/shared/multi-step-application";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/use-auth-store";
import type { ApplicationField, School } from "@/types/api.types";
import { useApply, useSchool, useUserProfile } from "@/hooks";

function SchoolSidebar({ school }: { school: School }) {
  const [showFullDescription, setShowFullDescription] = useState(false);

  return (
    <aside className="lg:col-span-1 space-y-6">
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-muted">
          {school.banner ? (
            <Image
              src={school.banner ?? "/banner"}
              alt={school.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
          )}
        </div>
        <CardContent className="p-6 -mt-10 relative">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-white border-4 border-white shadow-lg -mt-8 mx-auto mb-4 flex items-center justify-center overflow-hidden">
              {school.logo_url ? (
                <Image
                  src={school.logo_url ?? "/logo"}
                  alt={school.name}
                  width={64}
                  height={64}
                  className="rounded-full"
                />
              ) : (
                <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {school.name?.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="text-center mb-4">
            <h2 className="text-xl font-bold">{school?.name}</h2>
            <Badge variant="secondary" className="mt-2 capitalize">
              {school.school_type}
            </Badge>
          </div>

          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {school.city}, {school.region}
            </span>
          </div>

          {school.description && (
            <div className="mb-4">
              <p
                className={`text-sm text-muted-foreground ${
                  !showFullDescription ? "line-clamp-3" : ""
                }`}
              >
                {school.description}
              </p>
              {school.description.length > 150 && (
                <button
                  type="button"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-xs text-primary hover:underline mt-1"
                >
                  {showFullDescription ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}

          <div className="border-t pt-4">
            <h3 className="font-semibold text-sm mb-3">What to expect</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>
                  Your application will be reviewed within 5 business days
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>
                  You&apos;ll receive an email update on your application status
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                <span>
                  Approved applicants will be contacted for next steps
                </span>
              </li>
            </ul>
          </div>

          <div className="border-t pt-4 mt-4">
            <Link
              href={`/schools/${school.slug}`}
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {school.name}
            </Link>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}

function LoadingSkeleton() {
  return (
    <div className="lg:col-span-1 space-y-6">
      <Card>
        <Skeleton className="aspect-video rounded-none" />
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    </div>
  );
}

function SuccessState({
  schoolName,
  email,
}: {
  schoolName: string;
  email: string;
}) {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <div className="text-center py-12">
      <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Application submitted!</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Thank you for applying to {schoolName}. We&apos;ve received your
        application and will review it shortly. Check your email at{" "}
        <span className="font-medium text-foreground">{email}</span> for
        updates.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button variant="outline" onClick={() => router.push("/schools")}>
          Apply to another school
        </Button>
        <Button onClick={() => router.push(user ? "/student" : "/login")}>
          {user ? "Track my applications" : "Sign in to track applications"}
        </Button>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  const params = useParams();
  const { slug } = params;
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const { data: userProfileData, isPending } = useUserProfile();
  const user = userProfileData?.user;

  const { data, isLoading, error } = useSchool(slug as string);
  const school = data?.school;

  const applyMutation = useApply(school?.id!);

  if (isLoading) {
    return (
      <PublicLayout>
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <LoadingSkeleton />
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-12 w-2/3" />
              <Skeleton className="h-6 w-1/2" />
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (error || !school) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-bold">School not found</h1>
          <p className="text-muted-foreground">
            The school you are looking for does not exist.
          </p>
          <Button asChild>
            <Link href="/schools">Browse Schools</Link>
          </Button>
        </div>
      </PublicLayout>
    );
  }

  const registrationFields = (
    (JSON.parse(
      school.registration_fields as string,
    ) as unknown as ApplicationField[]) || []
  ).map((field) => ({
    name: field.name,
    label: field.label,
    type: field.type as
      | "text"
      | "email"
      | "select"
      | "number"
      | "textarea"
      | "date"
      | "phone"
      | "checkbox",
    required: field.required,
    options: field.options,
    placeholder: field.placeholder,
  }));

  return (
    <PublicLayout>
      <div className="bg-muted/30 min-h-screen">
        <div className="container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <SchoolSidebar school={school} />

            <main className="lg:col-span-2">
              {isSuccess ? (
                <SuccessState schoolName={school.name} email={submittedEmail} />
              ) : (
                <>
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">
                      Apply to {school.name}
                    </h1>
                    <p className="text-muted-foreground">
                      Fill in the form below. All required fields are marked
                      with <span className="text-red-500">*</span>
                    </p>
                  </div>

                  {user ? (
                    <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">
                          Applying as {user.name}
                        </p>
                        <p className="text-sm text-green-600">{user.email}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                      <p className="text-sm text-blue-800">
                        Have an account? Sign in to pre-fill your details and
                        track your application
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          router.push(`/login?redirect=/schools/${slug}/apply`)
                        }
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign in
                      </Button>
                    </div>
                  )}

                  {school.registration_fields ? (
                    <MultiStepApplication
                      schoolSlug={school.slug}
                      schoolName={school.name}
                      registrationFields={registrationFields}
                      user={user!}
                      onSubmit={async (data) => {
                        setSubmittedEmail(data.applicant_email);
                        await applyMutation.mutateAsync(
                          {
                            ...data,
                            applicant_user_id: Number(data.applicant_user_id),
                          },
                          {
                            onSuccess() {
                              setIsSuccess(true);
                            },
                          },
                        );
                      }}
                    />
                  ) : (
                    <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                      <h3>Application form not available</h3>
                      <p className="text-sm text-blue-800">
                        This school&apos;s application form is still under
                        construction. Check again later.
                      </p>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
