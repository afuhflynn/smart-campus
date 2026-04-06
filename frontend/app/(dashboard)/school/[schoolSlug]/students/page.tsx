"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  Eye,
  Loader2,
  Plus,
  Search,
  UserPlus,
  XCircle,
} from "lucide-react";
import { use, useState } from "react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import type {
  Application,
  ApplicationListParams,
  ApplicationStatus,
  User,
} from "@/types/api.types";
import { useApplications, useSchool } from "@/hooks";

interface ApplicationsPageProps {
  params: Promise<{ schoolSlug: string }>;
}

function generateStudentNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `STU${year}${random}`;
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    approved: "bg-green-100 text-green-700 border-green-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
  };

  const icons = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
  };

  // @ts-ignore // @todo: Don't forget to fix this well.
  const Icon = icons[status];

  return (
    // @ts-ignore // @todo: Don't forget to fix this well.
    <Badge className={cn("capitalize border", styles[status])}>
      <Icon className="h-3 w-3 mr-1" />
      {status}
    </Badge>
  );
}

function ApplicationDetailModal({
  application,
  isOpen,
  onClose,
  onApprove,
  onReject,
  isApproving,
  isRejecting,
}: {
  application: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (notes?: string) => void;
  onReject: (reason: string) => void;
  isApproving: boolean;
  isRejecting: boolean;
}) {
  const [notes, setNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  if (!application) return null;

  const payload = JSON.parse(application.payload as any);
  const handleApprove = () => {
    onApprove(notes || undefined);
    setNotes("");
  };

  const handleReject = () => {
    onReject(rejectReason);
    setRejectReason("");
    setShowRejectConfirm(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="md:min-w-4xl max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Application #{application.id}</DialogTitle>
          <DialogDescription>
            Submitted on{" "}
            {new Date(application.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Applicant
              </p>
              <p className="font-medium">{application.applicant_name}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Status
              </p>
              <StatusBadge status={application.status} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Email
              </p>
              <p className="font-medium">{application.applicant_email}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Phone
              </p>
              <p className="font-medium">
                {application.applicant_phone ||
                  payload?.phone ||
                  "Not provided"}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">Application Details</h4>
            <div className="space-y-3">
              {Object.entries(payload).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground capitalize">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span className="font-medium">{String(value) || "-"}</span>
                </div>
              ))}
            </div>
          </div>

          {application.status === "pending" && (
            <div className="space-y-3">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Add notes about this application..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          )}
        </div>

        <DialogFooter>
          {application.status === "pending" ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowRejectConfirm(true)}
                disabled={isApproving || isRejecting}
              >
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
              >
                {isApproving ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Approve & Enroll
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>

      <Dialog open={showRejectConfirm} onOpenChange={setShowRejectConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Rejection</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this application? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {showRejectConfirm && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-3">
              <Label>
                Rejection Reason<span className="text-destructive">*</span>
              </Label>
              <Textarea
                placeholder="Reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="min-h-[80px]"
              />
              <p className="text-xs text-red-600">
                This reason will be visible to the applicant.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectConfirm(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || isRejecting}
            >
              {isRejecting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

function RegisterStudentModal({
  isOpen,
  onClose,
  schoolId,
}: {
  isOpen: boolean;
  onClose: () => void;
  schoolId: number;
}) {
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"form" | "success">("form");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    student_number: generateStudentNumber(),
    programme: "",
    level: "",
    academic_year: new Date().getFullYear().toString(),
  });
  const [existingUser, setExistingUser] = useState<{
    exists: boolean;
    user?: User;
  } | null>(null);
  const [registeredData, setRegisteredData] = useState<{
    name: string;
    email: string;
    password: string;
  } | null>(null);

  const checkEmailMutation = useMutation({
    mutationFn: (email: string) => api.mutations.students.checkEmail(email),
    onSuccess: (data) => {
      setExistingUser(
        data.exists ? { exists: true, user: data.user } : { exists: false },
      );
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: typeof formData & { school_id: number }) =>
      api.mutations.students.register(data),
    onSuccess: (data) => {
      setRegisteredData({
        name: `${data.user.name}`,
        email: data.user.email,
        password: data.temporary_password,
      });
      setStep("success");
      queryClient.invalidateQueries({ queryKey: ["applications", schoolId] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleEmailBlur = () => {
    if (formData.email && formData.email.includes("@")) {
      checkEmailMutation.mutate(formData.email);
    }
  };

  const handleRegister = () => {
    registerMutation.mutate({
      ...formData,
      school_id: schoolId,
    });
  };

  const handleClose = () => {
    setStep("form");
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      student_number: generateStudentNumber(),
      programme: "",
      level: "",
      academic_year: new Date().getFullYear().toString(),
    });
    setExistingUser(null);
    setRegisteredData(null);
    onClose();
  };

  const [copied, setCopied] = useState(false);

  const copyCredentials = () => {
    if (registeredData) {
      navigator.clipboard.writeText(
        `Email: ${registeredData.email}\nPassword: ${registeredData.password}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        {step === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle>Register New Student</DialogTitle>
              <DialogDescription>
                Add a student directly to your school. They will receive login
                credentials.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>First Name *</Label>
                  <Input
                    value={formData.first_name}
                    onChange={(e) =>
                      setFormData({ ...formData, first_name: e.target.value })
                    }
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Last Name *</Label>
                  <Input
                    value={formData.last_name}
                    onChange={(e) =>
                      setFormData({ ...formData, last_name: e.target.value })
                    }
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setExistingUser(null);
                    }}
                    onBlur={handleEmailBlur}
                    placeholder="student@school.com"
                  />
                  {existingUser?.exists && (
                    <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                      <AlertTriangle className="h-4 w-4" />
                      <span>User exists. Will be linked to your school.</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+237 6XX XXX XXX"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Student Number</Label>
                  <Input
                    value={formData.student_number}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        student_number: e.target.value,
                      })
                    }
                    placeholder="Auto-generated"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Programme *</Label>
                  <Input
                    value={formData.programme}
                    onChange={(e) =>
                      setFormData({ ...formData, programme: e.target.value })
                    }
                    placeholder="Computer Science"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Level/Year *</Label>
                  <Input
                    value={formData.level}
                    onChange={(e) =>
                      setFormData({ ...formData, level: e.target.value })
                    }
                    placeholder="Year 1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Academic Year *</Label>
                  <Input
                    value={formData.academic_year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        academic_year: e.target.value,
                      })
                    }
                    placeholder="2025-2026"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={handleRegister}
                disabled={
                  !formData.first_name ||
                  !formData.last_name ||
                  !formData.email ||
                  !formData.programme ||
                  !formData.level ||
                  !formData.academic_year ||
                  registerMutation.isPending
                }
              >
                {registerMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Register Student
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-green-600">
                Student Registered Successfully
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <p className="text-muted-foreground">
                {formData.first_name} {formData.last_name} has been registered
                as a student.
              </p>

              <div className="p-4 bg-muted/50 rounded-xl border space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase text-muted-foreground">
                    Temporary Credentials
                  </p>
                  <Badge variant="outline">One-time</Badge>
                </div>
                <div className="space-y-2 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{registeredData?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Password:</span>
                    <span className="select-all">
                      {registeredData?.password}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                  ⚠️ Copy this now - it cannot be recovered after closing!
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={copyCredentials}>
                {copied ? (
                  <Check className="h-4 w-4 mr-2" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                {copied ? "Copied!" : "Copy Credentials"}
              </Button>
              <Button onClick={handleClose}>Done</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function ApplicationsPage({ params }: ApplicationsPageProps) {
  const { schoolSlug } = use(params);
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const limit = 10;

  const { data } = useSchool(schoolSlug);
  const school = data?.school;

  const { data: applicationsData, isLoading } = useApplications(
    school?.id!,
    limit,
    statusFilter as ApplicationStatus,
    search,
    page,
  );

  const approveMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes?: string }) =>
      api.mutations.applications.approve(id, { notes }),
    onSuccess: () => {
      toast.success("Application approved and student enrolled!");
      queryClient.invalidateQueries({ queryKey: ["applications", school?.id] });
      setIsDetailModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      api.mutations.applications.reject(id, { reason }),
    onSuccess: () => {
      toast.success("Application rejected");
      queryClient.invalidateQueries({ queryKey: ["applications", school?.id] });
      setIsDetailModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const applications = applicationsData?.applications || [];
  const pagination = applicationsData?.pagination;
  const stats = {
    total: pagination?.total || 0,
    pending:
      applicationsData?.applications.filter((a) => a.status === "pending")
        .length || 0,
    approved:
      applicationsData?.applications.filter((a) => a.status === "approved")
        .length || 0,
    rejected:
      applicationsData?.applications.filter((a) => a.status === "rejected")
        .length || 0,
  };

  const handleApprove = (notes?: string) => {
    if (selectedApplication) {
      approveMutation.mutate({ id: selectedApplication.id, notes });
    }
  };

  const handleReject = (reason: string) => {
    if (selectedApplication) {
      rejectMutation.mutate({ id: selectedApplication.id, reason });
    }
  };

  if (!school) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
            <p className="text-muted-foreground">
              Manage student applications and registrations
            </p>
          </div>
          <Button
            className="rounded-xl gap-2"
            onClick={() => setIsRegisterModalOpen(true)}
          >
            <UserPlus className="h-4 w-4" /> Register Student
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <p className="text-xs font-bold uppercase text-muted-foreground">
                Total
              </p>
              <p className="text-3xl font-bold">{pagination?.total || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <p className="text-xs font-bold uppercase text-yellow-600">
                Pending
              </p>
              <p className="text-3xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <p className="text-xs font-bold uppercase text-green-600">
                Approved
              </p>
              <p className="text-3xl font-bold text-green-600">
                {stats.approved}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm rounded-2xl">
            <CardContent className="p-6">
              <p className="text-xs font-bold uppercase text-red-600">
                Rejected
              </p>
              <p className="text-3xl font-bold text-red-600">
                {stats.rejected}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 rounded-xl"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] rounded-xl">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-bold">#</TableHead>
                <TableHead className="font-bold">Applicant</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Phone</TableHead>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : applications.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No applications found
                  </TableCell>
                </TableRow>
              ) : (
                applications.map((app, index) => {
                  const payload = JSON.parse(app.payload as any);
                  return (
                    <TableRow key={app.id}>
                      <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                      <TableCell className="font-medium">
                        {app.applicant_name}
                      </TableCell>
                      <TableCell>{app.applicant_email}</TableCell>
                      <TableCell>
                        {app.applicant_phone || payload?.phone || "-"}
                      </TableCell>
                      <TableCell>
                        {new Date(app.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={app.status} />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedApplication(app);
                            setIsDetailModalOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>

        {pagination && pagination.totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <PaginationItem key={`page-${i + 1}`}>
                  <Button
                    variant={page === i + 1 ? "outline" : "ghost"}
                    size="icon"
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                </PaginationItem>
              ))}
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={page === pagination.totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <ApplicationDetailModal
        application={selectedApplication}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedApplication(null);
        }}
        onApprove={handleApprove}
        onReject={handleReject}
        isApproving={approveMutation.isPending}
        isRejecting={rejectMutation.isPending}
      />

      <RegisterStudentModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        schoolId={school.id}
      />
    </DashboardLayout>
  );
}
