"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  X,
  MapPin,
  Clock,
  DollarSign,
  Loader2,
  Heart,
  Users,
  Calendar,
  Filter,
  ChevronDown,
  Star,
  Building2,
  User,
  CheckCircle,
  AlertCircle,
  Car,
  Languages,
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "react-hot-toast";

// Simple Select Component
const SimpleSelect = ({
  value,
  onValueChange,
  placeholder,
  options,
}: {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-4 py-2 text-left bg-white border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors duration-200 flex items-center justify-between"
      >
        <span className={value ? "text-slate-900" : "text-slate-500"}>
          {value
            ? options.find((opt) => opt.value === value)?.label
            : placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onValueChange(option.value);
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Small chip UI for active filters
const Chip = ({ label, onClear }: { label: string; onClear: () => void }) => {
  return (
    <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm">
      <span className="truncate max-w-[12rem]">{label}</span>
      <button
        onClick={onClear}
        className="p-1 rounded-full hover:bg-slate-200"
        aria-label={`Clear ${label}`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export default function JobsPage() {
  const { status, data: session } = useSession();
  const router = useRouter();
  type JobCard = {
    id: number;
    title: string;
    company: string;
    location: string;
    isOpen: boolean;
    startDate: string;
    endDate: string;
    shiftTypes: string[];
    duration: string;
    genderPreference: string;
    drivingRequired: boolean;
    licenseRequired: boolean;
    englishRequired: boolean;
    communicationLevel: string;
    requirements: string[];
    salary: string;
    description: string;
    additionalNotes: string | null;
    contactInfo: string;
    posted: string;
    urgent: boolean;
    applicants: number;
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [shiftTypeFilter, setShiftTypeFilter] = useState("");
  const [genderPreferenceFilter, setGenderPreferenceFilter] = useState("");
  const [requirementsFilter, setRequirementsFilter] = useState("");

  const [jobs, setJobs] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  // Keep a stable view while the modal is open
  const [filtersSnapshot, setFiltersSnapshot] = useState<{
    searchTerm: string;
    locationFilter: string;
    shiftTypeFilter: string;
    genderPreferenceFilter: string;
    requirementsFilter: string;
  } | null>(null);
  const [filteredJobsSnapshot, setFilteredJobsSnapshot] = useState<
    JobCard[] | null
  >(null);
  // Track which job cards are expanded on mobile
  const [expandedJobs, setExpandedJobs] = useState<Record<number, boolean>>({});

  const toggleJobExpanded = (id: number) => {
    setExpandedJobs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Centralized close to ensure filters/results restore consistently
  const closeApplyModal = React.useCallback(() => {
    setApplyOpen(false);
    if (filtersSnapshot) {
      setSearchTerm(filtersSnapshot.searchTerm);
      setLocationFilter(filtersSnapshot.locationFilter);
      setShiftTypeFilter(filtersSnapshot.shiftTypeFilter);
      setGenderPreferenceFilter(filtersSnapshot.genderPreferenceFilter);
      setRequirementsFilter(filtersSnapshot.requirementsFilter);
    }
    setFilteredJobsSnapshot(null);
    setFiltersSnapshot(null);
    setSelectedJob(null);
    setCoverLetter("");
  }, [filtersSnapshot]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/findjob");
        if (!res.ok) {
          throw new Error("Failed to load jobs");
        }
        const json = await res.json();
        setJobs(json.data ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error loading jobs");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Filter options based on form structure
  const locationOptions = [
    { value: "", label: "All Locations" },
    { value: "clackamas-or", label: "Clackamas, OR" },
    { value: "atlanta-ga", label: "Atlanta, GA" },
    { value: "san-diego-ca", label: "San Diego, CA" },
    { value: "austin-tx", label: "Austin, TX" },
    { value: "phoenix-az", label: "Phoenix, AZ" },
    { value: "miami-fl", label: "Miami, FL" },
    { value: "seattle-wa", label: "Seattle, WA" },
  ];

  const shiftTypeOptions = [
    { value: "", label: "All Shift Types" },
    { value: "day-shift", label: "Day Shift" },
    { value: "night-shift", label: "Night Shift" },
    { value: "12-hour", label: "12-Hour" },
    { value: "live-in", label: "Live-in" },
    { value: "weekend", label: "Weekend" },
    { value: "one-time", label: "One-time" },
    { value: "ongoing", label: "Ongoing" },
  ];

  const genderPreferenceOptions = [
    { value: "", label: "All Gender Preferences" },
    { value: "male", label: "Male Preferred" },
    { value: "female", label: "Female Preferred" },
    { value: "no-preference", label: "No Preference" },
  ];

  const requirementsOptions = [
    { value: "", label: "All Requirements" },
    { value: "tier-1", label: "Tier 1" },
    { value: "tier-2", label: "Tier 2" },
    { value: "first-aid", label: "First Aid/CPR" },
    { value: "experience", label: "Experience Required" },
    { value: "driving", label: "Driving Required" },
    { value: "live-in", label: "Willing to Live On-site" },
  ];

  // Filter jobs based on search criteria
  const filteredJobs = useMemo(
    () =>
      (applyOpen ? jobs : jobs).filter((job: JobCard) => {
        const matchesSearch =
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLocation =
          !locationFilter ||
          job.location
            .toLowerCase()
            .includes(
              locationFilter
                .replace("-", " ")
                .replace("ga", "GA")
                .replace("or", "OR")
                .replace("ca", "CA")
                .replace("tx", "TX")
                .replace("az", "AZ")
                .replace("fl", "FL")
                .replace("wa", "WA")
            );

        const matchesShiftType =
          !shiftTypeFilter ||
          job.shiftTypes.some((shift: string) =>
            shift.toLowerCase().includes(shiftTypeFilter.replace("-", " "))
          );

        const matchesGender =
          !genderPreferenceFilter ||
          (genderPreferenceFilter === "no-preference" &&
            job.genderPreference === "No preference") ||
          job.genderPreference.toLowerCase().includes(genderPreferenceFilter);

        const matchesRequirements =
          !requirementsFilter ||
          job.requirements.some((req: string) =>
            req
              .toLowerCase()
              .includes(
                requirementsFilter
                  .replace("-", " ")
                  .replace("first aid", "first aid/cpr")
              )
          );

        return (
          matchesSearch &&
          matchesLocation &&
          matchesShiftType &&
          matchesGender &&
          matchesRequirements
        );
      }),
    [
      jobs,
      searchTerm,
      locationFilter,
      shiftTypeFilter,
      genderPreferenceFilter,
      requirementsFilter,
      applyOpen,
    ]
  );

  // Use a snapshot while modal is open to avoid background state changes affecting the list
  const displayJobs =
    applyOpen && filteredJobsSnapshot ? filteredJobsSnapshot : filteredJobs;

  const getStatusBadge = (isOpen: boolean, urgent: boolean) => {
    if (!isOpen) {
      return (
        <Badge variant="secondary" className="bg-slate-100 text-slate-600">
          🔴 Closed
        </Badge>
      );
    }
    if (urgent) {
      return (
        <Badge className="bg-red-100 text-red-700 border-red-200">
          🚨 Urgent
        </Badge>
      );
    }
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200">
        🟢 Open
      </Badge>
    );
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/30 ${
        applyOpen ? "pointer-events-none" : ""
      }`}
    >
      <ApplyModal
        open={applyOpen}
        onOpenChange={(v) => {
          if (!v) return closeApplyModal();
          setApplyOpen(v);
        }}
        job={selectedJob}
        note={coverLetter}
        setNote={setCoverLetter}
        submitting={submitting}
        onSubmit={async () => {
          if (!selectedJob) return;
          try {
            setSubmitting(true);
            const res = await fetch("/api/applications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ jobId: selectedJob.id, coverLetter }),
            });
            if (res.status === 401) {
              toast.error("Please sign in as an employee to apply.");
              window.location.href = `/signin?callbackUrl=${encodeURIComponent(
                "/jobs"
              )}`;
              return;
            }
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
              toast.error(data?.error || "Failed to apply");
              return;
            }
            toast.success("Application submitted!");
            // Optimistically increment the applicants count for the selected job
            setJobs((prev) =>
              prev.map((j: any) =>
                j.id === selectedJob.id
                  ? { ...j, applicants: (j.applicants ?? 0) + 1 }
                  : j
              )
            );
            // Close and restore snapshot/filters to keep the list stable
            closeApplyModal();
          } catch (e) {
            toast.error("Something went wrong");
          } finally {
            setSubmitting(false);
          }
        }}
      />
      {/* Hero Banner */}
      <section className="py-10 lg:py-16 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('/pattern-dark.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Animated dots decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          {/* Blue dots group - top left */}
          <div className="absolute top-[15%] left-[10%] w-5 h-5 rounded-full bg-blue-400 animate-pulse"></div>
          <div className="absolute top-[25%] left-[30%] w-5 h-5 rounded-full bg-indigo-400 animate-pulse delay-200"></div>
          <div className="absolute top-[10%] left-[50%] w-5 h-5 rounded-full bg-slate-400 animate-pulse delay-300"></div>
          <div className="absolute top-[30%] left-[15%] w-5 h-5 rounded-full bg-blue-400 animate-pulse delay-250"></div>
          <div className="absolute top-[20%] left-[70%] w-5 h-5 rounded-full bg-indigo-400 animate-pulse delay-400"></div>
          <div className="absolute top-[35%] left-[60%] w-5 h-5 rounded-full bg-blue-400 animate-pulse delay-350"></div>
          <div className="absolute top-[5%] left-[80%] w-5 h-5 rounded-full bg-slate-500 animate-pulse delay-500"></div>

          {/* Bottom right dots */}
          <div className="absolute bottom-[20%] right-[15%] w-4 h-4 rounded-full bg-indigo-400 animate-pulse delay-300"></div>
          <div className="absolute bottom-[30%] right-[30%] w-6 h-6 rounded-full bg-slate-400 animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Find Your Perfect{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 animate-gradient">
                Caregiving
              </span>{" "}
              Job
            </h1>

            <p className="text-xl text-blue-100/90 leading-relaxed max-w-3xl mx-auto">
              Discover meaningful opportunities to make a difference in
              families' lives
              <span className="block sm:inline"> across the United States</span>
            </p>

            <div className="flex flex-row sm:flex-row gap-4 justify-center items-center">
              <Badge className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white/20 px-5 py-2 text-sm font-medium transition-all hover:scale-[1.02]">
                <Heart className="w-4 h-4 mr-2 text-pink-300" />
                {jobs.filter((job) => job.isOpen).length} Active Jobs
              </Badge>
              <Badge className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white/20 px-5 py-2 text-sm font-medium transition-all hover:scale-[1.02]">
                <Users className="w-4 h-4 mr-2 text-blue-300" />
                Trusted Families
              </Badge>
              {/* <Badge className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border-white/20 px-5 py-2 text-sm font-medium transition-all hover:scale-[1.02]">
                <Star className="w-4 h-4 mr-2 text-yellow-300" />
                Top Rated Platform
              </Badge> */}
            </div>
          </div>
        </div>

        {/* Large blur circles */}
        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-blue-400/10 blur-xl animate-pulse-slow"></div>
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-indigo-400/10 blur-xl animate-pulse-slow delay-1000"></div>
      </section>

      {/* Search and Filters - improved */}
      <section className="py-6 bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search jobs by title, company, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-base rounded-2xl border-2 border-slate-200 focus:border-blue-500 transition-colors duration-200"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:shadow-sm"
                  onClick={() => {
                    // Toggle a compact filter panel in future — for now focus visual
                  }}
                >
                  <Filter className="w-4 h-4 text-slate-600" />
                  Filters
                </button>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("");
                    setShiftTypeFilter("");
                    setGenderPreferenceFilter("");
                    setRequirementsFilter("");
                  }}
                  className="text-slate-600 hover:text-slate-800"
                >
                  Clear
                </Button>
              </div>
            </div>

            {/* Inline filter controls for larger screens, stack on mobile */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
              <div>
                <SimpleSelect
                  value={locationFilter}
                  onValueChange={setLocationFilter}
                  placeholder="Location"
                  options={locationOptions}
                />
              </div>
              <div>
                <SimpleSelect
                  value={shiftTypeFilter}
                  onValueChange={setShiftTypeFilter}
                  placeholder="Shift"
                  options={shiftTypeOptions}
                />
              </div>
              <div>
                <SimpleSelect
                  value={genderPreferenceFilter}
                  onValueChange={setGenderPreferenceFilter}
                  placeholder="Gender"
                  options={genderPreferenceOptions}
                />
              </div>
              <div>
                <SimpleSelect
                  value={requirementsFilter}
                  onValueChange={setRequirementsFilter}
                  placeholder="Requirements"
                  options={requirementsOptions}
                />
              </div>
            </div>

            {/* Active filter chips */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {debouncedSearch && (
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <span className="font-medium">"{debouncedSearch}"</span>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="p-1 rounded-full hover:bg-blue-100"
                    aria-label="Clear search"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {locationFilter && (
                <Chip
                  label={
                    locationOptions.find((o) => o.value === locationFilter)
                      ?.label || locationFilter
                  }
                  onClear={() => setLocationFilter("")}
                />
              )}
              {shiftTypeFilter && (
                <Chip
                  label={
                    shiftTypeOptions.find((o) => o.value === shiftTypeFilter)
                      ?.label || shiftTypeFilter
                  }
                  onClear={() => setShiftTypeFilter("")}
                />
              )}
              {genderPreferenceFilter && (
                <Chip
                  label={
                    genderPreferenceOptions.find(
                      (o) => o.value === genderPreferenceFilter
                    )?.label || genderPreferenceFilter
                  }
                  onClear={() => setGenderPreferenceFilter("")}
                />
              )}
              {requirementsFilter && (
                <Chip
                  label={
                    requirementsOptions.find(
                      (o) => o.value === requirementsFilter
                    )?.label || requirementsFilter
                  }
                  onClear={() => setRequirementsFilter("")}
                />
              )}
            </div>

            {/* Results Count */}
            <div className="mt-4 flex items-center justify-between">
              <p className="text-slate-600 font-medium">
                {loading
                  ? "Loading jobs…"
                  : error
                  ? "Error loading jobs"
                  : `Showing ${displayJobs.length} of ${jobs.length} jobs`}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                <span className="text-slate-600 font-medium">
                  Loading jobs…
                </span>
              </div>
            ) : (
              <div className="grid gap-6">
                {displayJobs.map((job) => (
                  <Card
                    key={job.id}
                    className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden"
                  >
                    <CardContent className="p-8">
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        {/* Job Info */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                <h3 className="text-2xl font-bold text-slate-900">
                                  {job.title}
                                </h3>
                                {getStatusBadge(job.isOpen, job.urgent)}
                              </div>
                              <div className="flex items-center text-slate-600 mb-2">
                                <Building2 className="w-4 h-4 mr-2" />
                                <span className="font-medium">
                                  {job.company}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Job Details Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            <div className="flex items-center text-slate-600">
                              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center text-slate-600">
                              <Clock className="w-4 h-4 mr-2 text-green-600" />
                              <span>{job.duration}</span>
                            </div>
                            <div className="flex items-center text-slate-600">
                              <DollarSign className="w-4 h-4 mr-2 text-purple-600" />
                              <span className="font-semibold">
                                {job.salary}
                              </span>
                            </div>
                            <div className="flex items-center text-slate-600">
                              <User className="w-4 h-4 mr-2 text-orange-600" />
                              <span>{job.genderPreference}</span>
                            </div>
                            <div className="flex items-center text-slate-600">
                              <Languages className="w-4 h-4 mr-2 text-indigo-600" />
                              <span>{job.communicationLevel} English</span>
                            </div>
                            {job.drivingRequired && (
                              <div className="flex items-center text-slate-600">
                                <Car className="w-4 h-4 mr-2 text-red-600" />
                                <span>Driving Required</span>
                              </div>
                            )}
                          </div>

                          {/* Shift Types */}
                          <div
                            className={`${
                              expandedJobs[job.id] ? "block" : "hidden sm:block"
                            } mb-4`}
                          >
                            <h4 className="font-semibold text-slate-900 mb-2">
                              Shift Types:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {job.shiftTypes.map((shift, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-blue-600 border-blue-300 bg-blue-50"
                                >
                                  {shift}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Description */}
                          <p
                            className={`text-slate-700 mb-4 leading-relaxed text-base ${
                              expandedJobs[job.id] ? "block" : "hidden sm:block"
                            }`}
                          >
                            {job.description}
                          </p>

                          {/* Requirements */}
                          <div
                            className={`${
                              expandedJobs[job.id] ? "block" : "hidden sm:block"
                            } mb-4`}
                          >
                            <h4 className="font-semibold text-slate-900 mb-2">
                              Requirements:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {job.requirements.map((req, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-slate-600 border-slate-300"
                                >
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Additional Notes */}
                          {job.additionalNotes && (
                            <div
                              className={`mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200 ${
                                expandedJobs[job.id] ? "block" : "hidden sm:block"
                              }`}
                            >
                              <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                Additional Notes:
                              </h4>
                              <p className="text-blue-800 text-sm">
                                {job.additionalNotes}
                              </p>
                            </div>
                          )}

                          {/* Footer (contact removed) */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                            <div className="flex items-center gap-4 text-sm text-slate-500">
                              <span>Posted {job.posted}</span>
                              <span>•</span>
                              <span>{job.applicants} applicants</span>
                            </div>
                            {/* Mobile See more / See less toggle */}
                            <div className="sm:hidden">
                              <button
                                onClick={() => toggleJobExpanded(job.id)}
                                className="text-blue-600 hover:underline text-sm font-medium"
                              >
                                {expandedJobs[job.id] ? "See less" : "See more"}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Apply Button */}
                        <div className="lg:ml-8 flex-shrink-0">
                          {job.isOpen ? (
                            <Button
                              size="lg"
                              onClick={() => {
                                const isAuthed = status === "authenticated";
                                const isEmployee =
                                  isAuthed &&
                                  session?.user?.role === "EMPLOYEE";
                                if (!isEmployee) {
                                  toast.error(
                                    "Please sign in as an employee to apply."
                                  );
                                  router.push(
                                    `/signin?callbackUrl=${encodeURIComponent(
                                      "/jobs"
                                    )}`
                                  );
                                  return;
                                }
                                // Move focus away from background inputs (like search), then open modal
                                if (
                                  typeof document !== "undefined" &&
                                  document.activeElement instanceof HTMLElement
                                ) {
                                  document.activeElement.blur();
                                }
                                // Snapshot current filters and results for stability while modal is open
                                setFiltersSnapshot({
                                  searchTerm,
                                  locationFilter,
                                  shiftTypeFilter,
                                  genderPreferenceFilter,
                                  requirementsFilter,
                                });
                                setFilteredJobsSnapshot(filteredJobs);
                                setSelectedJob(job);
                                setApplyOpen(true);
                              }}
                              className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-base font-semibold rounded-2xl"
                            >
                              Apply Now
                            </Button>
                          ) : (
                            <Button
                              size="lg"
                              disabled
                              className="w-full lg:w-auto px-8 py-4 text-base font-semibold rounded-2xl"
                            >
                              Position Closed
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && !error && displayJobs.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  No jobs found
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search criteria or clearing the filters to
                  see more opportunities.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("");
                    setShiftTypeFilter("");
                    setGenderPreferenceFilter("");
                    setRequirementsFilter("");
                  }}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

// Apply Modal implementation
function ApplyModal({
  open,
  onOpenChange,
  job,
  note,
  setNote,
  submitting,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  job: any;
  note: string;
  setNote: (v: string) => void;
  submitting: boolean;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg pointer-events-auto">
        <DialogHeader>
          <DialogTitle>Apply to {job?.title}</DialogTitle>
          <DialogDescription>
            You’re applying to {job?.company} • {job?.location}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="text-sm text-slate-600">Cover letter (optional)</div>
          <textarea
            className="w-full min-h-28 rounded-md border border-slate-300 p-3 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write a brief cover letter to strengthen your application (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={onSubmit} disabled={submitting}>
              {submitting ? "Applying…" : "Submit Application"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
