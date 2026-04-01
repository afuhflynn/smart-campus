"use client";

import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  GraduationCap,
  Users,
  School,
  Library,
  ClipboardCheck,
  BarChart3,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { User, useAuthStore } from "@/store/use-auth-store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  user: User;
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getNavItems = () => {
    const common = [
      {
        title: "Dashboard",
        icon: LayoutDashboard,
        url: `/${user.role.replace("_", "")}`,
      },
      { title: "Notifications", icon: Bell, url: "/notifications" },
    ];

    const roleSpecific: Record<string, any[]> = {
      student: [
        { title: "My Courses", icon: BookOpen, url: "/student/courses" },
        {
          title: "Attendance",
          icon: ClipboardCheck,
          url: "/student/attendance",
        },
        { title: "Grades", icon: BarChart3, url: "/student/grades" },
        { title: "Invoices", icon: CreditCard, url: "/student/invoices" },
      ],
      lecturer: [
        { title: "My Courses", icon: BookOpen, url: "/lecturer/courses" },
        {
          title: "Attendance",
          icon: ClipboardCheck,
          url: "/lecturer/attendance",
        },
        { title: "Grading", icon: FileText, url: "/lecturer/grading" },
      ],
      school_admin: [
        { title: "Applications", icon: FileText, url: "/school/applications" },
        { title: "Students", icon: Users, url: "/school/students" },
        { title: "Form Builder", icon: Settings, url: "/school/form-builder" },
      ],
      finance: [
        { title: "Invoices", icon: CreditCard, url: "/finance/invoices" },
        { title: "Payments", icon: BarChart3, url: "/finance/payments" },
      ],
      librarian: [
        { title: "Catalog", icon: Library, url: "/library/catalog" },
        { title: "Loans", icon: BookOpen, url: "/library/loans" },
      ],
    };

    return [...common, ...(roleSpecific[user.role] || [])];
  };

  const navItems = getNavItems();

  return (
    <Sidebar collapsible="icon" className="border-r bg-background">
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
                    className={cn(
                      "h-11 rounded-xl transition-all",
                      pathname === item.url
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-muted-foreground hover:bg-accent"
                    )}
                  >
                    <Link href={item.url}>
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
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              className="h-11 rounded-xl text-muted-foreground hover:bg-accent"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="h-11 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
