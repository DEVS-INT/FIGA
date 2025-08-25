"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Send,
  MapPin,
  Briefcase,
  Calendar,
  Clock,
  User as UserIcon,
  Mail,
  Phone,
  GraduationCap,
  BadgeCheck,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StaffHeader } from "@/components/staff";

export default function Applicants() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolio, setPortfolio] = useState<any | null>(null);
  const [reqOpen, setReqOpen] = useState(false);
  const [reqLoading, setReqLoading] = useState(false);
  const [reqJob, setReqJob] = useState<any | null>(null);
  // Only show approved jobs (employees apply only to approved jobs)
  const [jobStatus] = useState<string>("APPROVED");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [shift, setShift] = useState<string>("ALL");
  const [selected, setSelected] = useState<Record<number, boolean>>({}); // applicationId -> selected
  // Per-table (per job) filters
  const [groupFilters, setGroupFilters] = useState<
    Record<
      number,
      {
        q: string;
        verified: "ALL" | "YES" | "NO";
        status: "ALL" | "PENDING" | "APPROVED" | "REJECTED";
        from: string;
        to: string;
      }
    >
  >({});

  const getGroupFilter = (jobId: number) =>
    groupFilters[jobId] || {
      q: "",
      verified: "ALL" as const,
      status: "ALL" as const,
      from: "",
      to: "",
    };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        const res = await fetch(`/api/staff/applicants?${params.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch applicants");
        const json = await res.json();
        setRows(json.applicants || []);
        setSelected({});
      } catch (e) {
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [q]);

  const sendToEmployer = async (jobId: number) => {
    try {
      // collect selected applicationIds for this job; if none selected, backend will default to all
      const applicationIds = Object.entries(selected)
        .filter(([id, on]) => on)
        .map(([id]) => parseInt(id))
        .filter((id) =>
          groupsByJobId[jobId]?.some((a: any) => a.applicationId === id)
        );

      const res = await fetch(`/api/staff/applicants/${jobId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationIds }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Failed to send applicants");
      const sentCount =
        json.count ??
        (applicationIds.length || groupsByJobId[jobId]?.length || 0);
      toast.success(`Sent ${sentCount} candidate(s) to employer`);
    } catch (e: any) {
      toast.error(e.message || "Failed to send");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading…
      </div>
    );

  // Apply client-side filters
  const filtered = rows.filter((r: any) => {
    // Enforce approved jobs only
    if (r.jobStatus !== "APPROVED") return false;
    if (verifiedOnly && !r.portfolio?.verified) return false;
    if (
      shift !== "ALL" &&
      (r.portfolio?.workShift || "").toUpperCase() !== shift
    )
      return false;
    return true;
  });

  // Group filtered rows by jobId
  const grouped = filtered.reduce((acc: Record<number, any>, r: any) => {
    if (!acc[r.jobId]) {
      acc[r.jobId] = {
        jobId: r.jobId,
        title: r.jobTitle,
        location: r.jobLocation,
        status: r.jobStatus,
        urgency: r.jobUrgency,
        applicants: [] as any[],
      };
    }
    acc[r.jobId].applicants.push(r);
    return acc;
  }, {});
  const groups = Object.values(grouped);
  const groupsByJobId: Record<number, any[]> = Object.fromEntries(
    Object.values(grouped).map((g: any) => [g.jobId, g.applicants])
  );

  return (
    <div className="space-y-4">
      <StaffHeader
        title="Applicants"
        subtitle="Filter candidates, inspect portfolios, and forward to employers."
        right={null}
      />
      <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <Input
            placeholder="Search (job, name)…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="md:max-w-xs"
          />
          {/* Jobs shown here are approved only */}
          <Select value={shift} onValueChange={setShift}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Shifts</SelectItem>
              <SelectItem value="DAY">Day</SelectItem>
              <SelectItem value="NIGHT">Night</SelectItem>
              <SelectItem value="ROTATIONAL">Rotational</SelectItem>
            </SelectContent>
          </Select>
          <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox
              checked={verifiedOnly}
              onCheckedChange={(v: any) => setVerifiedOnly(!!v)}
            />{" "}
            Verified only
          </label>
        </div>
      </div>
      {/* Portfolio Modal */}
      <Dialog
        open={portfolioOpen}
        onOpenChange={(v) => {
          setPortfolioOpen(v);
          if (!v) setPortfolio(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-3">
                <Avatar className="size-10 border border-blue-200">
                  <AvatarImage
                    src=""
                    alt={portfolio?.user?.fullname || "Employee"}
                  />
                  <AvatarFallback className="bg-blue-50 text-blue-700 font-semibold">
                    {(portfolio?.user?.fullname?.[0] || "E").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="inline-flex items-center gap-2 text-base font-semibold">
                    {portfolio?.user?.fullname || "Employee Portfolio"}
                  </span>
                  {portfolio?.user?.email && (
                    <span className="inline-flex items-center gap-2 text-slate-600 text-sm">
                      <Mail className="h-4 w-4" /> {portfolio.user.email}
                    </span>
                  )}
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              {!portfolio?.user?.email &&
                "Review candidate details before forwarding."}
            </DialogDescription>
          </DialogHeader>
          {portfolioLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading…
            </div>
          ) : portfolio ? (
            <div className="space-y-4">
              {/* Top badges */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={
                    portfolio.is_verified
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }
                >
                  {portfolio.is_verified ? (
                    <span className="inline-flex items-center gap-1">
                      <BadgeCheck className="h-4 w-4" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" /> Unverified
                    </span>
                  )}
                </Badge>
                {portfolio.sex && (
                  <Badge variant="secondary">Sex: {portfolio.sex}</Badge>
                )}
                {typeof portfolio.age === "number" && (
                  <Badge variant="secondary">Age: {portfolio.age}</Badge>
                )}
              </div>

              {/* Info grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                <div className="space-y-1">
                  <div className="text-slate-500">Phone</div>
                  <div className="inline-flex items-center gap-2 font-medium">
                    <Phone className="h-4 w-4 text-blue-600" />{" "}
                    {portfolio.user?.phone || "—"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-500">English Skill</div>
                  <div className="font-medium">
                    {portfolio.english_skill || "—"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-500">Comfortability</div>
                  <div className="font-medium">
                    {portfolio.comfortability || "—"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-500">Experience State</div>
                  <div className="inline-flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 text-green-600" />
                    {portfolio.state_where_experience_gained || "—"}
                  </div>
                </div>
                {portfolio.suitable_work_days && (
                  <div className="space-y-1">
                    <div className="text-slate-500">Suitable Work Days</div>
                    <div className="font-medium">
                      {portfolio.suitable_work_days}
                    </div>
                  </div>
                )}
                {portfolio.suitable_work_shift && (
                  <div className="space-y-1">
                    <div className="text-slate-500">Suitable Work Shift</div>
                    <div className="font-medium">
                      {portfolio.suitable_work_shift}
                    </div>
                  </div>
                )}
              </div>

              {/* Education */}
              {(portfolio.university_college ||
                portfolio.study_field ||
                portfolio.degree) && (
                <div className="rounded-md border p-3">
                  <div className="font-medium flex items-center gap-2 mb-1">
                    <GraduationCap className="h-4 w-4 text-blue-600" />{" "}
                    Education
                  </div>
                  <div className="text-sm text-slate-700 space-y-1">
                    {portfolio.university_college && (
                      <div>School: {portfolio.university_college}</div>
                    )}
                    {portfolio.study_field && (
                      <div>Field: {portfolio.study_field}</div>
                    )}
                    {portfolio.degree && <div>Degree: {portfolio.degree}</div>}
                  </div>
                </div>
              )}

              {/* Experience & Certifications */}
              {(portfolio.experience || portfolio.certifications) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {portfolio.experience && (
                    <div className="rounded-md border p-3">
                      <div className="font-medium mb-1">Experience</div>
                      <div className="text-sm text-slate-700 whitespace-pre-wrap">
                        {portfolio.experience}
                      </div>
                    </div>
                  )}
                  {portfolio.certifications && (
                    <div className="rounded-md border p-3">
                      <div className="font-medium mb-1">Certifications</div>
                      <div className="text-sm text-slate-700 whitespace-pre-wrap">
                        {portfolio.certifications}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-600">No portfolio to display</div>
          )}
        </DialogContent>
      </Dialog>

      {/* Job Details Modal */}
      <Dialog
        open={reqOpen}
        onOpenChange={(v) => {
          setReqOpen(v);
          if (!v) setReqJob(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {reqJob?.title ? `${reqJob.title}` : "Job Details"}
            </DialogTitle>
            <DialogDescription>
              {reqJob?.employer ? (
                <span>
                  Posted by {reqJob.employer.fullname} ({reqJob.employer.email})
                </span>
              ) : (
                <span>Review full job information.</span>
              )}
            </DialogDescription>
          </DialogHeader>
          {reqLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading…
            </div>
          ) : reqJob ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  {reqJob.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Badge className="mr-2" variant="secondary">
                    {reqJob.status}
                  </Badge>
                  {reqJob.job_urgency ? (
                    <span className="ml-1">Urgency: {reqJob.job_urgency}</span>
                  ) : null}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-green-600" />
                  {reqJob.shift_type}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                  {new Date(reqJob.schedule_start).toLocaleString()} –{" "}
                  {new Date(reqJob.schedule_end).toLocaleString()}
                </div>
                {reqJob.deadline && (
                  <div className="flex items-center text-muted-foreground md:col-span-2">
                    <Calendar className="h-4 w-4 mr-2 text-orange-600" />
                    Deadline: {new Date(reqJob.deadline).toLocaleString()}
                  </div>
                )}
                {reqJob.gender_preference && (
                  <div className="flex items-center text-muted-foreground">
                    <UserIcon className="h-4 w-4 mr-2 text-rose-600" />
                    {reqJob.gender_preference}
                  </div>
                )}
                {reqJob.language_level_requirement && (
                  <div className="text-muted-foreground">
                    Language: {reqJob.language_level_requirement}
                  </div>
                )}
                <div className="text-muted-foreground">
                  Driving Required:{" "}
                  {reqJob.driving_license_required ? "Yes" : "No"}
                </div>
              </div>
              {reqJob.job_requirements ? (
                <div>
                  <h4 className="font-semibold mb-1">Requirements</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {reqJob.job_requirements}
                  </p>
                </div>
              ) : (
                <div className="text-muted-foreground">
                  No specific requirements provided.
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-1">Description</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {reqJob.description}
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <div className="grid gap-4">
        {groups.map((g: any) => (
          <Card key={g.jobId}>
            <CardHeader>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      {g.title}
                    </CardTitle>
                    <div className="flex items-center text-muted-foreground text-sm mt-1">
                      <MapPin className="h-3.5 w-3.5 mr-1" />
                      {g.location}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{g.status}</Badge>
                    {g.urgency && (
                      <Badge variant="secondary">{g.urgency}</Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          setReqOpen(true);
                          setReqLoading(true);
                          setReqJob(null);
                          const res = await fetch(`/api/staff/jobs/${g.jobId}`);
                          const json = await res.json().catch(() => ({}));
                          if (!res.ok)
                            throw new Error(json.error || "Failed to load job");
                          setReqJob(json.job);
                        } catch (e: any) {
                          toast.error(e.message || "Failed to load job");
                        } finally {
                          setReqLoading(false);
                        }
                      }}
                    >
                      View Job
                    </Button>
                    <Button size="sm" onClick={() => sendToEmployer(g.jobId)}>
                      <Send className="h-4 w-4 mr-1" />
                      Send to Employer
                    </Button>
                  </div>
                </div>
                {/* Per-table filters */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                  <Input
                    placeholder="Filter applicants…"
                    value={getGroupFilter(g.jobId).q}
                    onChange={(e) =>
                      setGroupFilters((prev) => ({
                        ...prev,
                        [g.jobId]: {
                          ...getGroupFilter(g.jobId),
                          q: e.target.value,
                        },
                      }))
                    }
                  />
                  <Select
                    value={getGroupFilter(g.jobId).verified}
                    onValueChange={(v: any) =>
                      setGroupFilters((prev) => ({
                        ...prev,
                        [g.jobId]: { ...getGroupFilter(g.jobId), verified: v },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Verified" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All</SelectItem>
                      <SelectItem value="YES">Verified</SelectItem>
                      <SelectItem value="NO">Unverified</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={getGroupFilter(g.jobId).status}
                    onValueChange={(v: any) =>
                      setGroupFilters((prev) => ({
                        ...prev,
                        [g.jobId]: { ...getGroupFilter(g.jobId), status: v },
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={getGroupFilter(g.jobId).from}
                    onChange={(e) =>
                      setGroupFilters((prev) => ({
                        ...prev,
                        [g.jobId]: {
                          ...getGroupFilter(g.jobId),
                          from: e.target.value,
                        },
                      }))
                    }
                  />
                  <Input
                    type="date"
                    value={getGroupFilter(g.jobId).to}
                    onChange={(e) =>
                      setGroupFilters((prev) => ({
                        ...prev,
                        [g.jobId]: {
                          ...getGroupFilter(g.jobId),
                          to: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={
                            g.applicants
                              .filter((a: any) => {
                                const gf = getGroupFilter(g.jobId);
                                const q = gf.q?.trim().toLowerCase();
                                if (
                                  q &&
                                  !(
                                    `${a.employeeName}`
                                      .toLowerCase()
                                      .includes(q) ||
                                    `${a.employeeEmail}`
                                      .toLowerCase()
                                      .includes(q)
                                  )
                                )
                                  return false;
                                if (
                                  gf.verified !== "ALL" &&
                                  (a.portfolio?.verified ? "YES" : "NO") !==
                                    gf.verified
                                )
                                  return false;
                                if (
                                  gf.status !== "ALL" &&
                                  a.status !== gf.status
                                )
                                  return false;
                                if (gf.from) {
                                  const from = new Date(gf.from).getTime();
                                  const ap = a.appliedAt
                                    ? new Date(a.appliedAt).getTime()
                                    : 0;
                                  if (!ap || ap < from) return false;
                                }
                                if (gf.to) {
                                  const to = new Date(gf.to).getTime();
                                  const ap = a.appliedAt
                                    ? new Date(a.appliedAt).getTime()
                                    : 0;
                                  if (!ap || ap > to + 24 * 3600 * 1000 - 1)
                                    return false;
                                }
                                return true;
                              })
                              .every((a: any) => selected[a.applicationId]) &&
                            g.applicants.length > 0
                          }
                          onCheckedChange={(v: any) => {
                            const gf = getGroupFilter(g.jobId);
                            const next = { ...selected };
                            g.applicants.forEach((a: any) => {
                              // only toggle visible rows according to filters
                              const q = gf.q?.trim().toLowerCase();
                              let visible = true;
                              if (
                                q &&
                                !(
                                  `${a.employeeName}`
                                    .toLowerCase()
                                    .includes(q) ||
                                  `${a.employeeEmail}`.toLowerCase().includes(q)
                                )
                              )
                                visible = false;
                              if (
                                gf.verified !== "ALL" &&
                                (a.portfolio?.verified ? "YES" : "NO") !==
                                  gf.verified
                              )
                                visible = false;
                              if (gf.status !== "ALL" && a.status !== gf.status)
                                visible = false;
                              if (gf.from) {
                                const from = new Date(gf.from).getTime();
                                const ap = a.appliedAt
                                  ? new Date(a.appliedAt).getTime()
                                  : 0;
                                if (!ap || ap < from) visible = false;
                              }
                              if (gf.to) {
                                const to = new Date(gf.to).getTime();
                                const ap = a.appliedAt
                                  ? new Date(a.appliedAt).getTime()
                                  : 0;
                                if (!ap || ap > to + 24 * 3600 * 1000 - 1)
                                  visible = false;
                              }
                              if (visible) next[a.applicationId] = !!v;
                            });
                            setSelected(next);
                          }}
                          aria-label="Select all visible"
                        />
                      </TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {g.applicants
                      .filter((a: any) => {
                        const gf = getGroupFilter(g.jobId);
                        const q = gf.q?.trim().toLowerCase();
                        if (
                          q &&
                          !(
                            `${a.employeeName}`.toLowerCase().includes(q) ||
                            `${a.employeeEmail}`.toLowerCase().includes(q)
                          )
                        )
                          return false;
                        if (
                          gf.verified !== "ALL" &&
                          (a.portfolio?.verified ? "YES" : "NO") !== gf.verified
                        )
                          return false;
                        if (gf.status !== "ALL" && a.status !== gf.status)
                          return false;
                        if (gf.from) {
                          const from = new Date(gf.from).getTime();
                          const ap = a.appliedAt
                            ? new Date(a.appliedAt).getTime()
                            : 0;
                          if (!ap || ap < from) return false;
                        }
                        if (gf.to) {
                          const to = new Date(gf.to).getTime();
                          const ap = a.appliedAt
                            ? new Date(a.appliedAt).getTime()
                            : 0;
                          if (!ap || ap > to + 24 * 3600 * 1000 - 1)
                            return false;
                        }
                        return true;
                      })
                      .map((a: any) => (
                        <TableRow key={a.applicationId}>
                          <TableCell className="w-10">
                            <Checkbox
                              checked={!!selected[a.applicationId]}
                              onCheckedChange={(v: any) =>
                                setSelected((s) => ({
                                  ...s,
                                  [a.applicationId]: !!v,
                                }))
                              }
                              aria-label={`Select ${a.employeeName}`}
                            />
                          </TableCell>
                          <TableCell>{a.employeeName}</TableCell>
                          <TableCell>{a.employeeEmail}</TableCell>
                          <TableCell>
                            {a.portfolio?.verified ? (
                              <Badge>Yes</Badge>
                            ) : (
                              <Badge variant="secondary">No</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {a.appliedAt
                              ? new Date(a.appliedAt).toLocaleString()
                              : "—"}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                a.status === "PENDING" ? "secondary" : "default"
                              }
                            >
                              {a.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                try {
                                  setPortfolioOpen(true);
                                  setPortfolioLoading(true);
                                  setPortfolio(null);
                                  const res = await fetch(
                                    `/api/staff/portfolios/by-user/${encodeURIComponent(
                                      a.employeeId
                                    )}`
                                  );
                                  const json = await res
                                    .json()
                                    .catch(() => ({}));
                                  if (!res.ok)
                                    throw new Error(
                                      json.error || "Failed to load portfolio"
                                    );
                                  setPortfolio(json.portfolio);
                                } catch (e: any) {
                                  toast.error(
                                    e.message || "Failed to load portfolio"
                                  );
                                } finally {
                                  setPortfolioLoading(false);
                                }
                              }}
                            >
                              View Portfolio
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
