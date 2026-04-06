"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  ClipboardCheck,
  FileText,
  Plus,
  ArrowRight,
  QrCode,
  MoreVertical,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { RoleGuard } from "@/components/auth/role-guard";

export default function LecturerDashboard() {
  return (
    <RoleGuard allowedRoles={["lecturer"]}>
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Lecturer Portal
              </h1>
              <p className="text-muted-foreground">
                Manage your courses, attendance, and student grades.
              </p>
            </div>
            <Button className="rounded-xl font-bold h-12 px-6">
              <Plus className="h-5 w-5 mr-2" /> New Session
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Active Courses",
                value: "4",
                icon: BookOpen,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                label: "Total Students",
                value: "156",
                icon: Users,
                color: "text-blue-600",
                bg: "bg-blue-100",
              },
              {
                label: "Pending Grades",
                value: "24",
                icon: FileText,
                color: "text-orange-600",
                bg: "bg-orange-100",
              },
            ].map((stat, i) => (
              <Card
                key={i}
                className="border-0 shadow-sm rounded-3xl overflow-hidden"
              >
                <CardContent className="p-6 flex items-center gap-4">
                  <div
                    className={`h-12 w-12 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon className="h-6 w-6" />
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
            {/* My Courses */}
            <Card className="lg:col-span-2 border-0 shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold">My Courses</CardTitle>
                <Button variant="ghost" size="sm" className="rounded-full">
                  View All
                </Button>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      name: "Advanced Algorithms",
                      code: "CS401",
                      students: 42,
                      time: "Mon, Wed 10:00 AM",
                    },
                    {
                      name: "Database Systems",
                      code: "CS302",
                      students: 38,
                      time: "Tue, Thu 02:00 PM",
                    },
                    {
                      name: "Machine Learning",
                      code: "CS405",
                      students: 45,
                      time: "Fri 09:00 AM",
                    },
                    {
                      name: "Software Engineering",
                      code: "CS305",
                      students: 31,
                      time: "Wed 01:00 PM",
                    },
                  ].map((course, i) => (
                    <Card
                      key={i}
                      className="border bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group rounded-2xl"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <Badge
                            variant="outline"
                            className="rounded-lg font-bold"
                          >
                            {course.code}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                        <h4 className="font-bold text-lg mb-1 group-hover:text-primary transition-colors">
                          {course.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mb-4">
                          {course.time}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" /> {course.students}{" "}
                            Students
                          </div>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="rounded-lg h-8"
                          >
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attendance Quick Action */}
            <div className="space-y-8">
              <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden bg-primary text-primary-foreground">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                    <QrCode className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Attendance QR</h3>
                  <p className="text-primary-foreground/80 text-sm mb-8">
                    Generate a temporary QR code for students to scan and mark
                    their attendance.
                  </p>
                  <Button
                    variant="secondary"
                    className="w-full rounded-xl font-bold h-12"
                  >
                    Generate Code
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-xl font-bold">
                    Recent Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-4">
                  {[
                    {
                      name: "Alice Cooper",
                      task: "ML Assignment 2",
                      date: "2h ago",
                    },
                    {
                      name: "Bob Wilson",
                      task: "ML Assignment 2",
                      date: "4h ago",
                    },
                    {
                      name: "Charlie Brown",
                      task: "Algo Project",
                      date: "Yesterday",
                    },
                  ].map((sub, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarFallback className="text-[10px]">
                            {sub.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold leading-none">
                            {sub.name}
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {sub.task}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-muted-foreground font-medium">
                        {sub.date}
                      </span>
                    </div>
                  ))}
                  <Button
                    variant="link"
                    className="w-full text-primary font-bold text-xs"
                  >
                    View All Submissions
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}
