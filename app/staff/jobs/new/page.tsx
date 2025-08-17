"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { StaffHeader } from "@/components/staff";

export default function StaffPostJob() {
  const [form, setForm] = useState({
    employerEmail: "",
    title: "",
    location: "",
    schedule_start: "",
    schedule_end: "",
    shift_type: "Day",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/staff/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Failed to post job");
      toast.success("Job posted");
      setForm({
        employerEmail: "",
        title: "",
        location: "",
        schedule_start: "",
        schedule_end: "",
        shift_type: "Day",
        description: "",
      });
    } catch (e: any) {
      toast.error(e.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <StaffHeader
        title="Post Job"
        subtitle="Create a job on behalf of an employer."
      />
      <Card>
        <CardHeader>
          <CardTitle>Post Job for Employer</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Employer Email
              </label>
              <Input
                value={form.employerEmail}
                onChange={(e) =>
                  setForm({ ...form, employerEmail: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Title
                </label>
                <Input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Location
                </label>
                <Input
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  Start
                </label>
                <Input
                  type="datetime-local"
                  value={form.schedule_start}
                  onChange={(e) =>
                    setForm({ ...form, schedule_start: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-muted-foreground">
                  End
                </label>
                <Input
                  type="datetime-local"
                  value={form.schedule_end}
                  onChange={(e) =>
                    setForm({ ...form, schedule_end: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Shift Type
              </label>
              <Input
                value={form.shift_type}
                onChange={(e) =>
                  setForm({ ...form, shift_type: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Description
              </label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Posting…" : "Post Job"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
