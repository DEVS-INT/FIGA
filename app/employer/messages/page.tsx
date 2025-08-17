"use client";

import { useEffect, useState } from "react";
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
import {
  Loader2,
  Mail,
  Eye,
  CheckCircle,
  MessageSquare,
  User,
  MapPin,
  Phone,
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
  const [resumeOpen, setResumeOpen] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [jobForResume, setJobForResume] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/employer/messages?unreadOnly=${unreadOnly}`
      );
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data.data);
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

  return (
    <Section padding="sm">
      <Container size="xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Inbox</h1>
            <p className="text-slate-600">
              Messages from staff about your jobs
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={unreadOnly ? "default" : "outline"}
              onClick={() => setUnreadOnly(!unreadOnly)}
            >
              <Mail className="w-4 h-4 mr-2" />
              {unreadOnly ? "Showing Unread" : "Show Unread"}
            </Button>
            <Link href="/employer/dashboard">
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" /> Dashboard
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-slate-600">
              No messages
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {messages.map((m) => {
              // Extract candidate name and application ID from message lines like:
              // "- John Doe <john@example.com> (app #123)"
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
              return (
                <Card key={m.id} className="hover:shadow-sm transition">
                  <CardHeader className="flex-row items-center justify-between space-y-0">
                    <div>
                      <CardTitle className="text-lg">
                        {m.subject ?? "Staff message"}
                      </CardTitle>
                      <CardDescription>
                        From {m.from_user.fullname} •{" "}
                        {new Date(m.created_at).toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {m.read_at ? (
                        <Badge className="bg-green-100 text-green-700 border border-green-200">
                          Read
                        </Badge>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
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
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <pre className="whitespace-pre-wrap text-sm text-slate-700">
                        {m.body}
                      </pre>
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
              {candidates.map((c) => (
                <div key={c.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">
                        {c.employee.fullname}
                      </div>
                      <div className="text-sm text-slate-600">
                        {c.employee.email}
                      </div>
                    </div>
                    <Badge
                      variant={
                        c.portfolio?.is_verified ? "default" : "secondary"
                      }
                    >
                      {c.portfolio?.is_verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                  {c.portfolio ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 text-slate-700">
                      <div>
                        <Phone className="inline w-4 h-4 mr-1 text-blue-600" />
                        {c.portfolio.phone_no}
                      </div>
                      <div>
                        <MapPin className="inline w-4 h-4 mr-1 text-green-600" />
                        {c.portfolio.state_where_experience_gained || "—"}
                      </div>
                      <div>Sex: {c.portfolio.sex}</div>
                      <div>English: {c.portfolio.english_skill}</div>
                      {c.portfolio.suitable_work_shift && (
                        <div>Shift: {c.portfolio.suitable_work_shift}</div>
                      )}
                      {c.portfolio.suitable_work_days && (
                        <div>Days: {c.portfolio.suitable_work_days}</div>
                      )}
                    </div>
                  ) : (
                    <div className="text-slate-600 mt-3">
                      No portfolio on file
                    </div>
                  )}
                  {c.portfolio?.experience && (
                    <div className="mt-3">
                      <div className="font-semibold mb-1">Experience</div>
                      <p className="text-slate-700 whitespace-pre-wrap">
                        {c.portfolio.experience}
                      </p>
                    </div>
                  )}
                  {c.portfolio?.certifications && (
                    <div className="mt-3">
                      <div className="font-semibold mb-1">Certifications</div>
                      <p className="text-slate-700 whitespace-pre-wrap">
                        {c.portfolio.certifications}
                      </p>
                    </div>
                  )}
                  <div className="text-xs text-slate-500 mt-3">
                    Forwarded {new Date(c.forwardedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
}
