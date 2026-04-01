"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function InvoicesPage() {
  const [isPaying, setIsPaying] = useState(false);

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      toast.success("Payment successful!", {
        description: "Your invoice has been marked as paid.",
      });
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Invoices & Payments
          </h1>
          <p className="text-muted-foreground">
            Manage your tuition fees and other campus payments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Invoice List */}
          <div className="lg:col-span-2 space-y-6">
            {[
              {
                id: "INV-2026-001",
                title: "Tuition Fee - Spring 2026",
                amount: "$5,000.00",
                due: "Jan 30, 2026",
                status: "unpaid",
              },
              {
                id: "INV-2025-042",
                title: "Library Overdue Fine",
                amount: "$15.00",
                due: "Jan 20, 2026",
                status: "unpaid",
              },
              {
                id: "INV-2025-012",
                title: "Tuition Fee - Fall 2025",
                amount: "$5,000.00",
                due: "Aug 30, 2025",
                status: "paid",
              },
            ].map((inv) => (
              <Card
                key={inv.id}
                className="border-0 shadow-sm rounded-[2rem] overflow-hidden hover:shadow-md transition-shadow"
              >
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "h-12 w-12 rounded-2xl flex items-center justify-center",
                          inv.status === "paid"
                            ? "bg-green-100 text-green-600"
                            : "bg-orange-100 text-orange-600"
                        )}
                      >
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{inv.title}</h3>
                          <Badge
                            className={cn(
                              "rounded-lg font-bold capitalize",
                              inv.status === "paid"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-orange-700"
                            )}
                          >
                            {inv.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Invoice ID: {inv.id} • Due: {inv.due}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end gap-8">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{inv.amount}</p>
                      </div>
                      {inv.status === "unpaid" && (
                        <Button
                          className="rounded-xl font-bold px-8 h-12"
                          onClick={handlePay}
                          disabled={isPaying}
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Summary */}
          <aside className="space-y-8">
            <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden bg-primary text-primary-foreground">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-xl font-bold">
                  Balance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-2">
                  <p className="text-sm text-primary-foreground/60 uppercase font-bold tracking-widest">
                    Total Outstanding
                  </p>
                  <p className="text-4xl font-extrabold">$5,015.00</p>
                </div>
                <div className="pt-6 border-t border-white/10 space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-foreground/80">
                      Tuition Fees
                    </span>
                    <span className="font-bold">$5,000.00</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-foreground/80">
                      Other Charges
                    </span>
                    <span className="font-bold">$15.00</span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="w-full rounded-xl font-bold h-12"
                >
                  Pay All Outstanding
                </Button>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-xl font-bold">
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Bank Transfer</p>
                      <p className="text-[10px] text-muted-foreground">
                        Direct deposit
                      </p>
                    </div>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-transparent hover:border-primary/20 cursor-pointer transition-all">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-background flex items-center justify-center">
                      <CreditCard className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Credit Card</p>
                      <p className="text-[10px] text-muted-foreground">
                        Visa •••• 4242
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full rounded-xl text-xs font-bold"
                >
                  Add Payment Method
                </Button>
              </CardContent>
            </Card>

            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Secure Payments by Stripe
              </span>
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}

import { cn } from "@/lib/utils";
