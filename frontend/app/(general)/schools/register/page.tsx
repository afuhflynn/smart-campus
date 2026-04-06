"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertCircle,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PublicLayout } from "@/components/layout/public-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type { SchoolTypeEnum } from "@/types/api.types";
import { useUserProfile } from "@/hooks";
import { QueryClient } from "@tanstack/react-query";

const SCHOOL_TYPES_ENUM = [
  "public",
  "private",
  "professional",
  "vocational",
] as const;
const CAMEROON_REGIONS_ENUM = [
  "Adamaoua",
  "Centre",
  "East",
  "Far North",
  "Littoral",
  "North",
  "North West",
  "South",
  "South West",
  "West",
] as const;

const CAMEROON_REGIONS = [
  { value: "Adamaoua", label: "Adamaoua" },
  { value: "Centre", label: "Centre" },
  { value: "East", label: "East" },
  { value: "Far North", label: "Far North" },
  { value: "Littoral", label: "Littoral" },
  { value: "North", label: "North" },
  { value: "North West", label: "North West" },
  { value: "South", label: "South" },
  { value: "South West", label: "South West" },
  { value: "West", label: "West" },
];

const SCHOOL_TYPES: {
  value: (typeof SCHOOL_TYPES_ENUM)[number];
  label: string;
}[] = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "professional", label: "Professional" },
  { value: "vocational", label: "Vocational" },
];

const STEPS = [
  { id: 1, label: "Basic Info" },
  { id: 2, label: "Location" },
  { id: 3, label: "Accreditation" },
  { id: 4, label: "Admin Account" },
];

const fullSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters"),
  abbreviation: z
    .string()
    .max(100, "Abbreviation must not exceed 100 characters")
    .optional()
    .default(""),
  school_type: z.enum(SCHOOL_TYPES_ENUM),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters")
    .optional()
    .default(""),
  logo_url: z.string().optional().default(""),
  banner_url: z.string().optional().default(""),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  region: z.enum(CAMEROON_REGIONS_ENUM),
  country: z.string().default("Cameroon"),
  phone: z.string().min(1, "Phone is required"),
  email: z.email("Invalid email address"),
  website: z.string().optional().default(""),
  authorization_number: z
    .string()
    .min(5, "Authorization number must be at least 5 characters"),
  issuing_authority: z.string().min(1, "Issuing authority is required"),
  authorization_date: z.date(),
});

type FormValues = z.infer<typeof fullSchema>;

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

function ImagePreview({ url, alt }: { url: string; alt: string }) {
  const [error, setError] = useState(false);

  if (!url || error) return null;

  return (
    <div className="mt-2 relative h-20 w-20 rounded-lg overflow-hidden border">
      <img
        src={url}
        alt={alt}
        className="object-cover h-full w-full"
        onError={() => setError(true)}
      />
    </div>
  );
}

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                currentStep > step.id
                  ? "bg-primary text-primary-foreground"
                  : currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground border border-input",
              )}
            >
              {currentStep > step.id ? <Check className="h-5 w-5" /> : step.id}
            </div>
            <span
              className={cn(
                "text-xs mt-2 font-medium",
                currentStep >= step.id
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
      <Progress value={(currentStep / STEPS.length) * 100} className="h-2" />
    </div>
  );
}

function Step1Content({
  control,
  watch,
  errors,
}: {
  control: any;
  watch: any;
  errors: any;
}) {
  const name = watch("name");
  const slug = name ? generateSlug(name) : "";

  return (
    <div className="space-y-6">
      <div>
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution Name *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Higher Institute of Technology and Business"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              {slug && (
                <p className="text-sm text-muted-foreground mt-1">
                  Your profile URL: smartcampus.cm/schools/{slug}
                </p>
              )}
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="abbreviation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abbreviation</FormLabel>
              <FormControl>
                <Input placeholder="e.g. HITB" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="school_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Type *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {SCHOOL_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Briefly describe your institution, programmes offered, and what makes it unique"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <div className="flex justify-between">
              <FormMessage />
              <span className="text-xs text-muted-foreground">
                {field.value?.length || 0}/500
              </span>
            </div>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="logo_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Logo URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
              <ImagePreview url={field.value} alt="Logo preview" />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="banner_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Banner URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
              <ImagePreview url={field.value} alt="Banner preview" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

function Step2Content({ control, errors }: { control: any; errors: any }) {
  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address *</FormLabel>
            <FormControl>
              <Input
                placeholder="Street address or campus location"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City *</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Yaoundé" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="region"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Region *</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CAMEROON_REGIONS.map((region) => (
                    <SelectItem key={region.value} value={region.value}>
                      {region.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
            <FormControl>
              <Input {...field} disabled />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone *</FormLabel>
              <FormControl>
                <Input placeholder="+237 6XX XXX XXX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="admin@yourinstitution.cm"
                  {...field}
                />
              </FormControl>
              <p className="text-xs text-muted-foreground">
                This will be your login email
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input
                placeholder="https://www.yourinstitution.cm"
                {...field}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function Step3Content({ control, errors }: { control: any; errors: any }) {
  return (
    <div className="space-y-6">
      <Alert className="bg-blue-50 border-blue-200">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          Your accreditation details are verified by our team before your school
          goes live. This typically takes 1-2 business days.
        </AlertDescription>
      </Alert>

      <FormField
        control={control}
        name="authorization_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Authorization Number *</FormLabel>
            <FormControl>
              <Input placeholder="e.g. MINESUP/2019/0234" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="issuing_authority"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Issuing Authority *</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g. Ministry of Higher Education (MINESUP)"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="authorization_date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Authorization Date *</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP", { locale: fr })
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                  disabled={(date) => date > new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function Step4Content({
  control,
  watch,
  errors,
}: {
  control: any;
  watch: any;
  errors: any;
}) {
  const formValues = watch();

  return (
    <div className="space-y-6">
      <Card className="bg-muted/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Review your submission</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Institution:</span>
            <p className="font-medium">{formValues.name || "-"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Type:</span>
            <p className="font-medium capitalize">
              {formValues.school_type || "-"}
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">City:</span>
            <p className="font-medium">{formValues.city || "-"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Region:</span>
            <p className="font-medium">{formValues.region || "-"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Email:</span>
            <p className="font-medium">{formValues.email || "-"}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Authorization #:</span>
            <p className="font-medium">
              {formValues.authorization_number || "-"}
            </p>
          </div>
        </CardContent>
      </Card>

      <FormField
        control={control}
        name="confirmation"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I confirm that all information provided is accurate and I am
                authorized to register this institution on Smart Campus
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />
    </div>
  );
}

function SuccessState({ email }: { email: string }) {
  const router = useRouter();

  return (
    <Card className="max-w-2xl mx-auto text-center py-12 px-6">
      <div className="flex flex-col items-center space-y-6">
        <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">
            Registration submitted successfully
          </h2>
          <p className="text-muted-foreground max-w-md">
            We&apos;ve received your application. Our team will verify your
            accreditation details within 1-2 business days. You&apos;ll receive
            a confirmation email at {email} once your school is approved and
            live on the platform.
          </p>
        </div>
        <Button onClick={() => router.push("/schools")} className="mt-4">
          Browse Schools
        </Button>
      </div>
    </Card>
  );
}

export default function SchoolRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const router = useRouter();
  const queryClient = new QueryClient();

  const form = useForm({
    resolver: zodResolver(fullSchema) as any,
    defaultValues: {
      name: "",
      abbreviation: "",
      school_type: undefined,
      description: "",
      logo_url: "",
      banner_url: "",
      address: "",
      city: "",
      region: undefined,
      country: "Cameroon",
      phone: "",
      email: "",
      website: "",
      authorization_number: "",
      issuing_authority: "",
      authorization_date: undefined,
      confirmation: false,
    },
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = form;
  const formValues = watch();

  const stepFields: Record<number, (keyof FormValues)[]> = {
    1: [
      "name",
      "abbreviation",
      "school_type",
      "description",
      "logo_url",
      "banner_url",
    ],
    2: ["address", "city", "region", "country", "phone", "email", "website"],
    3: ["authorization_number", "issuing_authority", "authorization_date"],
  };

  const validateStep = async (step: number) => {
    const fields = stepFields[step];
    const isValid = await trigger(fields);
    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const slug = generateSlug(data.name);

    const payload = {
      name: data.name,
      slug,
      abbreviation: data.abbreviation,
      school_type: data.school_type,
      description: data.description || undefined,
      logo_url: data.logo_url || undefined,
      banner_url: data.banner_url || undefined,
      address: data.address,
      city: data.city,
      region: data.region,
      country: data.country,
      phone: data.phone,
      email: data.email,
      website: data.website || undefined,
      authorization_number: data.authorization_number,
      issuing_authority: data.issuing_authority,
      authorization_date: data.authorization_date!.toISOString(),
    };

    try {
      const slugCheck = await api.mutations.schools.checkSlug(slug);
      if (!slugCheck.available) {
        setSubmitError(
          `The URL slug "${slug}" is already taken. Please change your institution name.`,
        );
        setIsSubmitting(false);
        return;
      }
      const result = await api.mutations.schools.register(payload);
      setSubmittedEmail(data.email);
      setIsSuccess(true);
      if (result.school) {
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: ["user-profile"],
          });
          router.push(`/school/${result.school.slug}`);
        }, 3000);
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <PublicLayout>
        <div className="container py-12">
          <SuccessState email={submittedEmail} />
        </div>
      </PublicLayout>
    );
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return {
          title: "Tell us about your institution",
          subtitle:
            "This information will appear on your public school profile",
        };
      case 2:
        return {
          title: "Where are you located?",
          subtitle: "Help students find you",
        };
      case 3:
        return {
          title: "Government authorization",
          subtitle: "All institutions must provide valid accreditation details",
        };
      case 4:
        return {
          title: "Create your admin account",
          subtitle: "This account will manage your school on Smart Campus",
        };
      default:
        return { title: "", subtitle: "" };
    }
  };

  const stepInfo = getStepTitle(currentStep);

  return (
    <PublicLayout>
      <div className="bg-muted/30 border-b">
        <div className="container py-12 md:py-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Register Your Institution
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Join Smart Campus and reach thousands of prospective students.
            Complete the registration below to get started.
          </p>
        </div>
      </div>

      <div className="container py-12">
        <div className="max-w-2xl mx-auto">
          <StepIndicator currentStep={currentStep} />

          <Card>
            <CardHeader>
              <CardTitle>{stepInfo.title}</CardTitle>
              <CardDescription>{stepInfo.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              {submitError && (
                <Alert className="mb-6 bg-red-50 border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    {submitError}
                  </AlertDescription>
                </Alert>
              )}

              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit as any)}>
                  {currentStep === 1 && (
                    <Step1Content
                      control={control}
                      watch={watch}
                      errors={errors}
                    />
                  )}
                  {currentStep === 2 && (
                    <Step2Content control={control} errors={errors} />
                  )}
                  {currentStep === 3 && (
                    <Step3Content control={control} errors={errors} />
                  )}
                  {currentStep === 4 && (
                    <Step4Content
                      control={control}
                      watch={watch}
                      errors={errors}
                    />
                  )}
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              {currentStep < 4 ? (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit(onSubmit as any)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    "Register Institution"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </PublicLayout>
  );
}
