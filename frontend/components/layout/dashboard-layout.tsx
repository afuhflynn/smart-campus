"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Topbar } from "./topbar";
import { useUserProfile } from "@/hooks";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data, isPending } = useUserProfile();

  const user = data?.user;

  if (!user && isPending) return null;

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-muted/30 overflow-hidden">
        <AppSidebar user={user!} />
        <div className="flex flex-col flex-1 overflow-auto">
          <Topbar user={user!} schoolSlug={data?.school.slug} />
          <main className="flex-1 p-4 md:p-8">
            <div className="container max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
