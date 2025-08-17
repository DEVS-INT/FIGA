// app/employer/jobs/[id]/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeftIcon,
  EditIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CarIcon,
  LanguagesIcon,
  CheckCircleIcon,
  XIcon,
  StarIcon,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
// Define JobStatus type manually
type JobStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";

interface JobDetails {
  id: number;
  title: string;
  location: string;
  status: JobStatus;
  posted_at: string;
  updated_at: string;
  schedule_start: string;
  schedule_end: string;
  shift_type: string;
  job_urgency: "LOW" | "MEDIUM" | "HIGH" | null;
  job_requirements: string | null;
  description: string;
  gender_preference: string | null;
  driving_license_required: boolean;
  language_level_requirement: string | null;
  deadline: string | null;
  employer: {
    fullname: string;
    email: string;
    phone: string | null;
  };
  assigned_caregiver?: {
    id: number;
    fullname: string;
    email: string;
    phone: string;
    rating: number;
  } | null;
}

// FIGA brand-aligned status colors
const statusColors = {
  PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
  APPROVED: "bg-blue-50 text-blue-700 border border-blue-200",
  REJECTED: "bg-rose-50 text-rose-700 border border-rose-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  CANCELLED: "bg-gray-50 text-gray-700 border border-gray-200",
};

const urgencyColors = {
  LOW: "bg-blue-50 text-blue-700 border border-blue-200",
  MEDIUM: "bg-orange-50 text-orange-700 border border-orange-200",
  HIGH: "bg-red-50 text-red-700 border border-red-200",
  null: "bg-gray-50 text-gray-700 border border-gray-200",
};

export default function JobDetailsPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const id = params?.id;
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        toast.loading("Loading job details...", { id: "fetch-job" });
        if (!id) return;
        const response = await fetch(`/api/job/${id}`);
        if (!response.ok) throw new Error("Failed to fetch job");
        const data = await response.json();
        setJob(data);
        toast.dismiss("fetch-job");
      } catch (error) {
        toast.error("Failed to load job details", { id: "fetch-job" });
        console.error(error);
        router.push("/employer/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, router]);

  const handleStatusChange = async (newStatus: JobStatus) => {
    try {
      toast.loading("Updating job status...", { id: "update-status" });
      if (!id) throw new Error("Missing job id");
      const response = await fetch(`/api/job/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update job status");

      const updatedJob = await response.json();
      setJob(updatedJob);
      toast.success(`Job marked as ${newStatus.toLowerCase()}`, {
        id: "update-status",
      });
    } catch (error) {
      toast.error("Failed to update job status", { id: "update-status" });
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium">Job not found</h2>
        <Button
          onClick={() => router.push("/employer/dashboard")}
          className="mt-4"
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400 opacity-10" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                  {job.title}
                </h1>
                <Badge className={statusColors[job.status]}>
                  {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                </Badge>
                {job.job_urgency && (
                  <Badge className={urgencyColors[job.job_urgency]}>
                    Urgent: {job.job_urgency}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span className="inline-flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4 text-blue-600" />{" "}
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4 text-purple-600" /> Posted{" "}
                  {new Date(job.posted_at).toLocaleDateString()}
                </span>
                <span className="inline-flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-green-600" />{" "}
                  {job.shift_type}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/employer/dashboard")}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" /> Back
              </Button>
              {job.status === "PENDING" && (
                <Link href={`/employer/jobs/${job.id}/edit`}>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    <EditIcon className="h-4 w-4 mr-2" /> Edit Job
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Job Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-lg border bg-slate-50 p-3">
                  <MapPinIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-slate-600">Location</p>
                    <p className="font-medium text-slate-900">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border bg-slate-50 p-3">
                  <CalendarIcon className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-slate-600">Posted On</p>
                    <p className="font-medium text-slate-900">
                      {new Date(job.posted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border bg-slate-50 p-3">
                  <ClockIcon className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm text-slate-600">Shift Type</p>
                    <p className="font-medium text-slate-900">
                      {job.shift_type}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg border bg-slate-50 p-3">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-slate-600">Schedule</p>
                    <p className="font-medium text-slate-900">
                      {new Date(job.schedule_start).toLocaleString()} -{" "}
                      {new Date(job.schedule_end).toLocaleString()}
                    </p>
                  </div>
                </div>

                {job.deadline && (
                  <div className="flex items-center gap-3 rounded-lg border bg-slate-50 p-3">
                    <ClockIcon className="h-5 w-5 text-amber-600" />
                    <div>
                      <p className="text-sm text-slate-600">
                        Application Deadline
                      </p>
                      <p className="font-medium text-slate-900">
                        {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Job Description</h3>
                <p className="text-slate-700 whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {job.job_requirements && (
                <div>
                  <h3 className="font-medium mb-2">Requirements</h3>
                  <p className="text-slate-700 whitespace-pre-line">
                    {job.job_requirements}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.gender_preference && (
                  <div className="flex items-center gap-3 rounded-lg border bg-slate-50 p-3">
                    <UserIcon className="h-5 w-5 text-rose-600" />
                    <div>
                      <p className="text-sm text-slate-600">
                        Gender Preference
                      </p>
                      <p className="font-medium">{job.gender_preference}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 rounded-lg border bg-slate-50 p-3">
                  <CarIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-slate-600">Driving Required</p>
                    <p className="font-medium">
                      {job.driving_license_required ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                {job.language_level_requirement && (
                  <div className="flex items-center gap-3 rounded-lg border bg-slate-50 p-3">
                    <LanguagesIcon className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-slate-600">
                        Language Requirement
                      </p>
                      <p className="font-medium">
                        {job.language_level_requirement}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar with actions and assigned caregiver */}
        <div className="space-y-6">
          {job.assigned_caregiver && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Assigned Caregiver</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center">
                    <span className="font-medium">
                      {job.assigned_caregiver.fullname
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">
                      {job.assigned_caregiver.fullname}
                    </h4>
                    <div className="flex items-center text-sm text-blue-700">
                      <StarIcon className="h-4 w-4 fill-current mr-1" />
                      {job.assigned_caregiver.rating.toFixed(1)}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    {job.assigned_caregiver.phone}
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MailIcon className="h-4 w-4 mr-2" />
                    {job.assigned_caregiver.email}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Job Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.status === "APPROVED" && (
                <>
                  <Button
                    onClick={() => handleStatusChange("COMPLETED")}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Mark as Completed
                  </Button>
                  <Button
                    onClick={() => handleStatusChange("CANCELLED")}
                    variant="destructive"
                    className="w-full"
                  >
                    <XIcon className="h-4 w-4 mr-2" />
                    Cancel Job
                  </Button>
                </>
              )}

              {(job.status === "COMPLETED" || job.status === "CANCELLED") && (
                <Button
                  onClick={() => handleStatusChange("APPROVED")}
                  variant="outline"
                  className="w-full"
                >
                  Reopen Job
                </Button>
              )}

              {job.status === "PENDING" && (
                <Link href={`/employer/jobs/${job.id}/edit`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <EditIcon className="h-4 w-4 mr-2" /> Edit Job
                  </Button>
                </Link>
              )}

              <Button variant="outline" className="w-full">
                <PhoneIcon className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employer Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full">
                <MailIcon className="h-4 w-4 mr-2" />
                {job.employer.email}
              </Button>
              {job.employer.phone && (
                <Button variant="outline" className="w-full">
                  <PhoneIcon className="h-4 w-4 mr-2" />
                  {job.employer.phone}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
