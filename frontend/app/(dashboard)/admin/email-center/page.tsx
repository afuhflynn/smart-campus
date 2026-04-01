"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Send,
  Clock,
  Eye,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { RoleGuard } from "@/components/auth/role-guard";
import { cn } from "@/lib/utils";

const mockEmails = [
  {
    id: "1",
    to: "alice@example.com",
    subject: "Application Received",
    status: "sent",
    date: "2026-01-15 10:30 AM",
    content:
      "Dear Alice, your application to Tech University has been received...",
  },
  {
    id: "2",
    to: "bob@example.com",
    subject: "Welcome to Smart Campus",
    status: "queued",
    date: "2026-01-16 09:00 AM",
    content: "Hi Bob, welcome to the platform! Please verify your email...",
  },
  {
    id: "3",
    to: "charlie@example.com",
    subject: "Tuition Invoice",
    status: "queued",
    date: "2026-01-16 02:15 PM",
    content: "Hello Charlie, your invoice for Spring 2026 is now available...",
  },
];

export default function EmailCenterPage() {
  const [emails, setEmails] = useState(mockEmails);

  const sendEmail = (id: string) => {
    setEmails(emails.map((e) => (e.id === id ? { ...e, status: "sent" } : e)));
    toast.success("Email sent successfully!");
  };

  return (
    <RoleGuard allowedRoles={["platform_admin"]}>
      <DashboardLayout>
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Email Center (Dev Tools)
              </h1>
              <p className="text-muted-foreground">
                Monitor and trigger mock system emails.
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl gap-2"
              onClick={() => toast.info("Refreshing queue...")}
            >
              <RefreshCw className="h-4 w-4" /> Refresh Queue
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Email List */}
            <Card className="lg:col-span-2 border-0 shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-bold">
                  Outgoing Queue
                </CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search emails..."
                    className="h-9 pl-9 rounded-xl bg-muted/50 border-0"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-4">
                  {emails.map((email) => (
                    <div
                      key={email.id}
                      className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors group"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center",
                            email.status === "sent"
                              ? "bg-green-100 text-green-600"
                              : "bg-orange-100 text-orange-600"
                          )}
                        >
                          {email.status === "sent" ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : (
                            <Clock className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">{email.subject}</h4>
                          <p className="text-xs text-muted-foreground">
                            To: {email.to} • {email.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            "rounded-lg font-bold capitalize",
                            email.status === "sent"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          )}
                        >
                          {email.status}
                        </Badge>
                        {email.status === "queued" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 rounded-lg text-primary hover:bg-primary/10"
                            onClick={() => sendEmail(email.id)}
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-accent"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats & Tools */}
            <div className="space-y-8">
              <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8 pb-0">
                  <CardTitle className="text-xl font-bold">
                    Email Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/30 text-center">
                      <p className="text-2xl font-bold">1,240</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                        Sent Today
                      </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-muted/30 text-center">
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                        Queued
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">
                        Deliverability Rate
                      </span>
                    </div>
                    <span className="font-bold text-primary">99.8%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden bg-muted/30">
                <CardContent className="p-8">
                  <h4 className="font-bold mb-4">Data Seeder</h4>
                  <p className="text-sm text-muted-foreground mb-6">
                    Populate the mock database with sample data for testing and
                    demos.
                  </p>
                  <div className="space-y-2">
                    <Button
                      className="w-full rounded-xl h-11"
                      onClick={() => toast.success("Seeding schools...")}
                    >
                      Seed Schools
                    </Button>
                    <Button
                      className="w-full rounded-xl h-11"
                      onClick={() => toast.success("Seeding applications...")}
                    >
                      Seed Applications
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-xl h-11"
                      onClick={() => toast.error("Clearing all data...")}
                    >
                      Clear All Data
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
