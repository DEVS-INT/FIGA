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
  const [jobStatus, setJobStatus] = useState<string>("ALL");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [shift, setShift] = useState<string>("ALL");
  const [selected, setSelected] = useState<Record<number, boolean>>({}); // applicationId -> selected

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
    if (jobStatus !== "ALL" && r.jobStatus !== jobStatus) return false;
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
          <Select value={jobStatus} onValueChange={setJobStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Job Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
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
            <DialogTitle>Employee Portfolio</DialogTitle>
            <DialogDescription>
              Review candidate details before forwarding.
            </DialogDescription>
          </DialogHeader>
          {portfolioLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading…
            </div>
          ) : portfolio ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-semibold">
                    {portfolio.user.fullname}
                  </div>
                  <div className="text-slate-600 text-sm">
                    {portfolio.user.email}
                  </div>
                </div>
                <Badge
                  variant={portfolio.is_verified ? "default" : "secondary"}
                >
                  {portfolio.is_verified ? "Verified" : "Unverified"}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                <div>Phone: {portfolio.phone_no}</div>
                <div>Sex: {portfolio.sex}</div>
                <div>English: {portfolio.english_skill}</div>
                <div>Comfortability: {portfolio.comfortability}</div>
                {portfolio.state_where_experience_gained && (
                  <div>
                    Experience State: {portfolio.state_where_experience_gained}
                  </div>
                )}
                {portfolio.suitable_work_days && (
                  <div>Work Days: {portfolio.suitable_work_days}</div>
                )}
                {portfolio.suitable_work_shift && (
                  <div>Work Shift: {portfolio.suitable_work_shift}</div>
                )}
              </div>
              {portfolio.experience && (
                <div>
                  <div className="font-semibold mb-1">Experience</div>
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {portfolio.experience}
                  </p>
                </div>
              )}
              {portfolio.certifications && (
                <div>
                  <div className="font-semibold mb-1">Certifications</div>
                  <p className="text-slate-700 whitespace-pre-wrap">
                    {portfolio.certifications}
                  </p>
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
                  {g.urgency && <Badge variant="secondary">{g.urgency}</Badge>}
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
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox
                          checked={
                            g.applicants.every(
                              (a: any) => selected[a.applicationId]
                            ) && g.applicants.length > 0
                          }
                          onCheckedChange={(v: any) => {
                            const next = { ...selected };
                            g.applicants.forEach((a: any) => {
                              next[a.applicationId] = !!v;
                            });
                            setSelected(next);
                          }}
                          aria-label="Select all"
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
                    {g.applicants.map((a: any) => (
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
                                const json = await res.json().catch(() => ({}));
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
