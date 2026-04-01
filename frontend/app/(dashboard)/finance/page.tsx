"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  Download,
  MoreHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const revenueData = [
  { name: "Jan", amount: 45000 },
  { name: "Feb", amount: 52000 },
  { name: "Mar", amount: 48000 },
  { name: "Apr", amount: 61000 },
  { name: "May", amount: 55000 },
  { name: "Jun", amount: 67000 },
];

import { RoleGuard } from "@/components/auth/role-guard";

export default function FinanceDashboard() {
  return (
    <RoleGuard allowedRoles={["finance"]}>
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Finance Management
              </h1>
              <p className="text-muted-foreground">
                Monitor revenue, invoices, and payment statuses.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="rounded-xl gap-2">
                <Download className="h-4 w-4" /> Export CSV
              </Button>
              <Button className="rounded-xl font-bold">Create Invoice</Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total Revenue",
                value: "$425,000",
                icon: TrendingUp,
                trend: "+12.5%",
                color: "text-green-600",
                bg: "bg-green-100",
              },
              {
                label: "Pending Payments",
                value: "$12,450",
                icon: Clock,
                trend: "-2.4%",
                color: "text-orange-600",
                bg: "bg-orange-100",
              },
              {
                label: "Paid Invoices",
                value: "842",
                icon: CheckCircle2,
                trend: "+5.2%",
                color: "text-blue-600",
                bg: "bg-blue-100",
              },
              {
                label: "Outstanding",
                value: "$3,200",
                icon: AlertCircle,
                trend: "+1.2%",
                color: "text-red-600",
                bg: "bg-red-100",
              },
            ].map((stat, i) => (
              <Card
                key={i}
                className="border-0 shadow-sm rounded-3xl overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}
                    >
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <span
                      className={cn(
                        "text-xs font-bold",
                        stat.trend.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      {stat.trend}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Chart */}
            <Card className="lg:col-span-2 border-0 shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-xl font-bold">
                  Revenue Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
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
                        dataKey="amount"
                        fill="var(--primary)"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                      >
                        {revenueData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 5
                                ? "var(--primary)"
                                : "var(--primary-foreground)"
                            }
                            fillOpacity={index === 5 ? 1 : 0.2}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-xl font-bold">
                  Recent Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {[
                  {
                    name: "John Student",
                    amount: "$2,500",
                    date: "Today, 10:45 AM",
                    status: "completed",
                  },
                  {
                    name: "Alice Cooper",
                    amount: "$1,200",
                    date: "Today, 09:15 AM",
                    status: "completed",
                  },
                  {
                    name: "Bob Wilson",
                    amount: "$3,000",
                    date: "Yesterday",
                    status: "pending",
                  },
                  {
                    name: "Charlie Brown",
                    amount: "$500",
                    date: "Jan 14, 2026",
                    status: "failed",
                  },
                ].map((tx, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center",
                          tx.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : tx.status === "pending"
                            ? "bg-orange-100 text-orange-600"
                            : "bg-red-100 text-red-600"
                        )}
                      >
                        {tx.status === "completed" ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-none">
                          {tx.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {tx.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{tx.amount}</p>
                      <p
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-tighter",
                          tx.status === "completed"
                            ? "text-green-600"
                            : tx.status === "pending"
                            ? "text-orange-600"
                            : "text-red-600"
                        )}
                      >
                        {tx.status}
                      </p>
                    </div>
                  </div>
                ))}
                <Button
                  variant="link"
                  className="w-full text-primary font-bold text-xs"
                >
                  View All Transactions
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Invoices Table */}
          <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold">Invoices</CardTitle>
              <div className="flex gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search invoices..."
                    className="h-9 pl-9 rounded-xl bg-muted/50 border-0"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-lg gap-2"
                >
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase tracking-wider border-b">
                    <tr>
                      <th className="px-6 py-4 font-bold">Invoice ID</th>
                      <th className="px-6 py-4 font-bold">Student</th>
                      <th className="px-6 py-4 font-bold">Amount</th>
                      <th className="px-6 py-4 font-bold">Due Date</th>
                      <th className="px-6 py-4 font-bold">Status</th>
                      <th className="px-6 py-4 font-bold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      {
                        id: "INV-001",
                        student: "John Student",
                        amount: "$5,000",
                        due: "Jan 30, 2026",
                        status: "unpaid",
                      },
                      {
                        id: "INV-002",
                        student: "Alice Cooper",
                        amount: "$1,200",
                        due: "Feb 15, 2026",
                        status: "paid",
                      },
                      {
                        id: "INV-003",
                        student: "Bob Wilson",
                        amount: "$3,000",
                        due: "Jan 25, 2026",
                        status: "overdue",
                      },
                    ].map((inv) => (
                      <tr
                        key={inv.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="px-6 py-4 font-medium">{inv.id}</td>
                        <td className="px-6 py-4">{inv.student}</td>
                        <td className="px-6 py-4 font-bold">{inv.amount}</td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {inv.due}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={cn(
                              "rounded-lg font-bold capitalize",
                              inv.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : inv.status === "unpaid"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                            )}
                          >
                            {inv.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-lg"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </RoleGuard>
  );
}

import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
