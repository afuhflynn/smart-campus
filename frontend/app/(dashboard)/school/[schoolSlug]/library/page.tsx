"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Library,
  Book,
  Users,
  Clock,
  Search,
  Plus,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  History,
} from "lucide-react";
import { Input } from "@/components/ui/input";

import { RoleGuard } from "@/components/auth/role-guard";

export default function LibrarianDashboard() {
  return (
    <RoleGuard allowedRoles={["librarian"]}>
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Library Management
              </h1>
              <p className="text-muted-foreground">
                Manage books, loans, and student returns.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl gap-2">
                <History className="h-4 w-4" /> Loan History
              </Button>
              <Button className="rounded-xl font-bold">
                <Plus className="h-4 w-4 mr-2" /> Add New Book
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total Books",
                value: "12,450",
                icon: Library,
                color: "text-primary",
                bg: "bg-primary/10",
              },
              {
                label: "Active Loans",
                value: "342",
                icon: Book,
                color: "text-blue-600",
                bg: "bg-blue-100",
              },
              {
                label: "Active Readers",
                value: "856",
                icon: Users,
                color: "text-green-600",
                bg: "bg-green-100",
              },
              {
                label: "Overdue Books",
                value: "18",
                icon: AlertCircle,
                color: "text-red-600",
                bg: "bg-red-100",
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
            {/* Recent Loans */}
            <Card className="lg:col-span-2 border-0 shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  Recent Loans
                </CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student or book..."
                    className="h-9 pl-9 rounded-xl bg-muted/50 border-0"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  {[
                    {
                      student: "John Student",
                      book: "Introduction to Algorithms",
                      date: "Today, 11:30 AM",
                      due: "Jan 30, 2026",
                      status: "active",
                    },
                    {
                      student: "Alice Cooper",
                      book: "Clean Code",
                      date: "Yesterday",
                      due: "Jan 29, 2026",
                      status: "active",
                    },
                    {
                      student: "Bob Wilson",
                      book: "Design Patterns",
                      date: "Jan 14, 2026",
                      due: "Jan 21, 2026",
                      status: "overdue",
                    },
                    {
                      student: "Charlie Brown",
                      book: "The Pragmatic Programmer",
                      date: "Jan 12, 2026",
                      due: "Jan 19, 2026",
                      status: "returned",
                    },
                  ].map((loan, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center",
                            loan.status === "active"
                              ? "bg-blue-100 text-blue-600"
                              : loan.status === "overdue"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          )}
                        >
                          <Book className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{loan.book}</h4>
                          <p className="text-xs text-muted-foreground">
                            {loan.student} • Loaned: {loan.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                            Due Date
                          </p>
                          <p className="text-xs font-bold">{loan.due}</p>
                        </div>
                        <Badge
                          className={cn(
                            "rounded-lg font-bold capitalize",
                            loan.status === "active"
                              ? "bg-blue-100 text-blue-700"
                              : loan.status === "overdue"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          )}
                        >
                          {loan.status}
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
                  View All Loans
                </Button>
              </CardContent>
            </Card>

            {/* Catalog Highlights */}
            <div className="space-y-8">
              <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-xl font-bold">
                    Popular Books
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {[
                    {
                      title: "Artificial Intelligence",
                      author: "Stuart Russell",
                      count: 45,
                    },
                    { title: "The Art of War", author: "Sun Tzu", count: 38 },
                    {
                      title: "Data Structures",
                      author: "Mark Weiss",
                      count: 32,
                    },
                  ].map((book, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm">{book.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {book.author}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="rounded-lg font-bold"
                      >
                        {book.count} Loans
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden bg-primary text-primary-foreground">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4">Quick Return</h3>
                  <p className="text-primary-foreground/80 text-sm mb-6">
                    Scan the book's barcode or enter the ISBN to process a
                    return.
                  </p>
                  <div className="space-y-3">
                    <Input
                      placeholder="Enter ISBN..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-11 rounded-xl"
                    />
                    <Button
                      variant="secondary"
                      className="w-full rounded-xl font-bold h-11"
                    >
                      Process Return
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}

import { cn } from "@/lib/utils";
