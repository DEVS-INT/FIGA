"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Users,
  Briefcase,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

// Data shapes from existing staff APIs
type Applicant = {
  applicationId: number;
  jobId: number;
  jobTitle: string;
  jobLocation: string;
  jobStatus: string;
  jobUrgency?: string | null;
  appliedAt?: string | Date | null;
  employeeId: number;
  employeeName: string;
  employeeEmail: string;
  status: string;
  portfolio?: { verified?: boolean | null } | null;
};

type Job = {
  id: number;
  title: string;
  status: "PENDING" | "REJECTED" | "APPROVED" | string;
  posted_at?: string | Date | null;
  employer?: { fullname: string; email: string } | null;
};

type Portfolio = {
  id: number;
  is_verified: boolean;
  user: { fullname: string; email: string };
};

export default function StaffDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [aRes, jRes, pRes] = await Promise.all([
          fetch("/api/staff/applicants").then((r) =>
            r.json().catch(() => ({ applicants: [] }))
          ),
          fetch("/api/staff/jobs").then((r) =>
            r.json().catch(() => ({ jobs: [] }))
          ),
          fetch("/api/staff/portfolios").then((r) =>
            r.json().catch(() => ({ portfolios: [] }))
          ),
        ]);
        if (!mounted) return;
        if (
          aRes.error === "Unauthorized" ||
          jRes.error === "Unauthorized" ||
          pRes.error === "Unauthorized"
        ) {
          setError("Unauthorized");
        } else {
          setApplicants(aRes.applicants ?? []);
          setJobs(jRes.jobs ?? []);
          setPortfolios(pRes.portfolios ?? []);
        }
      } catch (e) {
        if (!mounted) return;
        setError("Failed to load dashboard data");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Computed stats & lists
  const stats = useMemo(() => {
    const totalApplicants = applicants.length;
    const pendingJobs = jobs.filter((j) => j.status === "PENDING").length;
    const rejectedJobs = jobs.filter((j) => j.status === "REJECTED").length;
    const verified = portfolios.filter((p) => p.is_verified).length;
    const unverified = portfolios.length - verified;
    return { totalApplicants, pendingJobs, rejectedJobs, verified, unverified };
  }, [applicants, jobs, portfolios]);

  const recentApplicants = useMemo(() => {
    return [...applicants]
      .sort(
        (a, b) =>
          new Date(b.appliedAt || 0).getTime() -
          new Date(a.appliedAt || 0).getTime()
      )
      .slice(0, 5);
  }, [applicants]);

  const jobsNeedingReview = useMemo(() => jobs.slice(0, 5), [jobs]);
  const verificationQueue = useMemo(
    () => portfolios.filter((p) => !p.is_verified).slice(0, 5),
    [portfolios]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading dashboard…
      </div>
    );
  }

  if (error === "Unauthorized") {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Unauthorized</h1>
        <p className="text-muted-foreground mb-4">
          You need a staff account to view this dashboard.
        </p>
        <Button asChild>
          <Link href="/signin">Go to Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Staff Dashboard
          </h1>
          <p className="text-muted-foreground">
            Review activity, manage approvals, and track verification.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="brand">
            <Link href="/staff/applicants">Applicants</Link>
          </Button>
          <Button asChild variant="brand">
            <Link href="/staff/jobs">Jobs</Link>
          </Button>
          <Button asChild variant="brand">
            <Link href="/staff/portfolios">Portfolios</Link>
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applicants
            </CardTitle>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center shadow">
              <Users className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalApplicants}</div>
            <p className="text-xs text-muted-foreground">
              Across approved jobs
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Jobs</CardTitle>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center shadow">
              <Briefcase className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.pendingJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.rejectedJobs} rejected
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Verified Portfolios
            </CardTitle>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center shadow">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.verified}</div>
            <p className="text-xs text-muted-foreground">
              {stats.unverified} pending verification
            </p>
          </CardContent>
        </Card>

        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Attention Needed
            </CardTitle>
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center shadow">
              <AlertCircle className="h-5 w-5" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.pendingJobs + stats.unverified}
            </div>
            <p className="text-xs text-muted-foreground">
              Jobs to review + portfolios to verify
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Rows */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Recent Applicants */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Verified</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentApplicants.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground"
                      >
                        No applicants yet.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentApplicants.map((a) => (
                      <TableRow key={a.applicationId}>
                        <TableCell>{a.employeeName}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {a.employeeEmail}
                        </TableCell>
                        <TableCell>{a.jobTitle}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {a.appliedAt
                            ? new Date(a.appliedAt).toLocaleString()
                            : "—"}
                        </TableCell>
                        <TableCell>
                          {a.portfolio?.verified ? (
                            <Badge>Yes</Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-3 text-right">
              <Button variant="outline" asChild>
                <Link href="/staff/applicants">View all applicants</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Verification Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Verification Queue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {verificationQueue.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No pending portfolios.
                </div>
              ) : (
                verificationQueue.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between border rounded-md p-3"
                  >
                    <div>
                      <div className="font-medium">{p.user.fullname}</div>
                      <div className="text-sm text-muted-foreground">
                        {p.user.email}
                      </div>
                    </div>
                    <Badge variant="secondary">Unverified</Badge>
                  </div>
                ))
              )}
            </div>
            <div className="mt-3 text-right">
              <Button asChild variant="brand">
                <Link href="/staff/portfolios">Open portfolios</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs Needing Review */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs Needing Review</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Posted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobsNeedingReview.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      Nothing to review.
                    </TableCell>
                  </TableRow>
                ) : (
                  jobsNeedingReview.map((j) => (
                    <TableRow key={j.id}>
                      <TableCell className="font-medium">{j.title}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            j.status === "PENDING" ? "secondary" : "destructive"
                          }
                        >
                          {j.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {j.employer?.fullname}{" "}
                        {j.employer?.email ? `(${j.employer.email})` : ""}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {j.posted_at
                          ? new Date(j.posted_at as any).toLocaleString()
                          : "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-3 text-right">
            <Button variant="outline" asChild>
              <Link href="/staff/jobs">Manage jobs</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
