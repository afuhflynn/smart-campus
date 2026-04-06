"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Calendar as CalendarIcon,
  Check,
  CheckSquare,
  ChevronDown,
  Eye,
  GripVertical,
  Hash,
  Layout,
  Loader2,
  Mail,
  Phone,
  Plus,
  Save,
  Trash2,
  Type,
  X,
} from "lucide-react";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";
import type { ApplicationField } from "@/types/api.types";
import { useSchool } from "@/hooks";

interface FormBuilderPageProps {
  params: Promise<{ schoolSlug: string }>;
}

interface Field {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

const FIELD_TYPES = [
  { type: "text", label: "Text Input", icon: Type },
  { type: "email", label: "Email Address", icon: Mail },
  { type: "phone", label: "Phone Number", icon: Phone },
  { type: "number", label: "Number", icon: Hash },
  { type: "date", label: "Date Picker", icon: CalendarIcon },
  { type: "select", label: "Dropdown", icon: ChevronDown },
  { type: "textarea", label: "Long Text", icon: Layout },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare },
];

const FIELD_TEMPLATES: {
  name: string;
  description: string;
  fields: Omit<Field, "id">[];
}[] = [
  {
    name: "Basic Application",
    description: "Name, email, and phone",
    fields: [
      { name: "full_name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "phone", required: true },
    ],
  },
  {
    name: "Full Application",
    description: "Complete application with program selection",
    fields: [
      { name: "full_name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "phone", required: true },
      {
        name: "programme",
        label: "Programme of Interest",
        type: "select",
        required: true,
        options: ["Computer Science", "Business", "Engineering", "Arts"],
      },
      {
        name: "intake",
        label: "Preferred Intake",
        type: "select",
        required: true,
        options: ["September 2025", "January 2026"],
      },
      {
        name: "personal_statement",
        label: "Personal Statement",
        type: "textarea",
        required: false,
        placeholder: "Tell us about yourself...",
      },
    ],
  },
];

function fieldToRegistrationField(field: Field): ApplicationField {
  return {
    name: field.name,
    label: field.label,
    type: field.type as ApplicationField["type"],
    required: field.required,
    options: field.options,
    placeholder: field.placeholder,
  };
}

function registrationFieldToField(field: ApplicationField): Field {
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: field.name,
    label: field.label,
    type: field.type,
    required: field.required,
    options: field.options,
    placeholder: field.placeholder,
  };
}

export default function FormBuilderPage({ params }: FormBuilderPageProps) {
  const { schoolSlug } = use(params);
  const queryClient = useQueryClient();
  const [fields, setFields] = useState<Field[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading } = useSchool(schoolSlug);
  const school = data?.school;

  useEffect(() => {
    if (school?.registration_fields) {
      const regFields = JSON.parse(
        school.registration_fields as string,
      ) as unknown as ApplicationField[];
      if (Array.isArray(regFields) && regFields.length > 0) {
        setFields(regFields.map(registrationFieldToField));
      }
    }
  }, [school]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!school) throw new Error("School not loaded");
      const registrationFields = fields.map(fieldToRegistrationField);
      return api.mutations.schools.updateFormFields(
        school.id,
        registrationFields,
      );
    },
    onSuccess: () => {
      toast.success("Form saved successfully!");
      queryClient.invalidateQueries({ queryKey: ["school", schoolSlug] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to save form");
    },
  });

  const addField = (type: string) => {
    const existingNames = fields.map((f) => f.name);
    let baseName = `field_${fields.length + 1}`;
    while (existingNames.includes(baseName)) {
      baseName = `field_${parseInt(baseName.split("_")[1]) + 1}`;
    }

    const newField: Field = {
      id: Math.random().toString(36).substr(2, 9),
      name: baseName,
      label: `New ${type} field`,
      type,
      required: false,
      options: type === "select" ? ["Option 1", "Option 2"] : undefined,
      placeholder: undefined,
    };
    setFields([...fields, newField]);
    toast.success("Field added");
  };

  const addTemplate = (template: (typeof FIELD_TEMPLATES)[number]) => {
    const newFields = template.fields.map((f) => ({
      ...f,
      id: Math.random().toString(36).substr(2, 9),
    }));
    setFields([...fields, ...newFields]);
    toast.success(`Added ${template.name} template`);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    toast.error("Field removed");
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveMutation.mutateAsync();
    } finally {
      setIsSaving(false);
    }
  };

  const renderPreviewField = (field: Field) => {
    if (field.type === "select") {
      return (
        <Select>
          <SelectTrigger>
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
          className="min-h-[80px]"
        />
      );
    }

    if (field.type === "checkbox") {
      return (
        <div className="flex items-center gap-2">
          <Checkbox />
          <span className="text-sm text-muted-foreground">{field.label}</span>
        </div>
      );
    }

    const inputType =
      field.type === "email"
        ? "email"
        : field.type === "phone"
          ? "tel"
          : field.type === "number"
            ? "number"
            : field.type === "date"
              ? "date"
              : "text";

    return (
      <Input
        type={inputType}
        placeholder={field.placeholder || `Enter ${field.label}`}
      />
    );
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Registration Form Builder
            </h1>
            <p className="text-muted-foreground">
              Customize the application form for {school?.name || "your school"}
              .
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="rounded-xl gap-2"
              onClick={() => setIsPreviewOpen(true)}
            >
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <Button
              className="rounded-xl font-bold gap-2"
              onClick={handleSave}
              disabled={isSaving || saveMutation.isPending}
            >
              {isSaving || saveMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/50 p-6">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Field Types
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {FIELD_TYPES.map((ft) => (
                  <Button
                    key={ft.type}
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12 rounded-xl hover:bg-primary/5 hover:text-primary transition-all"
                    onClick={() => addField(ft.type)}
                  >
                    <ft.icon className="h-4 w-4" />
                    <span className="font-medium">{ft.label}</span>
                    <Plus className="h-3 w-3 ml-auto opacity-50" />
                  </Button>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/50 p-6">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Templates
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {FIELD_TEMPLATES.map((template) => (
                  <Button
                    key={template.name}
                    variant="ghost"
                    className="w-full justify-start h-auto py-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-all text-left"
                    onClick={() => addTemplate(template)}
                  >
                    <div>
                      <span className="font-medium block">{template.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {template.description}
                      </span>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </aside>

          <div className="lg:col-span-3 space-y-4">
            {fields.map((field) => (
              <Card
                key={field.id}
                className="border-0 shadow-sm rounded-2xl group hover:ring-2 hover:ring-primary/20 transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-2 cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground transition-colors">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Label
                          </label>
                          <Input
                            value={field.label}
                            onChange={(e) =>
                              updateField(field.id, { label: e.target.value })
                            }
                            className="h-10 rounded-lg border-muted"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Field Name (ID)
                          </label>
                          <Input
                            value={field.name}
                            onChange={(e) =>
                              updateField(field.id, { name: e.target.value })
                            }
                            className="h-10 rounded-lg border-muted"
                          />
                        </div>
                        <div className="flex items-end gap-4">
                          <div className="flex-1 space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                              Type
                            </label>
                            <Badge
                              variant="secondary"
                              className="h-10 w-full rounded-lg flex items-center justify-center gap-2 capitalize"
                            >
                              {field.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <label className="text-xs font-medium cursor-pointer flex items-center gap-2">
                              <Checkbox
                                checked={field.required}
                                onCheckedChange={(checked) =>
                                  updateField(field.id, {
                                    required: checked === true,
                                  })
                                }
                              />
                              Required
                            </label>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-lg"
                              onClick={() => removeField(field.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {field.type === "select" && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Options (comma separated)
                          </label>
                          <Input
                            value={field.options?.join(", ") || ""}
                            onChange={(e) =>
                              updateField(field.id, {
                                options: e.target.value
                                  .split(",")
                                  .map((s) => s.trim()),
                              })
                            }
                            className="h-10 rounded-lg border-muted"
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}

                      {field.type !== "select" && field.type !== "checkbox" && (
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Placeholder (optional)
                          </label>
                          <Input
                            value={field.placeholder || ""}
                            onChange={(e) =>
                              updateField(field.id, {
                                placeholder: e.target.value,
                              })
                            }
                            className="h-10 rounded-lg border-muted"
                            placeholder={`Placeholder for ${field.label}`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-20 bg-muted/20 rounded-[2rem] border-2 border-dashed">
                <Layout className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-semibold">Your form is empty</h3>
                <p className="text-muted-foreground">
                  Add fields from the toolbox or use a template to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="md:min-w-3xl max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Form Preview</DialogTitle>
            <DialogDescription>
              This is how your application form will look to students.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {fields.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No fields configured yet.
              </p>
            ) : (
              fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <label className="text-sm font-medium">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {renderPreviewField(field)}
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
