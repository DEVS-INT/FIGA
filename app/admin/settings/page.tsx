"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminSettingsPage() {
  const STORAGE_KEY = "figa:sessionTimeoutMs";
  const DEFAULT_MINUTES = 30;
  const [timeoutMinutes, setTimeoutMinutes] = useState<number>(DEFAULT_MINUTES);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const n = parseInt(raw, 10);
        if (Number.isFinite(n) && n > 0)
          setTimeoutMinutes(Math.round(n / 60000));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  function saveTimeout() {
    try {
      const ms = Math.max(1, Math.round(timeoutMinutes)) * 60000;
      localStorage.setItem(STORAGE_KEY, String(ms));
      // reload so watcher picks up immediately in some cases
      // (storage event will notify other tabs)
      // keep on the page but show a quick toast would be nicer; keep simple for now
    } catch (e) {
      // ignore
    }
  }
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-600 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-slate-500">
          Configure platform settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm ring-1 ring-slate-200/60">
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Platform Name</Label>
              <Input placeholder="FIGA Care" />
            </div>
            <div className="space-y-2">
              <Label>Support Email</Label>
              <Input placeholder="support@figa.care" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="block">Maintenance Mode</Label>
                <span className="text-sm text-slate-500">
                  Temporarily disable public access
                </span>
              </div>
              <Switch />
            </div>
            <Button variant="brand" className="mt-2">
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-sm ring-1 ring-slate-200/60">
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="block">Two-Factor Authentication</Label>
                <span className="text-sm text-slate-500">
                  Require 2FA for admin users
                </span>
              </div>
              <Switch />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="block">Session Timeout (minutes)</Label>
                  <span className="text-sm text-slate-500">
                    Auto logout after inactivity
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min={1}
                    className="w-24"
                    value={timeoutMinutes}
                    onChange={(e) => setTimeoutMinutes(Number(e.target.value))}
                  />
                  <Button variant="brand" onClick={saveTimeout}>
                    Save
                  </Button>
                </div>
              </div>
              <p className="text-sm text-slate-500">
                Current: {timeoutMinutes} minute
                {timeoutMinutes !== 1 ? "s" : ""}
              </p>
            </div>
            <Button variant="outline">Rotate API Keys</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
