"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { StaffHeader } from "@/components/staff";

export default function NewEmployerPage() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("/api/staff/employers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Failed to create employer");
      toast.success("Employer created");
      setFullname("");
      setEmail("");
      setPassword("");
    } catch (e: any) {
      toast.error(e.message || "Failed to create employer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-xl">
      <StaffHeader
        title="New Employer"
        subtitle="Create an employer account for a client."
      />
      <Card>
        <CardHeader>
          <CardTitle>Create Employer Account</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Full name
              </label>
              <Input
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-muted-foreground">
                Temp Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button variant="brand" type="submit" disabled={loading} className="w-full">
              {loading ? "Creating…" : "Create Employer"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
