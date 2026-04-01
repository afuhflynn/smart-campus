"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Field {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
}

interface DynamicFormProps {
  fields: Field[];
  onSubmit: (data: any) => void;
  submitLabel?: string;
}

export function DynamicForm({
  fields,
  onSubmit,
  submitLabel = "Submit",
}: DynamicFormProps) {
  // Build Zod schema dynamically
  const schemaShape: any = {};
  fields.forEach((field) => {
    let fieldSchema = z.string();
    if (field.type === "email")
      fieldSchema = fieldSchema.email("Invalid email address");
    if (field.required) {
      fieldSchema = fieldSchema.min(1, `${field.label} is required`);
    } else {
      fieldSchema = fieldSchema.optional();
    }
    schemaShape[field.name] = fieldSchema;
  });

  const schema = z.object(schemaShape);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: fields.reduce((acc: any, field) => {
      acc[field.name] = "";
      return acc;
    }, {}),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <FormField
              key={field.id}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem
                  className={field.type === "textarea" ? "md:col-span-2" : ""}
                >
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    {field.type === "select" ? (
                      <Select
                        onValueChange={formField.onChange}
                        defaultValue={formField.value}
                      >
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
                    ) : field.type === "textarea" ? (
                      <Textarea
                        {...formField}
                        placeholder={`Enter ${field.label}`}
                      />
                    ) : (
                      <Input
                        type={field.type === "phone" ? "tel" : field.type}
                        {...formField}
                        placeholder={`Enter ${field.label}`}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>
        <Button
          type="submit"
          className="w-full rounded-xl h-12 font-bold text-lg"
        >
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
}
