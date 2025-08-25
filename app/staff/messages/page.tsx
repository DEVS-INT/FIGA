"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { StaffHeader } from "@/components/staff";

export default function StaffMessages() {
  const params = useSearchParams();
  const [form, setForm] = useState({ toEmail: "", subject: "", body: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const to = params?.get("to") || "";
    if (to) setForm((f) => ({ ...f, toEmail: to }));
  }, [params]);

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSending(true);
      const res = await fetch("/api/staff/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Failed to send message");
      toast.success("Message sent");
      setForm({ toEmail: "", subject: "", body: "" });
    } catch (e: any) {
      toast.error(e.message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <StaffHeader title="Messages" subtitle="Send messages to employees." />
      <Card>
        <CardHeader>
          <CardTitle>Send Message to Employee</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={send} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                To (Employee Email)
              </label>
              <Input
                value={form.toEmail}
                onChange={(e) => setForm({ ...form, toEmail: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Subject
              </label>
              <Input
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Message
              </label>
              <Textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                required
              />
            </div>
            <Button
              variant="brand"
              type="submit"
              disabled={sending}
              className="w-full"
            >
              {sending ? "Sending…" : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
