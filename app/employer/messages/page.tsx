"use client";

import { useEffect, useMemo, useState } from "react";
import { Section, Container } from "@/components/common";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  Mail,
  Eye,
  CheckCircle,
  MessageSquare,
  User,
  MapPin,
  Phone,
  GraduationCap,
  BadgeCheck,
  AlertCircle,
  Search,
  Filter,
  Trash2,
  CheckCheck,
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageItem {
  id: number;
  subject: string | null;
  body: string;
  created_at: string;
  read_at: string | null;
  job?: { id: number; title: string } | null;
  from_user: { id: string; fullname: string; email: string };
}

export default function EmployerMessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState<string | "all">("all");
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobForResume, setJobForResume] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const unreadCount = useMemo(
    () => messages.filter((m) => !m.read_at).length,
    [messages]
  );

  const availableJobs = useMemo(() => {
    const map = new Map<number, string>();
    messages.forEach((m) => {
      if (m.job) map.set(m.job.id, m.job.title);
    });
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [messages]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return messages.filter((m) => {
      if (jobFilter !== "all" && m.job?.id !== Number(jobFilter)) return false;
      if (!q) return true;
      const hay = `${m.subject ?? ""} ${m.body} ${m.from_user.fullname} ${
        m.job?.title ?? ""
      }`.toLowerCase();
      return hay.includes(q);
    });
  }, [messages, jobFilter, search]);

  const allVisibleSelected = useMemo(() => {
    if (!filtered.length) return false;
    const ids = new Set(selectedIds);
    return filtered.every((m) => ids.has(m.id));
  }, [filtered, selectedIds]);

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      const visibleIds = new Set(filtered.map((m) => m.id));
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    } else {
      const merged = new Set([...selectedIds, ...filtered.map((m) => m.id)]);
      setSelectedIds(Array.from(merged));
    }
  };

  const deleteMessage = async (id: number) => {
    try {
      const res = await fetch(`/api/employer/messages/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || "Failed to delete message");
      }
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted");
    } catch (e: any) {
      toast.error(e.message || "Could not delete message");
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/employer/messages?unreadOnly=${unreadOnly}`
      );
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data.data);
      // Reset selection on refresh
      setSelectedIds([]);
    } catch (e) {
      toast.error("Failed to load messages");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const openResumeForJob = async (
    job: { id: number; title: string },
    ids?: number[]
  ) => {
    try {
      setResumeOpen(true);
      setResumeLoading(true);
      setCandidates([]);
      setJobForResume(job);
      const qs =
        ids && ids.length ? `?ids=${encodeURIComponent(ids.join(","))}` : "";
      const res = await fetch(`/api/employer/jobs/${job.id}/candidates${qs}`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Failed to load candidates");
      setCandidates(json.data || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load candidates");
    } finally {
      setResumeLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unreadOnly]);

  const markAsRead = async (id: number) => {
    try {
      const res = await fetch(`/api/employer/messages/${id}`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, read_at: new Date().toISOString() } : m
        )
      );
      toast.success("Marked as read");
    } catch (e) {
      toast.error("Could not mark as read");
    }
  };

  const bulkMarkRead = async () => {
    if (!selectedIds.length) return;
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/employer/messages/${id}`, { method: "PATCH" })
        )
      );
      setMessages((prev) =>
        prev.map((m) =>
          selectedIds.includes(m.id)
            ? { ...m, read_at: new Date().toISOString() }
            : m
        )
      );
      setSelectedIds([]);
      toast.success("Selected messages marked as read");
    } catch {
      toast.error("Failed to mark some messages");
    }
  };

  const bulkDelete = async () => {
    if (!selectedIds.length) return;
    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/employer/messages/${id}`, { method: "DELETE" })
        )
      );
      setMessages((prev) => prev.filter((m) => !selectedIds.includes(m.id)));
      setSelectedIds([]);
      toast.success("Selected messages deleted");
    } catch {
      toast.error("Failed to delete some messages");
    }
  };

  const formatHeading = (iso: string) => {
    const d = new Date(iso);
    const today = new Date();
    const y = new Date();
    y.setDate(today.getDate() - 1);
    const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
    if (sameDay(d, today)) return "Today";
    if (sameDay(d, y)) return "Yesterday";
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Section padding="sm">
      <Container size="xl">
        {/* Hero header */}
        <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400 opacity-10" />
          <div className="relative p-6 md:p-8 flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Inbox
              </h1>
              <p className="text-slate-600 mt-1">
                Messages from staff about your jobs
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                Unread: {unreadCount}
              </Badge>
              <Link href="/employer/dashboard">
                <Button variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" /> Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
          <div className="flex items-center gap-2 flex-1">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subject, sender, content..."
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 bg-white">
                <Filter className="h-4 w-4 text-slate-600" />
                <select
                  className="text-sm outline-none bg-transparent"
                  value={jobFilter}
                  onChange={(e) => setJobFilter(e.target.value as any)}
                >
                  <option value="all">All jobs</option>
                  {availableJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title}
                    </option>
                  ))}
                </select>
              </div>
              <Button
                variant={unreadOnly ? "default" : "outline"}
                onClick={() => setUnreadOnly(!unreadOnly)}
              >
                <Mail className="w-4 h-4 mr-2" />
                {unreadOnly ? "Showing Unread" : "Show Unread"}
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-2 py-1.5 rounded-md border bg-white">
              <Checkbox
                id="select-all"
                checked={allVisibleSelected}
                onCheckedChange={() => toggleSelectAll()}
              />
              <Label htmlFor="select-all" className="text-sm cursor-pointer">
                Select all
              </Label>
            </div>
            <Button
              variant="outline"
              onClick={bulkMarkRead}
              disabled={!selectedIds.length}
            >
              <CheckCheck className="w-4 h-4 mr-2" /> Mark read
            </Button>
            <Button
              variant="destructive"
              onClick={bulkDelete}
              disabled={!selectedIds.length}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-slate-600">
              No messages
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filtered.map((m, idx) => {
              const picks: { id: number; name: string }[] = [];
              if (m.body) {
                const lineRegex = /-\s*(.+?)\s*<[^>]+>\s*\(app\s*#(\d+)\)/gi;
                let r: RegExpExecArray | null;
                while ((r = lineRegex.exec(m.body))) {
                  const id = parseInt(r[2], 10);
                  const name = (r[1] || "").trim();
                  if (!Number.isNaN(id) && name) picks.push({ id, name });
                }
              }
              const heading = formatHeading(m.created_at);
              const showHeading =
                idx === 0 ||
                formatHeading(filtered[idx - 1].created_at) !== heading;

              return (
                <div key={m.id}>
                  {showHeading && (
                    <div className="text-xs font-semibold text-slate-500 tracking-wider uppercase mb-1 mt-2">
                      {heading}
                    </div>
                  )}
                  <Card
                    className={
                      "transition hover:shadow-sm border-l-4 " +
                      (m.read_at ? "border-l-slate-200" : "border-l-blue-500")
                    }
                  >
                    <CardHeader className="flex-row items-start justify-between space-y-0 gap-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedIds.includes(m.id)}
                          onCheckedChange={(v) =>
                            setSelectedIds((prev) =>
                              v
                                ? [...prev, m.id]
                                : prev.filter((id) => id !== m.id)
                            )
                          }
                          className="mt-1"
                        />
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {!m.read_at && (
                              <span className="inline-flex h-2 w-2 rounded-full bg-blue-600" />
                            )}
                            {m.subject ?? "Staff message"}
                          </CardTitle>
                          <CardDescription className="flex flex-wrap items-center gap-2">
                            <span>
                              From {m.from_user.fullname} •{" "}
                              {new Date(m.created_at).toLocaleString()}
                            </span>
                            {m.job && (
                              <Badge className="bg-slate-100 text-slate-700 border-slate-200">
                                {m.job.title}
                              </Badge>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {m.read_at ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Read
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                            Unread
                          </Badge>
                        )}
                        {m.job && (
                          <div className="flex gap-2">
                            <Link href={`/employer/jobs/${m.job.id}`}>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-2" /> View Job
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              onClick={() =>
                                openResumeForJob(
                                  m.job!,
                                  picks.map((p) => p.id)
                                )
                              }
                            >
                              <User className="w-4 h-4 mr-2" /> View Candidates
                            </Button>
                          </div>
                        )}
                        {!m.read_at && (
                          <Button size="sm" onClick={() => markAsRead(m.id)}>
                            <CheckCircle className="w-4 h-4 mr-2" /> Mark Read
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteMessage(m.id)}
                          title="Delete message"
                        >
                          Delete
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3">
                        <div className="flex items-start gap-3">
                          <Avatar className="size-8 border border-blue-200">
                            <AvatarImage src={""} alt={m.from_user.fullname} />
                            <AvatarFallback className="bg-blue-50 text-blue-700 font-semibold">
                              {(m.from_user.fullname?.[0] || "S").toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <pre className="whitespace-pre-wrap text-sm text-slate-700 mt-0.5">
                            {m.body}
                          </pre>
                        </div>
                        {m.job && picks.length > 0 && (
                          <div className="rounded-lg border">
                            <table className="w-full text-sm">
                              <thead className="bg-slate-50">
                                <tr>
                                  <th className="text-left p-2">Candidate</th>
                                  <th className="text-left p-2">Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {picks.map((p) => (
                                  <tr key={p.id} className="border-t">
                                    <td className="p-2">{p.name}</td>
                                    <td className="p-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() =>
                                          openResumeForJob(m.job!, [p.id])
                                        }
                                      >
                                        View Resume
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </Container>
      {/* Resume Modal */}
      <Dialog
        open={resumeOpen}
        onOpenChange={(v) => {
          setResumeOpen(v);
          if (!v) {
            setCandidates([]);
            setJobForResume(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Candidates for {jobForResume?.title}</DialogTitle>
            <DialogDescription>
              Forwarded by staff for your review
            </DialogDescription>
          </DialogHeader>
          {resumeLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading…
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-slate-600">No candidates forwarded yet.</div>
          ) : (
            <div className="space-y-4">
              {candidates.map((c) => {
                const p = c.portfolio || {};
                const verified = Boolean(p.is_verified);
                return (
                  <div key={c.id} className="rounded-2xl border p-4">
                    {/* Header with avatar and badges */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-10 border border-blue-200">
                          <AvatarImage src={""} alt={c.employee.fullname} />
                          <AvatarFallback className="bg-blue-50 text-blue-700 font-semibold">
                            {(c.employee.fullname?.[0] || "C").toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="leading-tight">
                          <div className="text-base font-semibold flex items-center gap-2">
                            <User className="h-5 w-5 text-blue-600" />
                            {c.employee.fullname}
                          </div>
                          {c.employee.email && (
                            <div className="text-sm text-slate-600 inline-flex items-center gap-2">
                              <Mail className="h-4 w-4" /> {c.employee.email}
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          verified
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }
                      >
                        {verified ? (
                          <span className="inline-flex items-center gap-1">
                            <BadgeCheck className="h-4 w-4" /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" /> Unverified
                          </span>
                        )}
                      </Badge>
                    </div>

                    {/* Info grid */}
                    {p ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 text-slate-700 text-sm">
                        <div className="space-y-1">
                          <div className="text-slate-500">Phone</div>
                          <div className="inline-flex items-center gap-2 font-medium">
                            <Phone className="h-4 w-4 text-blue-600" />{" "}
                            {c.employee?.phone || "—"}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-slate-500">English Skill</div>
                          <div className="font-medium">
                            {p.english_skill || "—"}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-slate-500">Sex</div>
                          <div className="font-medium">{p.sex || "—"}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-slate-500">Experience State</div>
                          <div className="inline-flex items-center gap-2 font-medium">
                            <MapPin className="h-4 w-4 text-green-600" />
                            {p.state_where_experience_gained || "—"}
                          </div>
                        </div>
                        {p.suitable_work_days && (
                          <div className="space-y-1">
                            <div className="text-slate-500">
                              Suitable Work Days
                            </div>
                            <div className="font-medium">
                              {p.suitable_work_days}
                            </div>
                          </div>
                        )}
                        {p.suitable_work_shift && (
                          <div className="space-y-1">
                            <div className="text-slate-500">
                              Suitable Work Shift
                            </div>
                            <div className="font-medium">
                              {p.suitable_work_shift}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-slate-600 mt-3">
                        No portfolio on file
                      </div>
                    )}

                    {/* Education */}
                    {(p.university_college || p.study_field || p.degree) && (
                      <div className="rounded-md border p-3 mt-4">
                        <div className="font-medium flex items-center gap-2 mb-1">
                          <GraduationCap className="h-4 w-4 text-blue-600" />{" "}
                          Education
                        </div>
                        <div className="text-sm text-slate-700 space-y-1">
                          {p.university_college && (
                            <div>School: {p.university_college}</div>
                          )}
                          {p.study_field && <div>Field: {p.study_field}</div>}
                          {p.degree && <div>Degree: {p.degree}</div>}
                        </div>
                      </div>
                    )}

                    {/* Experience & Certifications */}
                    {(p.experience || p.certifications) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {p.experience && (
                          <div className="rounded-md border p-3">
                            <div className="font-medium mb-1">Experience</div>
                            <div className="text-sm text-slate-700 whitespace-pre-wrap">
                              {p.experience}
                            </div>
                          </div>
                        )}
                        {p.certifications && (
                          <div className="rounded-md border p-3">
                            <div className="font-medium mb-1">
                              Certifications
                            </div>
                            <div className="text-sm text-slate-700 whitespace-pre-wrap">
                              {p.certifications}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-slate-500 mt-3">
                      Forwarded {new Date(c.forwardedAt).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
