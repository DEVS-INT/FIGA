"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Filter } from "lucide-react";

export type EmployeeRow = {
  id: string;
  fullname: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  certifications?: string | null;
  working_days?: string | null;
  age?: number | null;
  sex?: string | null;
  verified?: boolean | null;
};

export default function EmployeesTable() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [role, setRole] = useState<string>("EMPLOYEE");
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [rows, setRows] = useState<EmployeeRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [cert, setCert] = useState("");
  const [day, setDay] = useState("any");
  const [sex, setSex] = useState("any");
  const [minAge, setMinAge] = useState<string>("");
  const [maxAge, setMaxAge] = useState<string>("");
  const [verified, setVerified] = useState<string>("all");

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const fetchRows = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q,
        status,
        role,
        page: String(page),
        pageSize: String(pageSize),
        cert,
        day,
        sex,
        ...(minAge ? { minAge } : {}),
        ...(maxAge ? { maxAge } : {}),
        verified,
      });
      const res = await fetch(`/api/staff/employees?${params.toString()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setRows(data?.data ?? []);
        setTotal(data?.total ?? 0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(fetchRows, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, role, page, cert, day, sex, minAge, maxAge, verified]);

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setQ(e.target.value);
  };

  const onStatusChange = (value: string) => {
    setPage(1);
    setStatus(value);
  };

  const onRoleTabChange = (value: string) => {
    setPage(1);
    setRole(value);
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

      <Card className="shadow-sm ring-1 ring-slate-200/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Input
                  placeholder="Search by name, email"
                  value={q}
                  onChange={onSearchChange}
                  className="pl-9"
                />
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <div className="min-w-40">
                <Select value={status} onValueChange={onStatusChange}>
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
              <div className="min-w-40">
                <Input
                  placeholder="Certification (e.g. CPR)"
                  value={cert}
                  onChange={(e) => {
                    setPage(1);
                    setCert(e.target.value);
                  }}
                />
              </div>
              <div className="min-w-40">
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
              <div className="min-w-32">
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
              <div className="min-w-36">
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
              className="w-full lg:w-auto"
            >
              <TabsList>
                <TabsTrigger value="EMPLOYEE">Caregivers</TabsTrigger>
                <TabsTrigger value="EMPLOYER">Employers</TabsTrigger>
                <TabsTrigger value="STAFF">Staff</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Verified</TableHead>
                  <TableHead>Certifications</TableHead>
                  <TableHead>Working Days</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Sex</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.fullname}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {r.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          r.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-50 text-slate-700 border border-slate-200"
                        }
                      >
                        {r.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {r.verified == null ? (
                        <span className="text-slate-400">—</span>
                      ) : r.verified ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-50 text-amber-700 border border-amber-200">
                          Unverified
                        </Badge>
                      )}
                    </TableCell>
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
                    <TableCell>{r.age ?? "—"}</TableCell>
                    <TableCell className="capitalize">{r.sex ?? "—"}</TableCell>
                    <TableCell>
                      {new Date(r.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center text-slate-500"
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
