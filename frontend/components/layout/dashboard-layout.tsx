"use client";

import { useAuthStore } from "@/store/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Topbar } from "./topbar";
import { useUserProfile } from "@/hooks";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useUserProfile();
  const router = useRouter();

  const user = data?.user;

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      router.push("/auth/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-muted/30">
        <AppSidebar user={user} />
        <div className="flex flex-col flex-1">
          <Topbar user={user} />
          <main className="flex-1 p-4 md:p-8">
            <div className="container max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
