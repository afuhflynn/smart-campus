"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GraduationCap, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { authService } from "@/lib/mocks/auth-service";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const { user, token } = await authService.login(values.email);
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name}!`);

      // Redirect based on role
      const roleRedirects: Record<string, string> = {
        student: "/student",
        lecturer: "/lecturer",
        school_admin: "/school",
        platform_admin: "/admin",
        finance: "/finance",
        librarian: "/library",
      };

      router.push(roleRedirects[user.role] || "/");
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              Smart<span className="text-primary">Campus</span>
            </span>
          </Link>
        </div>

        <Card className="rounded-[2rem] border-0 shadow-2xl shadow-primary/5">
          <CardHeader className="space-y-1 pt-8 px-8">
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription>
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="name@example.com"
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Password</FormLabel>
                        <Link
                          href="/auth/forgot"
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          className="h-12 rounded-xl"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl font-bold text-lg mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    "Log in"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  href="/schools"
                  className="text-primary font-semibold hover:underline"
                >
                  Find a school to apply
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/*<div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">
            Demo Credentials
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {["student", "lecturer", "admin", "finance", "librarian"].map(
              (role) => (
                <Badge
                  key={role}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/5 transition-colors"
                  onClick={() => form.setValue("email", `${role}@example.com`)}
                >
                  {role}@example.com
                </Badge>
              ),
            )}
          </div>
        </div>*/}
      </div>
    </div>
  );
}
