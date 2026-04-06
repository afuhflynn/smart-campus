"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CheckSquare,
  FileText,
  Loader2,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { ApplicationField, User as UserType } from "@/types/api.types";
import { useRouter } from "next/navigation";

interface Step {
  id: string;
  title: string;
  description: string;
}

interface MultiStepApplicationProps {
  schoolSlug: string;
  schoolName: string;
  registrationFields: ApplicationField[];
  user: UserType | null;
  onSubmit: (data: {
    applicant_user_id: number | null;
    applicant_email: string;
    applicant_name: string;
    payload: Record<string, unknown>;
  }) => Promise<void>;
}

const DEFAULT_PERSONAL_FIELDS: ApplicationField[] = [
  { name: "full_name", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Email Address", type: "email", required: true },
  { name: "phone", label: "Phone Number", type: "phone", required: true },
];

function buildSchemaFromFields(
  fields: ApplicationField[],
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    if (field.type === "email") {
      fieldSchema = z.string().email("Invalid email address");
    } else if (field.type === "number") {
      fieldSchema = z.string();
    } else if (field.type === "checkbox") {
      fieldSchema = z.boolean();
    } else {
      fieldSchema = z.string();
    }

    if (field.required) {
      if (field.type === "checkbox") {
        fieldSchema = (fieldSchema as z.ZodBoolean).refine(
          (val: boolean) => val === true,
          {
            message: `${field.label} is required`,
          },
        );
      } else {
        fieldSchema = (fieldSchema as z.ZodString).min(
          1,
          `${field.label} is required`,
        );
      }
    } else {
      fieldSchema = fieldSchema.optional();
    }

    shape[field.name] = fieldSchema;
  });

  return z.object(shape);
}

function categorizeFields(fields: ApplicationField[]) {
  const nameFields = [
    "full_name",
    "first_name",
    "last_name",
    "name",
    "fullname",
  ];
  const emailFields = ["email", "email_address"];
  const phoneFields = ["phone", "telephone", "mobile", "contact"];

  const personalFields: ApplicationField[] = [];
  const otherFields: ApplicationField[] = [];

  fields.forEach((field) => {
    const lowerName = field.name.toLowerCase();

    if (
      nameFields.some((nf) => lowerName.includes(nf)) ||
      emailFields.some((ef) => lowerName.includes(ef)) ||
      phoneFields.some((pf) => lowerName.includes(pf))
    ) {
      personalFields.push(field);
    } else {
      otherFields.push(field);
    }
  });

  return { personalFields, otherFields };
}

function getDefaultValues(
  fields: ApplicationField[],
  user: UserType | null,
): Record<string, string | boolean> {
  const defaults: Record<string, string | boolean> = {};

  fields.forEach((field) => {
    if (!user) return;

    const lowerName = field.name.toLowerCase();

    if (lowerName.includes("email")) {
      defaults[field.name] = user.email || "";
    } else if (
      lowerName.includes("name") ||
      lowerName.includes("full") ||
      lowerName.includes("first") ||
      lowerName.includes("last")
    ) {
      defaults[field.name] = user.name || "";
    } else if (lowerName.includes("phone")) {
      defaults[field.name] = user.phone || "";
    }
  });

  return defaults;
}

function renderField(field: ApplicationField, control: any, watch: any) {
  const fieldValue = watch(field.name);

  if (field.type === "select") {
    return (
      <Select
        onValueChange={(value) => control?.onChange(value)}
        value={fieldValue || ""}
      >
        <SelectTrigger className="h-12 rounded-xl">
          <SelectValue placeholder={`Select ${field.label}`} />
        </SelectTrigger>
        <SelectContent>
          {field.options?.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  if (field.type === "textarea") {
    return (
      <Textarea
        placeholder={field.placeholder || `Enter ${field.label}`}
        className="min-h-[120px] rounded-xl"
        {...control}
      />
    );
  }

  if (field.type === "checkbox") {
    return (
      <div className="flex items-center gap-3">
        <Checkbox
          checked={fieldValue || false}
          onCheckedChange={(checked) => control?.onChange(checked === true)}
        />
        <span className="text-sm text-muted-foreground">
          {field.placeholder ||
            `Yes, I agree to provide ${field.label.toLowerCase()}`}
        </span>
      </div>
    );
  }

  if (field.type === "date") {
    return (
      <Input
        type="date"
        placeholder={field.placeholder || `Select ${field.label}`}
        className="h-12 rounded-xl"
        {...control}
      />
    );
  }

  const inputType =
    field.type === "email"
      ? "email"
      : field.type === "phone"
        ? "tel"
        : field.type === "number"
          ? "number"
          : "text";

  return (
    <Input
      type={inputType}
      placeholder={field.placeholder || `Enter ${field.label}`}
      className="h-12 rounded-xl"
      {...control}
    />
  );
}

export function MultiStepApplication({
  schoolSlug,
  schoolName,
  registrationFields,
  user,
  onSubmit,
}: MultiStepApplicationProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!registrationFields) return router.push(`/schools/${schoolSlug}`);
  }, [registrationFields]);

  const { personalFields, otherFields } = useMemo(() => {
    if (registrationFields.length === 0) {
      return {
        personalFields: DEFAULT_PERSONAL_FIELDS,
        otherFields: [],
      };
    }
    return categorizeFields(registrationFields);
  }, [registrationFields]);

  const schema = useMemo(
    () => buildSchemaFromFields([...personalFields, ...otherFields]),
    [personalFields, otherFields],
  );

  const defaultValues = useMemo(
    () => getDefaultValues([...personalFields, ...otherFields], user),
    [personalFields, otherFields, user],
  );

  const form = useForm({
    resolver: zodResolver(schema) as any,
    defaultValues,
    mode: "onChange",
  });

  const { control, handleSubmit, trigger, watch, getValues, reset } = form;
  const formValues = watch();

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const steps: Step[] = [
    {
      id: "personal",
      title: "Personal Info",
      description: "Your basic contact details",
    },
    ...(otherFields.length > 0
      ? [
          {
            id: "additional",
            title: "Additional Info",
            description: "More details for your application",
          },
        ]
      : []),
    { id: "review", title: "Review", description: "Confirm your details" },
  ];

  const getStepFields = (stepIndex: number): string[] => {
    if (stepIndex === 0) {
      return personalFields.map((f) => f.name);
    }
    if (stepIndex === 1 && otherFields.length > 0) {
      return otherFields.map((f) => f.name);
    }
    return [];
  };

  const nextStep = async () => {
    const fieldsToValidate = getStepFields(currentStep);
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFormSubmit = async (data: Record<string, unknown>) => {
    setIsSubmitting(true);
    setSubmitError(null);

    const emailField = [...personalFields, ...otherFields].find((f) =>
      f.name.toLowerCase().includes("email"),
    );
    const nameField = [...personalFields, ...otherFields].find(
      (f) =>
        f.name.toLowerCase().includes("name") ||
        f.name.toLowerCase().includes("full"),
    );

    const payload: Record<string, unknown> = {};
    [...personalFields, ...otherFields].forEach((field) => {
      if (field.type === "checkbox") {
        payload[field.name] = data[field.name] === true;
      } else {
        payload[field.name] = data[field.name] || "";
      }
    });

    try {
      await onSubmit({
        applicant_user_id: user?.id || null,
        applicant_email:
          (data[emailField?.name || "email"] as string) || user?.email || "",
        applicant_name:
          (data[nameField?.name || "full_name"] as string) || user?.name || "",
        payload,
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    if (currentStep === 0) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {personalFields.map((field) => (
            <FormField
              key={field.name}
              control={control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    {renderField(
                      field,
                      { onChange: formField.onChange, value: formField.value },
                      watch,
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      );
    }

    if (currentStep === 1 && otherFields.length > 0) {
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {otherFields.map((field) => (
            <FormField
              key={field.name}
              control={control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem
                  className={field.type === "textarea" ? "md:col-span-2" : ""}
                >
                  <FormLabel>
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </FormLabel>
                  <FormControl>
                    {renderField(
                      field,
                      { onChange: formField.onChange, value: formField.value },
                      watch,
                    )}
                  </FormControl>
                  {field.placeholder &&
                    !field.type.includes("select") &&
                    !field.type.includes("checkbox") && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {field.placeholder}
                      </p>
                    )}
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
      );
    }

    if (currentStep === steps.length - 1) {
      const allFields = [...personalFields, ...otherFields];
      return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allFields.map((field) => {
              const value = formValues[field.name];
              if (field.type === "checkbox") {
                return (
                  <div key={field.name} className="flex items-center gap-2">
                    {value ? (
                      <CheckSquare className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="h-5 w-5 border rounded" />
                    )}
                    <span className="text-sm">{field.label}</span>
                  </div>
                );
              }
              return (
                <div key={field.name}>
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {field.label}
                  </p>
                  <p className="text-sm font-medium">{value || "-"}</p>
                </div>
              );
            })}
          </div>

          <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-sm leading-relaxed">
              By submitting this application, you agree to our terms and
              conditions and authorize{" "}
              <span className="font-bold">{schoolName}</span> to review your
              information.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Apply to {schoolName}
            </h2>
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

        <div className="hidden sm:flex justify-between pt-4">
          {steps.map((step, i) => (
            <div
              key={step.id}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                  i <= currentStep
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "bg-muted text-muted-foreground",
                )}
              >
                {i < currentStep ? <CheckCircle2 className="h-5 w-5" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-[10px] uppercase font-bold tracking-widest",
                  i === currentStep ? "text-primary" : "text-muted-foreground",
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
          {submitError && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800">
              {submitError}
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={handleSubmit(handleFormSubmit as any)}
              className="space-y-8"
            >
              {renderStepContent()}

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
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Submitting...
                      </>
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
