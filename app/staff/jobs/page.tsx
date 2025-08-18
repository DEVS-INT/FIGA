"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  Calendar,
  Clock,
  User as UserIcon,
  Search,
  RefreshCw,
  Filter as FilterIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StaffHeader } from "@/components/staff";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function StaffJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "PENDING" | "APPROVED" | "REJECTED"
  >("ALL");
  const [urgentOnly, setUrgentOnly] = useState(false);
  const router = useRouter();

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/staff/jobs", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (e) {
      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: number, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/staff/jobs/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Failed to update status");
      toast.success(`Job ${status.toLowerCase()}`);
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
    } catch (e: any) {
      toast.error(e.message || "Failed to update status");
    }
  };

  const stats = useMemo(() => {
    const pending = jobs.filter((j) => j.status === "PENDING").length;
    const approved = jobs.filter((j) => j.status === "APPROVED").length;
    const rejected = jobs.filter((j) => j.status === "REJECTED").length;
    return { total: jobs.length, pending, approved, rejected };
  }, [jobs]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return jobs.filter((j) => {
      const byStatus =
        statusFilter === "ALL" ? true : j.status === statusFilter;
      const byUrgency = urgentOnly ? Boolean(j.job_urgency) : true;
      const byTerm = !term
        ? true
        : [
            j.title,
            j.location,
            j.employer?.fullname,
            j.employer?.email,
            j.shift_type,
          ]
            .filter(Boolean)
            .some((s: string) => s.toLowerCase().includes(term));
      return byStatus && byUrgency && byTerm;
    });
  }, [jobs, q, statusFilter, urgentOnly]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-slate-600">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-blue-600" /> Loading…
      </div>
    );

  return (
    <div className="space-y-6 p-1">
      <StaffHeader
        title="Manage Jobs"
        subtitle="Review, approve or reject job postings."
      />

      {/* Top stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All statuses</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.pending}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.approved}
            </div>
            <p className="text-xs text-muted-foreground">
              Visible to applicants
            </p>
          </CardContent>
        </Card>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-600">
              {stats.rejected}
            </div>
            <p className="text-xs text-muted-foreground">Needs changes</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by title, employer, email, or location"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2">
            <FilterIcon className="h-4 w-4 text-slate-500" />
            <Select
              value={statusFilter}
              onValueChange={(v) => setStatusFilter(v as any)}
            >
              <SelectTrigger className="h-10 w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant={urgentOnly ? "brand" : "outline"}
            className={cn("h-10", urgentOnly ? "bg-blue-600 text-white" : "")}
            onClick={() => setUrgentOnly((v) => !v)}
          >
            {urgentOnly ? "Urgent only" : "Include urgent"}
          </Button>
          <Button variant="outline" className="h-10" onClick={load}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>
      {/* Details Modal */}
      <Dialog
        open={detailsOpen}
        onOpenChange={(v) => {
          setDetailsOpen(v);
          if (!v) setSelectedJob(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xl font-semibold leading-snug">
                    {selectedJob?.title || "Job Details"}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedJob && (
                      <>
                        <Badge
                          variant="outline"
                          className={
                            selectedJob.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : selectedJob.status === "REJECTED"
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          }
                        >
                          {selectedJob.status}
                        </Badge>
                        {selectedJob.job_urgency && (
                          <Badge
                            className="bg-blue-50 text-blue-700 border-blue-200"
                            variant="outline"
                          >
                            Urgent: {selectedJob.job_urgency}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {selectedJob?.employer?.fullname && (
                  <div className="flex items-center gap-2">
                    <Avatar className="size-10 border border-blue-200">
                      <AvatarImage
                        src={""}
                        alt={selectedJob.employer.fullname}
                      />
                      <AvatarFallback className="bg-blue-50 text-blue-700 font-semibold">
                        {(
                          selectedJob.employer.fullname[0] || "E"
                        ).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <div className="font-medium">
                        {selectedJob.employer.fullname}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {selectedJob.employer.email}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </DialogTitle>
            <DialogDescription>
              {selectedJob
                ? "Review job information and take action"
                : "Review job information"}
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              {/* Key facts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  {selectedJob.location || "—"}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-green-600" />
                  {selectedJob.shift_type || "—"}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                  {selectedJob.schedule_start
                    ? new Date(selectedJob.schedule_start).toLocaleString()
                    : "—"}
                  {selectedJob.schedule_end
                    ? ` – ${new Date(
                        selectedJob.schedule_end
                      ).toLocaleString()}`
                    : ""}
                </div>
                {selectedJob.deadline && (
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 text-orange-600" />
                    Deadline: {new Date(selectedJob.deadline).toLocaleString()}
                  </div>
                )}
                {selectedJob.gender_preference && (
                  <div className="flex items-center text-muted-foreground">
                    <UserIcon className="h-4 w-4 mr-2 text-rose-600" />
                    {selectedJob.gender_preference}
                  </div>
                )}
                {selectedJob.language_level_requirement && (
                  <div className="text-muted-foreground">
                    Language: {selectedJob.language_level_requirement}
                  </div>
                )}
                <div className="text-muted-foreground">
                  Driving Required:{" "}
                  {selectedJob.driving_license_required ? "Yes" : "No"}
                </div>
              </div>

              {/* Requirements */}
              {selectedJob.job_requirements && (
                <div className="rounded-md border p-3">
                  <h4 className="font-semibold mb-1">Requirements</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {selectedJob.job_requirements}
                  </p>
                </div>
              )}

              {/* Description */}
              <div className="rounded-md border p-3">
                <h4 className="font-semibold mb-1">Description</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedJob.description || "—"}
                </p>
              </div>

              {/* Footer actions */}
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
                <Button
                  onClick={async () => {
                    await updateStatus(selectedJob.id, "APPROVED");
                    setDetailsOpen(false);
                  }}
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                </Button>
                <Button
                  onClick={async () => {
                    await updateStatus(selectedJob.id, "REJECTED");
                    setDetailsOpen(false);
                  }}
                  variant="destructive"
                >
                  <XCircle className="h-4 w-4 mr-1" /> Reject
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Results */}
      <div className="grid gap-4">
        {filtered.map((job) => {
          const statusColor =
            job.status === "APPROVED"
              ? "border-emerald-200"
              : job.status === "REJECTED"
              ? "border-rose-200"
              : "border-amber-200";
          const statusBadge =
            job.status === "APPROVED"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : job.status === "REJECTED"
              ? "bg-rose-50 text-rose-700 border-rose-200"
              : "bg-amber-50 text-amber-700 border-amber-200";
          return (
            <Card key={job.id} className={cn("rounded-2xl", statusColor)}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <CardTitle className="leading-tight">
                        {job.title}
                      </CardTitle>
                      <Badge className={statusBadge} variant="outline">
                        {job.status}
                      </Badge>
                      {job.job_urgency && (
                        <Badge
                          className="bg-blue-50 text-blue-700 border-blue-200"
                          variant="outline"
                        >
                          Urgent: {job.job_urgency}
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Posted by {job.employer?.fullname || "Unknown"}
                      {job.employer?.email ? ` (${job.employer.email})` : ""}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedJob(job);
                        setDetailsOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Details
                    </Button>
                    <Button
                      onClick={() => updateStatus(job.id, "APPROVED")}
                      variant="default"
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => updateStatus(job.id, "REJECTED")}
                      variant="destructive"
                      size="sm"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                    {job.location || "—"}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    {job.shift_type || "—"}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                    {job.schedule_start
                      ? new Date(job.schedule_start).toLocaleString()
                      : "—"}
                    {job.schedule_end
                      ? ` – ${new Date(job.schedule_end).toLocaleString()}`
                      : ""}
                  </div>
                  {job.deadline && (
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-orange-600" />
                      Deadline: {new Date(job.deadline).toLocaleString()}
                    </div>
                  )}
                  {job.gender_preference && (
                    <div className="flex items-center text-muted-foreground">
                      <UserIcon className="h-4 w-4 mr-2 text-rose-600" />
                      {job.gender_preference}
                    </div>
                  )}
                  {job.language_level_requirement && (
                    <div className="text-muted-foreground">
                      Language: {job.language_level_requirement}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-slate-600">
            <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <div className="text-lg font-medium">
              No jobs match your filters
            </div>
            <div className="text-sm text-muted-foreground">
              Try adjusting search or status.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
