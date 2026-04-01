"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, token } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!token || !user) {
      router.push(`/auth/login?redirect=${pathname}`);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      toast.error("Access Denied", {
        description: "You do not have permission to access this page.",
      });

      // Redirect to their respective dashboard
      const roleRedirects: Record<string, string> = {
        student: "/student",
        lecturer: "/lecturer",
        school_admin: "/school",
        platform_admin: "/admin",
        finance: "/finance",
        librarian: "/library",
      };

      router.push(roleRedirects[user.role] || "/");
    }
  }, [user, token, allowedRoles, router, pathname]);

  if (!token || !user) return null;
  if (allowedRoles && !allowedRoles.includes(user.role)) return null;

  return <>{children}</>;
}
