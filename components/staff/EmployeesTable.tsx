"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
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
import { Search, MessageSquare } from "lucide-react";

export type EmployeeRow = {
  id: string;
  fullname: string;
  email: string;
  phone?: string | null;
  role: string;
  is_active: boolean;
  created_at: string;
  certifications?: string | null;
  working_days?: string | null;
  working_shifts?: string | null;
  age?: number | null;
  sex?: string | null;
  verified?: boolean | null;
};

export default function EmployeesTable() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [role, setRole] = useState<string>("EMPLOYEE");
  const [cert, setCert] = useState<string>("");
  const [day, setDay] = useState<string>("any");
  const [shift, setShift] = useState<string>("any");
  const [sex, setSex] = useState<string>("any");
  const [verified, setVerified] = useState<string>("all");
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");

  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const [loading, setLoading] = useState<boolean>(false);

  const params = useMemo(() => {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (status) p.set("status", status);
    if (role) p.set("role", role);
    if (cert) p.set("cert", cert);
    if (day) p.set("day", day);
    if (shift) p.set("shift", shift);
    if (sex) p.set("sex", sex);
    if (verified) p.set("verified", verified);
    if (minAge) p.set("minAge", minAge);
    if (maxAge) p.set("maxAge", maxAge);
    p.set("page", String(page));
    p.set("pageSize", String(pageSize));
    return p.toString();
  }, [
    q,
    status,
    role,
    cert,
    day,
    shift,
    sex,
    verified,
    minAge,
    maxAge,
    page,
    pageSize,
  ]);

  useEffect(() => {
    const ac = new AbortController();
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/staff/employees?${params}`, {
          signal: ac.signal,
        });
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        setRows(json.data as EmployeeRow[]);
        setTotal(json.total as number);
      } catch (_) {
        if (!ac.signal.aborted) {
          setRows([]);
          setTotal(0);
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    }
    load();
    return () => ac.abort();
  }, [params]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setQ(e.target.value);
  };
  const onRoleTabChange = (v: string) => {
    setPage(1);
    setRole(v);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
          Employees
        </h1>
        <p className="text-slate-500">
          Browse and manage caregivers in the system
        </p>
      </div>

      {/* Filters Card */}
      <Card className="shadow-sm ring-1 ring-slate-200/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:flex-wrap gap-3 lg:items-center lg:justify-between">
            <div className="flex-1 flex flex-wrap gap-2 min-w-0">
              <div className="relative flex-1 min-w-[220px] max-w-full">
                <Input
                  placeholder="Search by name, email, phone"
                  value={q}
                  onChange={onSearchChange}
                  className="pl-9"
                />
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <div className="min-w-32 w-auto">
                <Select
                  value={status}
                  onValueChange={(v) => {
                    setPage(1);
                    setStatus(v);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-40 w-auto">
                <Input
                  placeholder="Certification contains"
                  value={cert}
                  onChange={(e) => {
                    setPage(1);
                    setCert(e.target.value);
                  }}
                />
              </div>
              <div className="min-w-36 w-auto">
                <Select
                  value={day}
                  onValueChange={(v) => {
                    setPage(1);
                    setDay(v);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Working Day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any day</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-36 w-auto">
                <Select
                  value={sex}
                  onValueChange={(v) => {
                    setPage(1);
                    setSex(v);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any sex</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-44 w-auto">
                <Select
                  value={shift}
                  onValueChange={(v) => {
                    setPage(1);
                    setShift(v);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Shift" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any shift</SelectItem>
                    <SelectItem value="day">Day shift</SelectItem>
                    <SelectItem value="night">Night shift</SelectItem>
                    <SelectItem value="weekend">Weekends</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-36 w-auto">
                <Select
                  value={verified}
                  onValueChange={(v) => {
                    setPage(1);
                    setVerified(v);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Verification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  placeholder="Min age"
                  value={minAge}
                  onChange={(e) => {
                    setPage(1);
                    setMinAge(e.target.value);
                  }}
                  min={0}
                />
              </div>
              <div className="w-24">
                <Input
                  type="number"
                  placeholder="Max age"
                  value={maxAge}
                  onChange={(e) => {
                    setPage(1);
                    setMaxAge(e.target.value);
                  }}
                  min={0}
                />
              </div>
            </div>

            <Tabs
              value={role}
              onValueChange={onRoleTabChange}
              className="w-full lg:w-auto shrink-0"
            >
              <TabsList>
                <TabsTrigger value="EMPLOYEE">Caregivers</TabsTrigger>
                <TabsTrigger value="EMPLOYER">Employers</TabsTrigger>
                <TabsTrigger value="STAFF">Staff</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Table Card */}
      <Card className="shadow-sm ring-1 ring-slate-200/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Employees</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border w-full overflow-x-auto">
            <Table className="min-w-[1500px] table-auto">
              <TableHeader className="sticky top-0 bg-white/90 backdrop-blur z-10">
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Sex</TableHead>
                  <TableHead>Certificates</TableHead>
                  <TableHead>Working Days</TableHead>
                  <TableHead>Shift Type</TableHead>
                  <TableHead className="text-right pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr:nth-child(even)]:bg-muted/30 [&_tr:hover]:bg-blue-50/50">
                {rows.map((r, i) => (
                  <TableRow key={r.id}>
                    <TableCell className="text-center text-muted-foreground">
                      {(page - 1) * pageSize + i + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {r.fullname?.slice(0, 1)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="leading-tight">
                          <div className="font-medium">{r.fullname}</div>
                          <div className="text-xs text-muted-foreground hidden sm:block">
                            {r.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {r.email}
                    </TableCell>
                    <TableCell>{r.phone ?? "—"}</TableCell>
                    <TableCell className="uppercase text-[11px] tracking-wide text-muted-foreground">
                      {r.role}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {r.verified == null ? (
                        <span className="text-slate-400">—</span>
                      ) : r.verified ? (
                        <Badge className="rounded-full">Yes</Badge>
                      ) : (
                        <Badge variant="secondary" className="rounded-full">
                          No
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {r.is_active ? (
                        <Badge className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </Badge>
                      ) : (
                        <Badge className="rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{r.age ?? "—"}</TableCell>
                    <TableCell className="capitalize">{r.sex ?? "—"}</TableCell>
                    <TableCell
                      className="max-w-[240px] truncate"
                      title={r.certifications || undefined}
                    >
                      {r.certifications || "—"}
                    </TableCell>
                    <TableCell
                      className="max-w-[200px] truncate"
                      title={r.working_days || undefined}
                    >
                      {r.working_days || "—"}
                    </TableCell>
                    <TableCell
                      className="max-w-[200px] truncate"
                      title={r.working_shifts || undefined}
                    >
                      {r.working_shifts || "—"}
                    </TableCell>
                    <TableCell className="text-right pr-4 whitespace-nowrap">
                      <Button
                        asChild
                        size="sm"
                        variant="outline"
                        className="gap-1.5"
                      >
                        <Link
                          href={`/staff/messages?to=${encodeURIComponent(
                            r.email
                          )}`}
                        >
                          <MessageSquare className="h-4 w-4" />
                          Send Message
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={14}
                      className="text-center text-muted-foreground"
                    >
                      {loading ? "Loading..." : "No results"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500">
              Page {page} of {totalPages} • {total} total
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-disabled={page <= 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-disabled={page >= totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
