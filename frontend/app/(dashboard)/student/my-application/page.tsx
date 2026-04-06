"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useApplication } from "@/hooks";
import { StatusBadge } from "../../school/[schoolSlug]/students/page";
import { Label } from "@/components/ui/label";

export default function MyApplicationPage() {
  const { data, isPending } = useApplication();

  if (isPending) return null;

  const payload = JSON.parse(data?.application.payload as any);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Application & Aproval status
          </h1>
          <p className="text-muted-foreground">View your application status.</p>
        </div>

        <div>
          <div className="md:min-w-4xl max-w-2xl max-h-[80vh] overflow-y-auto">
            <div>
              <h1>Application #{data?.application.id}</h1>
              <div>
                Submitted on{" "}
                {new Date(
                  data?.application.created_at as Date,
                ).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                <br />
                <span className="underline">Institution:</span>{" "}
                <span className="text-primary font-bold text-lg">
                  {data?.school.name}(
                  <span className="uppercase">{data?.school.abbreviation}</span>
                  )
                </span>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 py-4 bg-muted/30 rounded-xl">
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    Applicant
                  </p>
                  <p className="font-medium">
                    {data?.application.applicant_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    Status
                  </p>
                  {/* @todo: Fix this later */}
                  <StatusBadge status={data?.application.status as any} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    Email
                  </p>
                  <p className="font-medium">
                    {data?.application.applicant_email}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    Phone
                  </p>
                  <p className="font-medium">
                    {data?.application.applicant_phone ||
                      payload?.phone ||
                      "Not provided"}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Application Details</h4>
                <div className="space-y-3">
                  {Object.entries(payload).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between py-2 border-b"
                    >
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="font-medium">
                        {String(value) || "-"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {data?.application.status === "rejected" && (
                <div className="space-y-3">
                  <Label className="text-destructive">Rejection reason</Label>
                  <p className="text-destructive">
                    {data.application.rejection_reason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
