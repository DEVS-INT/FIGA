"use client";


import { Container, Section } from "@/components/common";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import {
  PlusIcon,
  BriefcaseIcon,
  UsersIcon,
  CheckCircleIcon,
  StarIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  SearchIcon,
  FilterIcon,
  EyeIcon,
  EditIcon,
  XIcon,
  PhoneIcon,
} from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

// Mock data for employer dashboard
const employerData = {
  name: "John Smith",
  company: "Smith Family Care",
  email: "john@smithfamilycare.com",
  totalJobs: 8,
  activeJobs: 2,
  filledJobs: 6,
  rating: 4.7,
};

const mockJobs = [
  {
    id: 1,
    title: "Elder Care for Mother",
    location: "San Francisco, CA",
    datePosted: "2024-01-15",
    status: "filled",
    applicants: 8,
    matched: 3,
    shiftType: "Weekday",
    duration: "Ongoing",
    payRange: "$25/hr",
    requirements: ["Tier 1", "First Aid/CPR"],
    assignedCaregiver: {
      name: "Sarah Johnson",
      avatar: "SJ",
      rating: 4.8,
    },
  },
  {
    id: 2,
    title: "Weekend Respite Care",
    location: "Oakland, CA",
    datePosted: "2024-01-12",
    status: "pending",
    applicants: 4,
    matched: 1,
    shiftType: "Weekend",
    duration: "Part-time",
    payRange: "$30/hr",
    requirements: ["Experience Required"],
  },
  {
    id: 3,
    title: "Overnight Care",
    location: "Berkeley, CA",
    datePosted: "2024-01-20",
    status: "open",
    applicants: 2,
    matched: 0,
    shiftType: "Overnight",
    duration: "Temporary",
    payRange: "$35/hr",
    requirements: ["Tier 2", "Night Shift Experience"],
  },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "open":
      return "🟢";
    case "pending":
      return "🟡";
    case "closed":
      return "🔴";
    case "filled":
      return "✅";
    default:
      return "⚪";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "open":
      return "bg-green-100 text-green-800 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "closed":
      return "bg-red-100 text-red-800 border-red-200";
    case "filled":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

export default function EmployerDashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const filteredJobs = mockJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesTab = activeTab === "all" || job.status === activeTab;

    return matchesSearch && matchesStatus && matchesTab;
  });

  const getJobCountByStatus = (status: string) => {
    if (status === "all") return mockJobs.length;
    return mockJobs.filter((job) => job.status === status).length;
  };

  return (
    
      <Section padding="xl">
        <Container size="xl">
          <div className="space-y-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                      <h1 className="text-3xl font-bold mb-2">
                        Welcome back, {employerData.name}!
                      </h1>
                      <p className="text-blue-100 text-lg">
                        Manage your job postings and track caregiver matches.
                      </p>
                    </div>
                    <Link href="/employer/post-job">
                      <Button
                        size="lg"
                        className="bg-white text-blue-600 hover:bg-blue-50"
                      >
                        <PlusIcon className="h-5 w-5 mr-2" />
                        Post a New Caregiver Job
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>

            

            {/* Posted Jobs Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Posted Jobs</CardTitle>
                <CardDescription>
                  Manage and track all your caregiver job postings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search jobs by title or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <FilterIcon className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="filled">Filled</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Status Tabs */}
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="all">
                      All ({getJobCountByStatus("all")})
                    </TabsTrigger>
                    <TabsTrigger value="open">
                      🟢 Open ({getJobCountByStatus("open")})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                      🟡 Pending ({getJobCountByStatus("pending")})
                    </TabsTrigger>
                    <TabsTrigger value="filled">
                      ✅ Filled ({getJobCountByStatus("filled")})
                    </TabsTrigger>
                    <TabsTrigger value="closed">
                      🔴 Closed ({getJobCountByStatus("closed")})
                    </TabsTrigger>
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
                        <Link href="/employer/post-job">
                          <Button>
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Post Your First Job
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="grid gap-6">
                        {filteredJobs.map((job) => (
                          <Card
                            key={job.id}
                            className="hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-6">
                              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-3">
                                    <div>
                                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {job.title}
                                      </h3>
                                      <div className="flex items-center text-sm text-gray-500 mb-2">
                                        <MapPinIcon className="h-4 w-4 mr-1" />
                                        {job.location}
                                        <CalendarIcon className="h-4 w-4 ml-4 mr-1" />
                                        {formatDate(job.datePosted)}
                                      </div>
                                    </div>
                                    <Badge
                                      className={`${getStatusColor(
                                        job.status
                                      )} border`}
                                    >
                                      {getStatusIcon(job.status)}{" "}
                                      {job.status.charAt(0).toUpperCase() +
                                        job.status.slice(1)}
                                    </Badge>
                                  </div>

                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Shift Type
                                      </p>
                                      <p className="text-sm font-medium">
                                        {job.shiftType}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Duration
                                      </p>
                                      <p className="text-sm font-medium">
                                        {job.duration}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Pay Range
                                      </p>
                                      <p className="text-sm font-medium">
                                        {job.payRange}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500">
                                        Applicants
                                      </p>
                                      <p className="text-sm font-medium">
                                        {job.applicants} applied
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {job.requirements.map((req, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {req}
                                      </Badge>
                                    ))}
                                  </div>

                                  {job.assignedCaregiver && (
                                    <div className="bg-blue-50 p-3 rounded-lg mb-4">
                                      <div className="flex items-center gap-3">
                                        <Avatar>
                                          <AvatarFallback>
                                            {job.assignedCaregiver.avatar}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div>
                                          <p className="text-sm text-blue-800 font-medium">
                                            Assigned Caregiver: {job.assignedCaregiver.name}
                                          </p>
                                          <div className="flex items-center text-sm text-blue-700">
                                            <StarIcon className="h-4 w-4 fill-current mr-1" />
                                            {job.assignedCaregiver.rating}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {job.matched > 0 && (
                                    <div className="flex items-center gap-2">
                                      <Progress 
                                        value={(job.matched / job.applicants) * 100} 
                                        className="h-2 w-32" 
                                      />
                                      <span className="text-sm text-gray-600">
                                        <span className="font-medium">
                                          {job.matched}
                                        </span>{" "}
                                        matched ({Math.round((job.matched / job.applicants) * 100)}%)
                                      </span>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col items-end sm:flex-row sm:justify-end lg:flex-col gap-2 lg:w-32">
                                  <Link href={`/employer/jobs/${job.id}`}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="sm:ml-2 lg:ml-0 w-full"
                                    >
                                      <EyeIcon className="h-4 w-4 mr-2" />
                                      View Details
                                    </Button>
                                  </Link>

                                  {job.status === "open" ||
                                  job.status === "pending" ? (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="sm:ml-2 lg:ml-0 w-full"
                                      >
                                        <EditIcon className="h-4 w-4 mr-2" />
                                        Edit
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="sm:ml-2 lg:ml-0 w-full text-red-600 hover:text-red-700"
                                      >
                                        <XIcon className="h-4 w-4 mr-2" />
                                        Close
                                      </Button>
                                    </>
                                  ) : job.status === "filled" ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="sm:ml-2 lg:ml-0 w-full"
                                    >
                                      <PhoneIcon className="h-4 w-4 mr-2" />
                                      Contact
                                    </Button>
                                  ) : null}
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

            {/* Quick Actions */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/employer/post-job">
                  <Button className="w-full h-16 text-left justify-start">
                    <PlusIcon className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">Post New Job</div>
                      <div className="text-sm opacity-80">Find a caregiver</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/employer/applications">
                  <Button variant="outline" className="w-full h-16 text-left justify-start">
                    <UsersIcon className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">Review Applications</div>
                      <div className="text-sm opacity-80">New applications</div>
                    </div>
                  </Button>
                </Link>

                <Link href="/employer/schedule">
                  <Button variant="outline" className="w-full h-16 text-left justify-start">
                    <CalendarIcon className="w-5 h-5 mr-3" />
                    <div>
                      <div className="font-medium">View Schedule</div>
                      <div className="text-sm opacity-80">Manage care schedule</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>
   
  );
}