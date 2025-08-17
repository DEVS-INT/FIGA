"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  Calendar,
  Clock,
  User as UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StaffHeader } from "@/components/staff";

export default function StaffJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/staff/jobs");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (e) {
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateStatus = async (id: number, status: "APPROVED" | "REJECTED") => {
    try {
      const res = await fetch(`/api/staff/jobs/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Failed to update status");
      toast.success(`Job ${status.toLowerCase()}`);
      setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
    } catch (e: any) {
      toast.error(e.message || "Failed to update status");
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
        title="Manage Jobs"
        subtitle="Review, approve or reject job postings."
      />
      {/* Details Modal */}
      <Dialog
        open={detailsOpen}
        onOpenChange={(v) => {
          setDetailsOpen(v);
          if (!v) setSelectedJob(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedJob?.title || "Job Details"}</DialogTitle>
            <DialogDescription>
              {selectedJob?.employer?.fullname ? (
                <span>
                  Posted by {selectedJob.employer.fullname} (
                  {selectedJob.employer.email})
                </span>
              ) : (
                <span>Review job information</span>
              )}
            </DialogDescription>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                  {selectedJob.location}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Badge className="mr-2" variant="secondary">
                    {selectedJob.status}
                  </Badge>
                  {selectedJob.job_urgency ? (
                    <span className="ml-1">
                      Urgency: {selectedJob.job_urgency}
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Clock className="h-4 w-4 mr-2 text-green-600" />
                  {selectedJob.shift_type}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                  {new Date(selectedJob.schedule_start).toLocaleString()} –{" "}
                  {new Date(selectedJob.schedule_end).toLocaleString()}
                </div>
                {selectedJob.deadline && (
                  <div className="flex items-center text-muted-foreground md:col-span-2">
                    <Calendar className="h-4 w-4 mr-2 text-orange-600" />
                    Deadline: {new Date(selectedJob.deadline).toLocaleString()}
                  </div>
                )}
                {selectedJob.gender_preference && (
                  <div className="flex items-center text-muted-foreground">
                    <UserIcon className="h-4 w-4 mr-2 text-rose-600" />
                    {selectedJob.gender_preference}
                  </div>
                )}
                {selectedJob.language_level_requirement && (
                  <div className="text-muted-foreground">
                    Language: {selectedJob.language_level_requirement}
                  </div>
                )}
                <div className="text-muted-foreground">
                  Driving Required:{" "}
                  {selectedJob.driving_license_required ? "Yes" : "No"}
                </div>
              </div>
              {selectedJob.job_requirements && (
                <div>
                  <h4 className="font-semibold mb-1">Requirements</h4>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {selectedJob.job_requirements}
                  </p>
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-1">Description</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {selectedJob.description}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div className="grid gap-4">
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{job.title}</CardTitle>
                <Badge variant="secondary">{job.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-muted-foreground">{job.location}</div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedJob(job);
                    setDetailsOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-1" /> Details
                </Button>
                <Button
                  onClick={() => updateStatus(job.id, "APPROVED")}
                  variant="default"
                  size="sm"
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Approve
                </Button>
                <Button
                  onClick={() => updateStatus(job.id, "REJECTED")}
                  variant="destructive"
                  size="sm"
                >
                  <XCircle className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
