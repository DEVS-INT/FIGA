"use client";

import { Container, Section } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PlusIcon,
  BriefcaseIcon,
  UsersIcon,
  MapPinIcon,
  CalendarIcon,
  PhoneIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  EditIcon,
  XIcon,
  StarIcon,
  CheckCircleIcon,
  MessageSquareIcon,
  Loader2,
  ClockIcon,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

type JobStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "COMPLETED"
  | "CANCELLED";
type JobUrgency = "LOW" | "MEDIUM" | "HIGH" | null;

interface Job {
  id: number;
  title: string;
  location: string;
  status: JobStatus;
  posted_at: string;
  schedule_start: string;
  schedule_end: string;
  shift_type: string;
  job_urgency: JobUrgency;
  job_requirements: string | null;
  description: string;
  gender_preference?: string | null;
  driving_license_required?: boolean;
  assigned_caregiver?: {
    name: string;
    avatar: string;
    rating: number;
  } | null;
}

const statusOptions: JobStatus[] = [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
];

const getStatusIcon = (status: JobStatus) => {
  switch (status) {
    case "APPROVED":
      return "✅";
    case "PENDING":
      return "🟡";
    case "REJECTED":
      return "🔴";
    case "COMPLETED":
      return "🏁";
    case "CANCELLED":
      return "❌";
    default:
      return "⚪";
  }
};

const getStatusColor = (status: JobStatus) => {
  switch (status) {
    case "APPROVED":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "REJECTED":
      return "bg-rose-50 text-rose-700 border-rose-200";
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "CANCELLED":
      return "bg-gray-50 text-gray-700 border-gray-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};

const getUrgencyColor = (urgency: JobUrgency) => {
  switch (urgency) {
    case "HIGH":
      return "bg-red-100 text-red-800";
    case "MEDIUM":
      return "bg-orange-100 text-orange-800";
    case "LOW":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function EmployerDashboardPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [activeTab, setActiveTab] = useState<JobStatus | "all">("all");
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        toast.loading("Loading jobs...", { id: "fetch-jobs" });
        const response = await fetch("/api/job");
        if (!response.ok) throw new Error("Failed to fetch jobs");
        const data = await response.json();
        setJobs(data.data);
        toast.success("Jobs loaded successfully", { id: "fetch-jobs" });
      } catch (error) {
        toast.error("Error loading jobs", { id: "fetch-jobs" });
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Fetch unread messages count for the Messages button badge
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/employer/messages?unreadOnly=true", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        setUnreadCount(Array.isArray(data?.data) ? data.data.length : 0);
      } catch {
        // ignore badge errors
      }
    };
    fetchUnread();
    const onFocus = () => fetchUnread();
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchUnread();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesTab = activeTab === "all" || job.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const getJobCountByStatus = (status: JobStatus | "all") => {
    if (status === "all") return jobs.length;
    return jobs.filter((job) => job.status === status).length;
  };

  const handleJobAction = async (
    jobId: number,
    action: "complete" | "cancel" | "reopen"
  ) => {
    try {
      toast.loading("Updating job status...", { id: "update-job" });

      let newStatus: JobStatus;
      switch (action) {
        case "complete":
          newStatus = "COMPLETED";
          break;
        case "cancel":
          newStatus = "CANCELLED";
          break;
        case "reopen":
          newStatus = "APPROVED";
          break;
        default:
          newStatus = "PENDING";
      }

      const response = await fetch(`/api/job/${jobId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update job");

      const updatedJob = await response.json();
      setJobs(jobs.map((job) => (job.id === jobId ? updatedJob : job)));
      toast.success(`Job marked as ${newStatus.toLowerCase()}`, {
        id: "update-job",
      });
    } catch (error) {
      toast.error("Failed to update job", { id: "update-job" });
      console.error(error);
    }
  };

  if (loading) {
    return (
      <Section padding="sm">
        <Container size="xl" className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </Container>
      </Section>
    );
  }

  return (
    <Section padding="sm">
      <Container size="xl">
        <div className="space-y-8">
          {/* Header - FIGA blue gradient */}
          <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400 opacity-10" />
            <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  Employer Dashboard
                </h1>
                <p className="text-gray-600 mt-1">
                  Manage your postings, track progress, and connect with
                  caregivers.
                </p>
              </div>
              <div className="flex gap-3">
                <Link href="/employer/messages">
                  <Button variant="outline" className="relative">
                    <MessageSquareIcon className="w-5 h-5 mr-2" />
                    Messages
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-semibold rounded-full h-5 min-w-[1.25rem] px-1.5 flex items-center justify-center shadow-sm">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Button
                  onClick={() => router.push("/employer/post-job")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Post New Job
                </Button>
              </div>
            </div>
          </div>

          {/* Top stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-blue-100">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.length}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <BriefcaseIcon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-100">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.filter((j) => j.status === "APPROVED").length}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-100">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.filter((j) => j.status === "PENDING").length}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ClockIcon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
            <Card className="border-blue-100">
              <CardContent className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {jobs.filter((j) => j.status === "COMPLETED").length}
                  </p>
                </div>
                <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs Section */}
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">All Job Postings</CardTitle>
                  <CardDescription>
                    Manage and track all your jobs
                  </CardDescription>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1 min-w-[200px]">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) =>
                      setStatusFilter(value as JobStatus | "all")
                    }
                  >
                    <SelectTrigger className="w-full sm:w-48">
                      <FilterIcon className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={(value) =>
                  setActiveTab(value as JobStatus | "all")
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                  >
                    All
                    <span className="ml-2 rounded-full bg-blue-100 text-blue-700 text-xs px-2 py-0.5">
                      {jobs.length}
                    </span>
                  </TabsTrigger>
                  {statusOptions.map((status) => (
                    <TabsTrigger
                      key={status}
                      value={status}
                      className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                    >
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                      <span className="ml-2 rounded-full bg-blue-100 text-blue-700 text-xs px-2 py-0.5">
                        {getJobCountByStatus(status)}
                      </span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeTab} className="mt-6">
                  {filteredJobs.length === 0 ? (
                    <div className="text-center py-12">
                      <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No jobs found
                      </h3>
                      <p className="text-gray-500 mb-4">
                        {searchTerm || statusFilter !== "all"
                          ? "Try adjusting your search or filter criteria."
                          : "You haven't posted any jobs yet."}
                      </p>
                      <Button variant="brand" onClick={() => router.push("/employer/post-job")}>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Post Your Job
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {filteredJobs.map((job) => (
                        <Card
                          key={job.id}
                          className="hover:shadow-md transition-shadow border-l-4"
                          style={{
                            borderLeftColor:
                              job.status === "APPROVED"
                                ? "#2563eb" /* blue-600 */
                                : job.status === "PENDING"
                                ? "#f59e0b" /* amber-500 */
                                : job.status === "REJECTED"
                                ? "#e11d48" /* rose-600 */
                                : job.status === "COMPLETED"
                                ? "#059669" /* emerald-600 */
                                : "#6b7280" /* gray-500 */,
                          }}
                        >
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-3">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="text-lg font-semibold text-gray-900">
                                        {job.title}
                                      </h3>
                                      {job.job_urgency && (
                                        <Badge
                                          className={`${getUrgencyColor(
                                            job.job_urgency
                                          )} text-xs`}
                                        >
                                          {job.job_urgency}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500 mb-2">
                                      <MapPinIcon className="h-4 w-4 mr-1" />
                                      {job.location}
                                      <CalendarIcon className="h-4 w-4 ml-4 mr-1" />
                                      {new Date(
                                        job.posted_at
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                  <Badge
                                    className={`${getStatusColor(
                                      job.status
                                    )} border`}
                                  >
                                    {getStatusIcon(job.status)}{" "}
                                    {job.status.charAt(0) +
                                      job.status.slice(1).toLowerCase()}
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Shift Type
                                    </p>
                                    <p className="text-sm font-medium">
                                      {job.shift_type}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Schedule
                                    </p>
                                    <p className="text-sm font-medium">
                                      {new Date(
                                        job.schedule_start
                                      ).toLocaleString()}{" "}
                                      -
                                      {new Date(
                                        job.schedule_end
                                      ).toLocaleString()}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Requirements
                                    </p>
                                    <p className="text-sm font-medium line-clamp-1">
                                      {job.job_requirements || "None specified"}
                                    </p>
                                  </div>
                                </div>

                                {job.assigned_caregiver && (
                                  <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                          <span className="text-xs font-medium">
                                            {job.assigned_caregiver.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </span>
                                        </div>
                                        <div>
                                          <p className="text-sm text-blue-800 font-medium">
                                            Assigned:{" "}
                                            {job.assigned_caregiver.name}
                                          </p>
                                          <div className="flex items-center text-sm text-blue-700">
                                            <StarIcon className="h-4 w-4 fill-current mr-1" />
                                            {job.assigned_caregiver.rating}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                  {job.description}
                                </p>
                              </div>

                              <div className="flex flex-col gap-2 lg:w-40">
                                <Link href={`/employer/jobs/${job.id}`}>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                  >
                                    <EyeIcon className="h-4 w-4 mr-2" />
                                    View Details
                                  </Button>
                                </Link>

                                {job.status === "APPROVED" && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full"
                                      onClick={() =>
                                        handleJobAction(job.id, "complete")
                                      }
                                    >
                                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                                      Mark Complete
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="w-full text-red-600"
                                      onClick={() =>
                                        handleJobAction(job.id, "cancel")
                                      }
                                    >
                                      <XIcon className="h-4 w-4 mr-2" />
                                      Cancel Job
                                    </Button>
                                  </>
                                )}

                                {(job.status === "COMPLETED" ||
                                  job.status === "CANCELLED") && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() =>
                                      handleJobAction(job.id, "reopen")
                                    }
                                  >
                                    <EditIcon className="h-4 w-4 mr-2" />
                                    Reopen Job
                                  </Button>
                                )}

                                {job.status === "PENDING" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                    onClick={() =>
                                      router.push(
                                        `/employer/jobs/${job.id}/edit`
                                      )
                                    }
                                  >
                                    <EditIcon className="h-4 w-4 mr-2" />
                                    Edit Job
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
