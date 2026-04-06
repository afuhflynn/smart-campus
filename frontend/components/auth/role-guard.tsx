"use client";

import { useUserProfile } from "@/hooks";
import { useRedirect } from "@/hooks/use-redirect";
import { useAuthStore } from "@/store/use-auth-store";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { data, isPending } = useUserProfile();
  const router = useRouter();
  const pathname = usePathname();
  const { redirectTo } = useRedirect();

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (!data?.user) {
      router.push(`/login?redirect=${pathname}`);
      return;
    }

    if (allowedRoles && !allowedRoles.includes(data?.user.role!)) {
      toast.error("Access Denied", {
        description: "You do not have permission to access this page.",
      });

      redirectTo(data.user.role!, data.school.slug);
    }
  }, [allowedRoles, router, pathname, redirectTo, data?.user]);

  if (!data?.user) return null;
  if (allowedRoles && !allowedRoles.includes(data.user.role)) return null;

  return <>{children}</>;
}
