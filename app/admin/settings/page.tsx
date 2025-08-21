"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AdminSettingsPage() {
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
            <Button variant="brand" className="mt-2">Save Changes</Button>
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
            <div className="flex items-center justify-between">
              <div>
                <Label className="block">Session Timeout</Label>
                <span className="text-sm text-slate-500">
                  Auto logout after inactivity
                </span>
              </div>
              <Input className="w-24" placeholder="30m" />
            </div>
            <Button variant="outline">Rotate API Keys</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
