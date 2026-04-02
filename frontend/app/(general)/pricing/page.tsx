"use client";

import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

const tiers = [
  {
    name: "Basic",
    price: "10,000 FCFA",
    description: "Perfect for small specialized schools.",
    features: [
      "Up to 1,000 students",
      "Standard application form",
      "Basic attendance tracking",
      "Email support",
    ],
    cta: "Start with Basic",
    highlight: false,
  },
  {
    name: "Standard",
    price: "25,000 FCFA",
    description: "Ideal for growing colleges and academies.",
    features: [
      "Up to 5,000 students",
      "Custom form builder",
      "Advanced analytics",
      "Library & Finance modules",
      "Priority support",
    ],
    cta: "Go Standard",
    highlight: true,
  },
  {
    name: "Premium",
    price: "Custom",
    description: "Full-scale solution for large universities.",
    features: [
      "Unlimited students",
      "White-labeling",
      "API access",
      "Dedicated account manager",
      "24/7 phone support",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function PricingPage() {
  return (
    <PublicLayout>
      <div className="bg-muted/30 border-b">
        <div className="container py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Simple, Transparent <span className="text-primary">Pricing</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your institution's size and needs. No
            hidden fees.
          </p>
        </div>
      </div>

      <div className="container py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "relative overflow-hidden rounded-[2.5rem] border-0 shadow-xl transition-all duration-300 hover:-translate-y-2",
                tier.highlight
                  ? "ring-2 ring-primary shadow-primary/10"
                  : "shadow-muted/50",
              )}
            >
              {tier.highlight && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-6 py-1 rounded-bl-2xl text-xs font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <CardHeader className="p-8 pb-0">
                <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-extrabold">{tier.price}</span>
                  {tier.price !== "Custom" && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {tier.description}
                </p>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                <div className="space-y-3">
                  {tier.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <div className="p-8 pt-0">
                <Button
                  variant={tier.highlight ? "default" : "outline"}
                  className="w-full rounded-xl h-12 font-bold text-lg"
                >
                  {tier.cta}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-24 bg-primary/5 rounded-[3rem] p-12 text-center border border-primary/10">
          <h2 className="text-3xl font-bold mb-4">Need a custom solution?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            We offer tailored packages for large-scale deployments and
            government educational bodies.
          </p>
          <Button size="lg" className="rounded-xl px-10 font-bold h-14">
            Talk to our Team <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
}

import { cn } from "@/lib/utils";
