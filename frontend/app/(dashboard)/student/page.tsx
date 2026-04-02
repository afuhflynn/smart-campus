"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  GraduationCap,
  TrendingUp,
  FileText,
  CreditCard,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const attendanceData = [
  { name: "Mon", value: 90 },
  { name: "Tue", value: 85 },
  { name: "Wed", value: 95 },
  { name: "Thu", value: 80 },
  { name: "Fri", value: 88 },
];

const gradesData = [
  { name: "Math", score: 85 },
  { name: "Physics", score: 78 },
  { name: "CS", score: 92 },
  { name: "English", score: 88 },
];

import { RoleGuard } from "@/components/auth/role-guard";
import { useUserProfile } from "@/hooks";

export default function StudentDashboard() {
  const { data, isPending } = useUserProfile();
  return (
    <RoleGuard allowedRoles={["student"]}>
      <DashboardLayout>
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {data?.user.name ?? "Users"}!
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your studies today.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "GPA",
                value: "3.8",
                icon: GraduationCap,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                label: "Attendance",
                value: "92%",
                icon: CheckCircle2,
                color: "text-green-600",
                bg: "bg-green-100",
              },
              {
                label: "Courses",
                value: "6",
                icon: BookOpen,
                color: "text-blue-600",
                bg: "bg-blue-100",
              },
              {
                label: "Pending Tasks",
                value: "4",
                icon: Clock,
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
            {/* Charts */}
            <Card className="lg:col-span-2 border-0 shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-xl font-bold">
                  Academic Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradesData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#888", fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#888", fontSize: 12 }}
                      />
                      <Tooltip
                        cursor={{ fill: "#f8f9fa" }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Bar
                        dataKey="score"
                        fill="var(--primary)"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Schedule */}
            <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-xl font-bold">
                  Upcoming Classes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {[
                  {
                    time: "09:00 AM",
                    subject: "Mathematics",
                    room: "Room 302",
                    type: "Lecture",
                  },
                  {
                    time: "11:30 AM",
                    subject: "Computer Science",
                    room: "Lab 1",
                    type: "Practical",
                  },
                  {
                    time: "02:00 PM",
                    subject: "Physics",
                    room: "Room 105",
                    type: "Lecture",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-primary mb-1"></div>
                      <div className="w-0.5 flex-1 bg-muted group-last:hidden"></div>
                    </div>
                    <div className="pb-6">
                      <p className="text-xs font-bold text-primary uppercase tracking-wider">
                        {item.time}
                      </p>
                      <h4 className="font-bold text-lg">{item.subject}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.room} • {item.type}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Notifications */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  Recent Results
                </CardTitle>
                <Badge variant="outline" className="rounded-full">
                  View All
                </Badge>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {[
                  {
                    title: "Midterm Exam - CS101",
                    score: "95/100",
                    date: "2 days ago",
                    status: "A+",
                  },
                  {
                    title: "Quiz 3 - Mathematics",
                    score: "18/20",
                    date: "4 days ago",
                    status: "A",
                  },
                  {
                    title: "Lab Report - Physics",
                    score: "88/100",
                    date: "1 week ago",
                    status: "B+",
                  },
                ].map((res, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{res.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {res.date} • {res.score}
                        </p>
                      </div>
                    </div>
                    <Badge className="rounded-lg font-bold">{res.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  Pending Invoices
                </CardTitle>
                <Badge variant="outline" className="rounded-full">
                  Pay Now
                </Badge>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {[
                  {
                    title: "Tuition Fee - Spring 2026",
                    amount: "$5,000",
                    due: "Jan 30, 2026",
                    status: "unpaid",
                  },
                  {
                    title: "Library Overdue Fine",
                    amount: "$15",
                    due: "Jan 20, 2026",
                    status: "unpaid",
                  },
                ].map((inv, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center shadow-sm">
                        <CreditCard className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{inv.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          Due: {inv.due}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{inv.amount}</p>
                      <p className="text-[10px] text-destructive font-bold uppercase tracking-tighter">
                        Unpaid
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}
