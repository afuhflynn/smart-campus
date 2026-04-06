"use client";

import {
  LayoutDashboard,
  BookOpen,
  FileText,
  CreditCard,
  Settings,
  GraduationCap,
  Users,
  Library,
  ClipboardCheck,
  BarChart3,
  ChartBarBig,
  Bell,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { User } from "@/types/api.types";
import { useApplication } from "@/hooks";

interface AppSidebarProps {
  user: User;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const params = useParams();
  const { schoolSlug } = params;
  const { data } = useApplication();

  const getNavItems = () => {
    const common = [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: schoolSlug
          ? `/school/${schoolSlug}`
          : user.role === "student"
            ? "/student"
            : "/admin",
      },
      {
        title: "Notifications",
        icon: Bell,
        url: "/notifications",
        disabled: true,
      },
    ];

    const roleSpecific: Record<string, any[]> = {
      student: [
        {
          title: "My Courses",
          icon: BookOpen,
          url: "/student/courses",
          disabled: data?.application.status !== "approved",
        },
        {
          title: "Attendance",
          icon: ClipboardCheck,
          url: "/student/attendance",
          disabled: data?.application.status !== "approved",
        },
        {
          title: "Grades",
          icon: BarChart3,
          url: "/student/grades",
          disabled: data?.application.status !== "approved",
        },
        {
          title: "Invoices",
          icon: CreditCard,
          url: "/student/invoices",
          disabled: data?.application.status !== "approved",
        },
        {
          title: "My Application",
          icon: ChartBarBig,
          url: "/student/my-application",
        },
      ],
      lecturer: [
        {
          title: "My Courses",
          icon: BookOpen,
          url: "/lecturer/courses",
        },
        {
          title: "Attendance",
          icon: ClipboardCheck,
          url: "/lecturer/attendance",
        },
        { title: "Grading", icon: FileText, url: "/lecturer/grading" },
      ],
      school_admin: [
        {
          title: "Students",
          icon: Users,
          url: `/school/${schoolSlug}/students`,
        },
        {
          title: "Form Builder",
          icon: Settings,
          url: `/school/${schoolSlug}/form-builder`,
        },
      ],
      finance: [
        {
          title: "Invoices",
          icon: CreditCard,
          url: `/school/${schoolSlug}/finance/invoices`,
        },
        {
          title: "Payments",
          icon: BarChart3,
          url: `/school/${schoolSlug}/finance/payments`,
        },
      ],
      librarian: [
        {
          title: "Catalog",
          icon: Library,
          url: `/school/${schoolSlug}/library/catalog`,
        },
        {
          title: "Loans",
          icon: BookOpen,
          url: `/school/${schoolSlug}/library/loans`,
        },
      ],
    };

    return [...common, ...(roleSpecific[user.role] || [])];
  };

  const navItems = getNavItems();

  return (
    <Sidebar collapsible="icon" className="border-r bg-background h-full">
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight truncate group-data-[collapsible=icon]:hidden">
            Smart<span className="text-primary">Campus</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                    disabled={item.disabled}
                    className={cn(
                      "h-11 rounded-xl transition-all",
                      pathname === item.url
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-accent",
                      item.disabled ? "opacity-60" : "opacity-100",
                    )}
                  >
                    <Link href={item.disabled ? "#" : item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
