"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus } from "lucide-react";
import { BRAND } from "zod";

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("ALL");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await fetch("/api/admin/jobs", { cache: "no-store" });
        const json = await res.json();
        if (!cancelled) setJobs(json?.data ?? []);
      } catch {}
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return jobs.filter((j) => {
      const matchesText =
        !term ||
        `${j.title} ${j.employer?.fullname}`.toLowerCase().includes(term);
      const matchesStatus = status === "ALL" || j.status === status;
      return matchesText && matchesStatus;
    });
  }, [jobs, q, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
            Jobs
          </h1>
          <p className="text-slate-500">
            Review and manage job postings across the platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="brand" className="gap-2">
            <Plus className="h-4 w-4" /> New Job
          </Button>
        </div>
      </div>

      <Card className="shadow-sm ring-1 ring-slate-200/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">All Jobs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 items-center">
            <div className="relative flex-1">
              <Input
                placeholder="Search jobs"
                className="pl-9"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <Button
              variant={status === "ALL" ? "brand" : "outline"}
              onClick={() => setStatus("ALL")}
            >
              All
            </Button>
            <Button
              variant={status === "PENDING" ? "brand" : "outline"}
              onClick={() => setStatus("PENDING")}
            >
              Pending
            </Button>
            <Button
              variant={status === "APPROVED" ? "brand" : "outline"}
              onClick={() => setStatus("APPROVED")}
            >
              Approved
            </Button>
            <Button
              variant={status === "COMPLETED" ? "brand" : "outline"}
              onClick={() => setStatus("COMPLETED")}
            >
              Completed
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Posted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((j) => (
                  <TableRow key={j.id}>
                    <TableCell className="font-medium">{j.title}</TableCell>
                    <TableCell>{j.employer?.fullname}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {j.shift_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          j.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : j.status === "PENDING"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : j.status === "COMPLETED"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-slate-50 text-slate-700 border border-slate-200"
                        }
                      >
                        {j.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(j.posted_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-slate-500"
                    >
                      No jobs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
