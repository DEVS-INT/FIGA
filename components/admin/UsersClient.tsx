"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus, MoreHorizontal, Check, Ban, Trash2 } from "lucide-react";

export type UserRow = {
  id: string;
  fullname: string;
  email: string;
  role: string;
  created_at: string;
  is_active?: boolean;
};

export default function UsersClient({
  initialUsers,
  initialStaff,
}: {
  initialUsers: UserRow[];
  initialStaff: UserRow[];
}) {
  const [users, setUsers] = useState<UserRow[]>(initialUsers);
  const [staff, setStaff] = useState<UserRow[]>(initialStaff);
  const [role, setRole] = useState<string>("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ fullname: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const loadAll = async () => {
    const [u, s] = await Promise.all([
      fetch("/api/admin/users", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/admin/staff", { cache: "no-store" }).then((r) => r.json()),
    ]);
    setUsers(u?.data ?? []);
    setStaff(s?.data ?? []);
  };

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesRole = role === "all" || u.role === role.toUpperCase();
      const term = q.trim().toLowerCase();
      const matchesText =
        !term || `${u.fullname} ${u.email}`.toLowerCase().includes(term);
      return matchesRole && matchesText;
    });
  }, [users, role, q]);

  const createStaff = async () => {
    if (!form.fullname || !form.email || !form.password) return;
    setLoading(true);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setOpen(false);
        setForm({ fullname: "", email: "", password: "" });
        await loadAll();
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id: string, next: boolean) => {
    await fetch(`/api/admin/staff/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: next }),
    });
    await loadAll();
  };

  const removeStaff = async (id: string) => {
    await fetch(`/api/admin/staff/${id}`, { method: "DELETE" });
    await loadAll();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
            Users
          </h1>
          <p className="text-slate-500">
            Manage caregivers, employers, and staff accounts
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="brand" className="gap-2">
                <Plus  className="h-4 w-4" /> New Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Staff</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label>Full name</Label>
                  <Input
                    value={form.fullname}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, fullname: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label>Password</Label>
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, password: e.target.value }))
                    }
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={createStaff} disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-sm ring-1 ring-slate-200/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Directory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Search by name, email"
                className="pl-9"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            <Tabs
              value={role}
              onValueChange={setRole}
              className="w-full sm:w-auto "
            >
              <TabsList>
                <TabsTrigger  value="all">All</TabsTrigger>
                <TabsTrigger value="EMPLOYEE">Caregivers</TabsTrigger>
                <TabsTrigger value="EMPLOYER">Employers</TabsTrigger>
                <TabsTrigger value="STAFF">Staff</TabsTrigger>
                <TabsTrigger value="ADMIN">Admin</TabsTrigger>
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
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.fullname}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          u.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-50 text-slate-700 border border-slate-200"
                        }
                      >
                        {u.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(u.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {u.role === "STAFF" ? (
                        <div className="flex justify-end gap-2">
                          {u.is_active ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleActive(u.id, false)}
                              className="gap-1"
                            >
                              <Ban className="h-4 w-4" />
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => toggleActive(u.id, true)}
                              className="gap-1"
                            >
                              <Check className="h-4 w-4" />
                              Activate
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeStaff(u.id)}
                            className="gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      ) : (
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-slate-500"
                    >
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-slate-600 mb-2">
              Recent Staff
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {staff.slice(0, 6).map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg border p-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{s.fullname}</div>
                    <div className="text-xs text-slate-500">{s.email}</div>
                  </div>
                  <Badge
                    className={
                      s.is_active
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-50 text-slate-700 border border-slate-200"
                    }
                  >
                    {s.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
