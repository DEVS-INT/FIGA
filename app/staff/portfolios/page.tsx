"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Check,
  X,
  Search,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Filter,
  Mail,
  Phone,
  GraduationCap,
  BadgeCheck,
  User,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { StaffHeader } from "@/components/staff";
import { Input } from "@/components/ui/input";
// Status select removed — page shows only unverified portfolios
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PortfoliosVerify() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  // Removed status state; always showing unverified portfolios only
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<any | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/staff/portfolios", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch portfolios");
      const json = await res.json();
      setRows(json.portfolios || []);
    } catch (e) {
      toast.error("Failed to load portfolios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const verify = async (id: number, is_verified: boolean) => {
    try {
      const res = await fetch(`/api/staff/portfolios/${id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_verified }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Failed to update");
      setRows((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_verified } : p))
      );
      toast.success(is_verified ? "Verified" : "Unverified");
    } catch (e: any) {
      toast.error(e.message || "Failed");
    }
  };

  const stats = useMemo(() => {
    const total = rows.length;
    const verified = rows.filter((r) => r.is_verified).length;
    const unverified = total - verified;
    return { total, verified, unverified };
  }, [rows]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows.filter((r) => {
      const byStatus = !r.is_verified; // only unverified
      const byTerm = !term
        ? true
        : [r.user?.fullname, r.user?.email, r.user?.phone, r.english_skill]
            .filter(Boolean)
            .some((s: string) => s.toLowerCase().includes(term));
      return byStatus && byTerm;
    });
  }, [rows, q]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-20 text-slate-600">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-blue-600" /> Loading…
      </div>
    );

  return (
    <div className="space-y-6 p-1">
      <StaffHeader
        title="Verify Portfolios"
        subtitle="Review and verify caregiver portfolios."
      />
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Portfolios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All caregivers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {stats.verified}
            </div>
            <p className="text-xs text-muted-foreground">Trusted profiles</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {stats.unverified}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search by name, email, phone, or English level"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <Button variant="outline" className="h-10" onClick={load}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="grid gap-3">
        {filtered.map((row) => {
          const badge = row.is_verified
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : "bg-amber-50 text-amber-700 border-amber-200";
          return (
            <Card key={row.id} className="rounded-2xl">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-lg leading-tight">
                        {row.user.fullname}
                      </CardTitle>
                      <Badge variant="outline" className={badge}>
                        {row.is_verified ? (
                          <span className="inline-flex items-center gap-1">
                            <ShieldCheck className="h-4 w-4" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" /> Unverified
                          </span>
                        )}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {row.user.email}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelected(row);
                        setOpen(true);
                      }}
                    >
                      View details
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => verify(row.id, false)}
                    >
                      <X className="h-4 w-4 mr-1" /> Unverify
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => verify(row.id, true)}
                    >
                      <Check className="h-4 w-4 mr-1" /> Verify
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                  <div>Phone: {row.user?.phone || "—"}</div>
                  <div>English: {row.english_skill || "—"}</div>
                  <div>Experience: {row.experience_years ?? "—"} years</div>
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
              No portfolios match your filters
            </div>
            <div className="text-sm text-muted-foreground">
              Try adjusting search or status.
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          if (!v) setSelected(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-3">
                <Avatar className="size-10 border border-blue-200">
                  {/* image can be wired later */}
                  <AvatarImage
                    src={""}
                    alt={selected?.user?.fullname || "Employee"}
                  />
                  <AvatarFallback className="bg-blue-50 text-blue-700 font-semibold">
                    {(selected?.user?.fullname?.[0] || "E").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="inline-flex items-center gap-2 text-base font-semibold">
                    <User className="h-5 w-5 text-blue-600" />
                    {selected?.user?.fullname || "Portfolio Details"}
                  </span>
                  {selected?.user?.email && (
                    <span className="inline-flex items-center gap-2 text-slate-600 text-sm">
                      <Mail className="h-4 w-4" /> {selected.user.email}
                    </span>
                  )}
                </div>
              </div>
            </DialogTitle>
            <DialogDescription>
              {!selected?.user?.email &&
                "Review caregiver portfolio information"}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              {/* Top badges */}
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={
                    selected.is_verified
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }
                >
                  {selected.is_verified ? (
                    <span className="inline-flex items-center gap-1">
                      <BadgeCheck className="h-4 w-4" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" /> Unverified
                    </span>
                  )}
                </Badge>
                {selected.sex && (
                  <Badge variant="secondary">Sex: {selected.sex}</Badge>
                )}
                {typeof selected.age === "number" && (
                  <Badge variant="secondary">Age: {selected.age}</Badge>
                )}
              </div>

              {/* Grid fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="text-slate-500">Phone</div>
                  <div className="inline-flex items-center gap-2 font-medium">
                    <Phone className="h-4 w-4 text-blue-600" />{" "}
                    {selected.user?.phone || "—"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-500">English Skill</div>
                  <div className="font-medium">
                    {selected.english_skill || "—"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-500">Comfortability</div>
                  <div className="font-medium">
                    {selected.comfortability || "—"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-500">Experience State</div>
                  <div className="font-medium">
                    {selected.state_where_experience_gained || "—"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-500">Suitable Work Days</div>
                  <div className="font-medium">
                    {selected.suitable_work_days || "—"}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-500">Suitable Work Shift</div>
                  <div className="font-medium">
                    {selected.suitable_work_shift || "—"}
                  </div>
                </div>
              </div>

              {/* Education */}
              {(selected.university_college ||
                selected.study_field ||
                selected.degree) && (
                <div className="rounded-md border p-3">
                  <div className="font-medium flex items-center gap-2 mb-1">
                    <GraduationCap className="h-4 w-4 text-blue-600" />{" "}
                    Education
                  </div>
                  <div className="text-sm text-slate-700 space-y-1">
                    {selected.university_college && (
                      <div>School: {selected.university_college}</div>
                    )}
                    {selected.study_field && (
                      <div>Field: {selected.study_field}</div>
                    )}
                    {selected.degree && <div>Degree: {selected.degree}</div>}
                  </div>
                </div>
              )}

              {/* Experience & Certifications */}
              {(selected.experience || selected.certifications) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selected.experience && (
                    <div className="rounded-md border p-3">
                      <div className="font-medium mb-1">Experience</div>
                      <div className="text-sm text-slate-700 whitespace-pre-wrap">
                        {selected.experience}
                      </div>
                    </div>
                  )}
                  {selected.certifications && (
                    <div className="rounded-md border p-3">
                      <div className="font-medium mb-1">Certifications</div>
                      <div className="text-sm text-slate-700 whitespace-pre-wrap">
                        {selected.certifications}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Footer actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
                {selected.is_verified ? (
                  <Button
                    variant="destructive"
                    onClick={() => verify(selected.id, false)}
                  >
                    <X className="h-4 w-4 mr-1" /> Unverify
                  </Button>
                ) : (
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => verify(selected.id, true)}
                  >
                    <Check className="h-4 w-4 mr-1" /> Verify
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
