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

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  COMPLETED: "bg-purple-100 text-purple-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

const urgencyColors = {
  LOW: "bg-blue-100 text-blue-800",
  MEDIUM: "bg-orange-100 text-orange-800",
  HIGH: "bg-red-100 text-red-800",
  null: "bg-gray-100 text-gray-800",
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
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => router.push("/employer/dashboard")}
          className="flex items-center gap-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Job Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{job.title}</CardTitle>
                <div className="flex gap-2">
                  <Badge className={statusColors[job.status]}>
                    {job.status.charAt(0) + job.status.slice(1).toLowerCase()}
                  </Badge>
                  {job.job_urgency && (
                    <Badge className={urgencyColors[job.job_urgency]}>
                      {job.job_urgency}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Posted On</p>
                    <p className="font-medium">
                      {new Date(job.posted_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ClockIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Shift Type</p>
                    <p className="font-medium">{job.shift_type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Schedule</p>
                    <p className="font-medium">
                      {new Date(job.schedule_start).toLocaleString()} -{" "}
                      {new Date(job.schedule_end).toLocaleString()}
                    </p>
                  </div>
                </div>

                {job.deadline && (
                  <div className="flex items-center gap-3">
                    <ClockIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">
                        Application Deadline
                      </p>
                      <p className="font-medium">
                        {new Date(job.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Job Description</h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              {job.job_requirements && (
                <div>
                  <h3 className="font-medium mb-2">Requirements</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {job.job_requirements}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {job.gender_preference && (
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Gender Preference</p>
                      <p className="font-medium">{job.gender_preference}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <CarIcon className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Driving Required</p>
                    <p className="font-medium">
                      {job.driving_license_required ? "Yes" : "No"}
                    </p>
                  </div>
                </div>

                {job.language_level_requirement && (
                  <div className="flex items-center gap-3">
                    <LanguagesIcon className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">
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
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
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
                    <div className="flex items-center text-sm text-gray-600">
                      <StarIcon className="h-4 w-4 fill-yellow-400 mr-1" />
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
                    className="w-full"
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
                  <Button className="w-full">
                    <EditIcon className="h-4 w-4 mr-2" />
                    Edit Job
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
