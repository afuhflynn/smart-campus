"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  GripVertical,
  Trash2,
  Settings2,
  Eye,
  Save,
  Type,
  Mail,
  Phone,
  Hash,
  Calendar as CalendarIcon,
  ChevronDown,
  Layout,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Field {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

const fieldTypes = [
  { type: "text", label: "Text Input", icon: Type },
  { type: "email", label: "Email Address", icon: Mail },
  { type: "phone", label: "Phone Number", icon: Phone },
  { type: "number", label: "Number", icon: Hash },
  { type: "date", label: "Date Picker", icon: CalendarIcon },
  { type: "select", label: "Dropdown", icon: ChevronDown },
  { type: "textarea", label: "Long Text", icon: Layout },
];

export default function FormBuilderPage() {
  const [fields, setFields] = useState<Field[]>([
    {
      id: "1",
      name: "full_name",
      label: "Full Name",
      type: "text",
      required: true,
    },
    {
      id: "2",
      name: "email",
      label: "Email Address",
      type: "email",
      required: true,
    },
  ]);

  const addField = (type: string) => {
    const newField: Field = {
      id: Math.random().toString(36).substr(2, 9),
      name: `field_${fields.length + 1}`,
      label: `New ${type} field`,
      type,
      required: false,
      options: type === "select" ? ["Option 1", "Option 2"] : undefined,
    };
    setFields([...fields, newField]);
    toast.success("Field added");
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
    toast.error("Field removed");
  };

  const updateField = (id: string, updates: Partial<Field>) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Registration Form Builder
            </h1>
            <p className="text-muted-foreground">
              Customize the application form for your school.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-xl gap-2">
              <Eye className="h-4 w-4" /> Preview
            </Button>
            <Button
              className="rounded-xl font-bold gap-2"
              onClick={() => toast.success("Form saved successfully!")}
            >
              <Save className="h-4 w-4" /> Save Changes
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Toolbox */}
          <aside className="lg:col-span-1 space-y-6">
            <Card className="border-0 shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-muted/50 p-6">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Toolbox
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-2">
                {fieldTypes.map((ft) => (
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
          </aside>

          {/* Canvas */}
          <div className="lg:col-span-3 space-y-4">
            {fields.map((field, index) => (
              <Card
                key={field.id}
                className="border-0 shadow-sm rounded-2xl group hover:ring-2 hover:ring-primary/20 transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="mt-2 cursor-grab active:cursor-grabbing text-muted-foreground/30 hover:text-muted-foreground transition-colors">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          <label className="text-xs font-medium cursor-pointer">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) =>
                                updateField(field.id, {
                                  required: e.target.checked,
                                })
                              }
                              className="mr-2 rounded border-muted"
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
                  </div>

                  {field.type === "select" && (
                    <div className="mt-4 pl-9 space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        Options (comma separated)
                      </label>
                      <Input
                        value={field.options?.join(", ")}
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
                </CardContent>
              </Card>
            ))}

            {fields.length === 0 && (
              <div className="text-center py-20 bg-muted/20 rounded-[2rem] border-2 border-dashed">
                <Layout className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-semibold">Your form is empty</h3>
                <p className="text-muted-foreground">
                  Add fields from the toolbox to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
