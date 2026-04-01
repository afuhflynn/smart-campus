"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Step {
  id: string;
  title: string;
  description: string;
}

const steps: Step[] = [
  {
    id: "personal",
    title: "Personal Info",
    description: "Your basic contact details",
  },
  {
    id: "academic",
    title: "Academic History",
    description: "Your educational background",
  },
  {
    id: "specific",
    title: "School Specific",
    description: "Additional questions from the school",
  },
  { id: "review", title: "Review", description: "Confirm your details" },
];

const personalSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Valid phone number required"),
});

const academicSchema = z.object({
  previousSchool: z.string().min(2, "Previous school is required"),
  gpa: z.string().min(1, "GPA/Grade is required"),
  graduationYear: z.string().min(4, "Year is required"),
});

// We'll dynamically build the specific schema based on school fields
// For simplicity in this mock, we'll use a generic object for the dynamic part

export function MultiStepApplication({
  school,
  registrationFields,
}: {
  school: any;
  registrationFields: any[];
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      previousSchool: "",
      gpa: "",
      graduationYear: "",
      dynamicFields: {},
    },
  });

  const nextStep = async () => {
    const fieldsToValidate =
      currentStep === 0
        ? ["firstName", "lastName", "email", "phone"]
        : currentStep === 1
        ? ["previousSchool", "gpa", "graduationYear"]
        : [];

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);

    toast.success("Application Submitted!", {
      description: `Your application to ${school.name} has been received.`,
    });

    router.push("/schools");
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-12 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Apply to {school.name}
            </h1>
            <p className="text-muted-foreground">
              Step {currentStep + 1} of {steps.length}:{" "}
              {steps[currentStep].title}
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-primary">
              {Math.round(progress)}% Complete
            </p>
          </div>
        </div>
        <Progress value={progress} className="h-2 rounded-full" />

        {/* Step Indicators */}
        <div className="hidden sm:flex justify-between pt-4">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="flex flex-col items-center gap-2 w-1/4"
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  i <= currentStep
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {i < currentStep ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] uppercase font-bold tracking-widest",
                  i === currentStep ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Card className="border-0 shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden">
        <CardContent className="p-8 md:p-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {currentStep === 0 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              {...field}
                              className="h-12 rounded-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              {...field}
                              className="h-12 rounded-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john@example.com"
                            {...field}
                            className="h-12 rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 (555) 000-0000"
                            {...field}
                            className="h-12 rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <FormField
                    control={form.control}
                    name="previousSchool"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous Institution</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="High School Name"
                            {...field}
                            className="h-12 rounded-xl"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="gpa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GPA / Final Grade</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="3.8 / 4.0"
                              {...field}
                              className="h-12 rounded-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="graduationYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Graduation Year</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="2025"
                              {...field}
                              className="h-12 rounded-xl"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {registrationFields.map((field) => (
                    <div key={field.name} className="space-y-2">
                      <label className="text-sm font-medium">
                        {field.label} {field.required && "*"}
                      </label>
                      <Input
                        placeholder={field.label}
                        className="h-12 rounded-xl"
                        onChange={(e) => {
                          const currentDynamic =
                            form.getValues("dynamicFields");
                          form.setValue("dynamicFields", {
                            ...currentDynamic,
                            [field.name]: e.target.value,
                          });
                        }}
                      />
                    </div>
                  ))}
                  {registrationFields.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                      No additional fields required for this school.
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-primary">
                        Personal
                      </h4>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {form.getValues("firstName")}{" "}
                          {form.getValues("lastName")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {form.getValues("email")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {form.getValues("phone")}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-sm uppercase tracking-widest text-primary">
                        Academic
                      </h4>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {form.getValues("previousSchool")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          GPA: {form.getValues("gpa")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Class of {form.getValues("graduationYear")}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
                    <p className="text-sm leading-relaxed">
                      By submitting this application, you agree to our terms and
                      conditions and authorize {school.name} to review your
                      academic records.
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-8 border-t">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="rounded-xl h-12 px-6"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>

                {currentStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    className="rounded-xl h-12 px-10 font-bold text-lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="rounded-xl h-12 px-10 font-bold text-lg"
                  >
                    Next Step <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
