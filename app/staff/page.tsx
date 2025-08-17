"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Briefcase,
  UserPlus,
  ClipboardList,
  CheckCircle,
  XCircle,
  Mail,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { StaffHeader } from "@/components/staff";

export default function StaffDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <StaffHeader
          title="Staff Dashboard"
          subtitle="Curate candidates, manage jobs, and communicate with employers."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Applicants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              Filter applicants and forward to employers.
            </p>
            <Link href="/staff/applicants">
              <Button className="w-full">Open Applicants</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Jobs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              Approve/Reject jobs or post on behalf of employers.
            </p>
            <div className="flex gap-2">
              <Link href="/staff/jobs">
                <Button className="flex-1">Manage Jobs</Button>
              </Link>
              <Link href="/staff/jobs/new">
                <Button variant="outline" className="flex-1">
                  Post Job
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Employers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              Create employer accounts for new clients.
            </p>
            <Link href="/staff/employers/new">
              <Button className="w-full">Create Employer</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Portfolios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              Verify employee accounts via their portfolios.
            </p>
            <Link href="/staff/portfolios">
              <Button className="w-full">Verify Portfolios</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">
              Send acceptance or rejection messages.
            </p>
            <Link href="/staff/messages">
              <Button className="w-full">Open Messages</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
