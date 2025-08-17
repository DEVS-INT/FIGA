"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Check, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { StaffHeader } from "@/components/staff";

export default function PortfoliosVerify() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/staff/portfolios");
        if (!res.ok) throw new Error("Failed to fetch portfolios");
        const json = await res.json();
        setRows(json.portfolios || []);
      } catch (e) {
        toast.error("Failed to load portfolios");
      } finally {
        setLoading(false);
      }
    };
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

  if (loading)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading…
      </div>
    );

  return (
    <div className="space-y-4">
      <StaffHeader
        title="Verify Portfolios"
        subtitle="Review and verify caregiver portfolios."
      />
      <div className="grid gap-3">
        {rows.map((row) => (
          <Card key={row.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{row.user.fullname}</CardTitle>
                <Badge variant={row.is_verified ? "default" : "secondary"}>
                  {row.is_verified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-muted-foreground">
                {row.phone_no} • {row.english_skill}
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => verify(row.id, false)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Unverify
                </Button>
                <Button size="sm" onClick={() => verify(row.id, true)}>
                  <Check className="h-4 w-4 mr-1" />
                  Verify
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
