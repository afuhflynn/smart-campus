"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Users,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

export default function AttendancePage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const generateQR = () => {
    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      setToken(`attendance-${Math.random().toString(36).substr(2, 9)}`);
      setTimeLeft(60);
      setIsGenerating(false);
      toast.success("Attendance session started!");
    }, 1000);
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (token) {
      setToken(null);
      toast.error("Attendance token expired.");
    }
  }, [timeLeft, token]);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Attendance Session
            </h1>
            <p className="text-muted-foreground">
              Generate a QR code for students to check-in.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* QR Generator */}
          <Card className="lg:col-span-2 border-0 shadow-sm rounded-[2rem] overflow-hidden">
            <CardContent className="p-12 flex flex-col items-center justify-center min-h-[500px]">
              {token ? (
                <div className="text-center space-y-8 animate-in zoom-in duration-500">
                  <div className="p-8 bg-white rounded-[2.5rem] shadow-2xl shadow-primary/10 border-8 border-primary/5">
                    <QRCodeSVG
                      value={token}
                      size={256}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">Scan to Check-in</p>
                    <p className="text-muted-foreground flex items-center justify-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      Expires in{" "}
                      <span className="font-mono font-bold text-primary">
                        {timeLeft}s
                      </span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-xl gap-2"
                    onClick={generateQR}
                  >
                    <RefreshCw className="h-4 w-4" /> Regenerate Code
                  </Button>
                </div>
              ) : (
                <div className="text-center max-w-sm space-y-6">
                  <div className="mx-auto h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <QrCode className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold">Start New Session</h3>
                  <p className="text-muted-foreground">
                    Ready to take attendance for{" "}
                    <span className="font-bold text-foreground">
                      Advanced Algorithms (CS401)
                    </span>
                    ?
                  </p>
                  <Button
                    className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20"
                    onClick={generateQR}
                    disabled={isGenerating}
                  >
                    {isGenerating ? "Generating..." : "Generate QR Code"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Session Info */}
          <div className="space-y-8">
            <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-xl font-bold">
                  Session Details
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                        Date
                      </p>
                      <p className="text-sm font-bold">Jan 16, 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                        Location
                      </p>
                      <p className="text-sm font-bold">
                        Hall 4, Science Building
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">
                        Expected
                      </p>
                      <p className="text-sm font-bold">42 Students</p>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold">Checked-in</h4>
                    <Badge className="bg-green-100 text-green-700 border-0 font-bold">
                      12 / 42
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: "28%" }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-xl font-bold">
                  Recent Check-ins
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-4">
                {[
                  { name: "John Student", time: "11:32 AM" },
                  { name: "Alice Cooper", time: "11:34 AM" },
                  { name: "Bob Wilson", time: "11:35 AM" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-medium">{s.name}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-bold">
                      {s.time}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
