"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  TrendingUp,
  School,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { RoleGuard } from "@/components/auth/role-guard";

export default function SchoolAdminDashboard() {
  return (
    <RoleGuard allowedRoles={["school_admin"]}>
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                School Administration
              </h1>
              <p className="text-muted-foreground">
                Manage your institution, applications, and students.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl">
                Download Reports
              </Button>
              <Button className="rounded-xl font-bold">Add New Student</Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total Students",
                value: "1,240",
                icon: Users,
                color: "text-primary",
                bg: "bg-primary/10",
                trend: "+12%",
              },
              {
                label: "Pending Apps",
                value: "48",
                icon: FileText,
                color: "text-orange-600",
                bg: "bg-orange-100",
                trend: "+5",
              },
              {
                label: "Revenue (MTD)",
                value: "$125K",
                icon: TrendingUp,
                color: "text-green-600",
                bg: "bg-green-100",
                trend: "+18%",
              },
              {
                label: "Active Courses",
                value: "86",
                icon: School,
                color: "text-blue-600",
                bg: "bg-blue-100",
                trend: "0%",
              },
            ].map((stat, i) => (
              <Card
                key={i}
                className="border-0 shadow-sm rounded-3xl overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}
                    >
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-green-50 text-green-700 border-0 font-bold"
                    >
                      {stat.trend}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Applications */}
            <Card className="lg:col-span-2 border-0 shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  Recent Applications
                </CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search applicants..."
                    className="h-9 pl-9 rounded-xl bg-muted/50 border-0"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  {[
                    {
                      name: "Alice Cooper",
                      program: "Computer Science",
                      date: "Jan 15, 2026",
                      status: "pending",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
                    },
                    {
                      name: "Bob Wilson",
                      program: "Data Science",
                      date: "Jan 14, 2026",
                      status: "approved",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
                    },
                    {
                      name: "Charlie Brown",
                      program: "AI",
                      date: "Jan 14, 2026",
                      status: "pending",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie",
                    },
                    {
                      name: "Diana Prince",
                      program: "Cybersecurity",
                      date: "Jan 13, 2026",
                      status: "rejected",
                      avatar:
                        "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana",
                    },
                  ].map((app, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 rounded-xl">
                          <AvatarImage src={app.avatar} />
                          <AvatarFallback>{app.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-sm">{app.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {app.program} • {app.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          className={cn(
                            "rounded-lg font-bold capitalize",
                            app.status === "pending"
                              ? "bg-orange-100 text-orange-700"
                              : app.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {app.status}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="link"
                  className="w-full mt-6 text-primary font-bold"
                >
                  View All Applications
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-8">
              <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden bg-primary text-primary-foreground">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4">Registration Form</h3>
                  <p className="text-primary-foreground/80 text-sm mb-6">
                    Customize the fields applicants need to fill when applying
                    to your school.
                  </p>
                  <Link href="/school/form-builder">
                    <Button
                      variant="secondary"
                      className="w-full rounded-xl font-bold h-12"
                    >
                      Open Form Builder
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-xl font-bold">
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {[
                    {
                      label: "Database",
                      status: "Operational",
                      icon: CheckCircle2,
                      color: "text-green-500",
                    },
                    {
                      label: "Email Server",
                      status: "Operational",
                      icon: CheckCircle2,
                      color: "text-green-500",
                    },
                    {
                      label: "File Storage",
                      status: "Operational",
                      icon: CheckCircle2,
                      color: "text-green-500",
                    },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">
                          {item.status}
                        </span>
                        <item.icon className={cn("h-4 w-4", item.color)} />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}
