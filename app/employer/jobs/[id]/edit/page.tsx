"use client";

import { Container, Section } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Save,
  MapPin,
  Clock,
  User,
  CheckCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

// Minimal required mark for labels
const RequiredMark = () => (
  <span className="ml-1 text-red-600" aria-hidden="true">
    *
  </span>
);

// Schema aligned with post-job
const jobFormSchema = z.object({
  title: z.string().min(5, {
    message: "Job title must be at least 5 characters.",
  }),
  location: z.string().min(3, {
    message: "Location must be at least 3 characters.",
  }),
  schedule_start: z.string().min(1, {
    message: "Start date is required.",
  }),
  schedule_end: z.string().min(1, {
    message: "End date is required.",
  }),
  shift_type: z.string().min(1, {
    message: "Shift type is required.",
  }),
  gender_preference: z.string(),
  driving_license_required: z.boolean(),
  language_level_requirement: z.string(),
  job_requirements: z.string(),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  job_urgency: z.enum(["LOW", "MEDIUM", "HIGH"]).nullable(),
  deadline: z.string().optional(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;
  const [loading, setLoading] = useState(true);

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      location: "",
      schedule_start: "",
      schedule_end: "",
      shift_type: "",
      gender_preference: "No preference",
      driving_license_required: false,
      language_level_requirement: "",
      job_requirements: "",
      description: "",
      job_urgency: "MEDIUM",
      deadline: "",
    },
  });

  // Load job
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/job/${jobId}`);
        if (!response.ok) throw new Error("Failed to fetch job");
        const data = await response.json();
        const jobData: Partial<JobFormValues> = {
          ...data,
          schedule_start: data.schedule_start
            ? new Date(data.schedule_start).toISOString().slice(0, 16)
            : "",
          schedule_end: data.schedule_end
            ? new Date(data.schedule_end).toISOString().slice(0, 16)
            : "",
          deadline: data.deadline
            ? new Date(data.deadline).toISOString().slice(0, 16)
            : "",
        };
        form.reset(jobData as JobFormValues);
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Error loading job"
        );
        router.push("/employer/dashboard");
      } finally {
        setLoading(false);
      }
    };
    if (jobId) fetchJob();
  }, [jobId, form, router]);

  const onSubmit = async (data: JobFormValues) => {
    try {
      // Client-side schedule validation
      const s = new Date(data.schedule_start);
      const e = new Date(data.schedule_end);
      if (
        s.toString() !== "Invalid Date" &&
        e.toString() !== "Invalid Date" &&
        e <= s
      ) {
        form.setError("schedule_end", {
          type: "manual",
          message: "End must be after start",
        });
        return;
      }

      const payload = {
        ...data,
        schedule_start: new Date(data.schedule_start).toISOString(),
        schedule_end: new Date(data.schedule_end).toISOString(),
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      };

      const response = await fetch(`/api/job/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        let message = "Failed to update job";
        try {
          const errorData = await response.json();
          message = errorData?.error || message;
        } catch {
          try {
            const text = await response.text();
            if (text) message = text;
          } catch {}
        }
        throw new Error(message);
      }

      toast.success("Job updated successfully!");
      router.push("/employer/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error updating job. Please try again."
      );
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
          {/* Hero header */}
          <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400 opacity-10" />
            <div className="relative p-6 md:p-8 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Edit Job Posting
                  </h1>
                  <p className="text-slate-600 mt-1">
                    Update your caregiver job details
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Update the fields you want to change
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Basic Information
                    </h3>
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Job Title <RequiredMark />
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Caregiver Needed for Elderly Patient"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Location (City, State) <RequiredMark />
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Portland, OR"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Job Description <RequiredMark />
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the job responsibilities and expectations..."
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Schedule & Shift Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      Schedule Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="schedule_start"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Start Date & Time <RequiredMark />
                            </FormLabel>
                            <FormControl>
                              <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="schedule_end"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              End Date & Time <RequiredMark />
                            </FormLabel>
                            <FormControl>
                              <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="deadline"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Application Deadline (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              type="datetime-local"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="shift_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Shift Type <RequiredMark />
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select shift type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Weekday">Weekday</SelectItem>
                              <SelectItem value="Weekend">Weekend</SelectItem>
                              <SelectItem value="Overnight">
                                Overnight
                              </SelectItem>
                              <SelectItem value="Live-in">Live-in</SelectItem>
                              <SelectItem value="One-time">One-time</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="job_urgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Urgency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value || ""}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select urgency level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="LOW">Low</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="HIGH">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Caregiver Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <User className="h-5 w-5 text-purple-600" />
                      Caregiver Preferences
                    </h3>
                    <FormField
                      control={form.control}
                      name="gender_preference"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Gender Preference</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              value={field.value}
                              className="flex gap-6"
                            >
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="Male" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Male
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="Female" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  Female
                                </FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <RadioGroupItem value="No preference" />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  No preference
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Separator />

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="driving_license_required"
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel>Driving License Required?</FormLabel>
                              <p className="text-sm text-gray-500">
                                Must have valid driver's license
                              </p>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="language_level_requirement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Language Requirement</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select language level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Basic English">
                                  Basic English
                                </SelectItem>
                                <SelectItem value="Conversational English">
                                  Conversational English
                                </SelectItem>
                                <SelectItem value="Fluent English">
                                  Fluent English
                                </SelectItem>
                                <SelectItem value="Native Speaker">
                                  Native Speaker
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Caregiver Requirements */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-orange-600" />
                      Caregiver Requirements
                    </h3>
                    <FormField
                      control={form.control}
                      name="job_requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Requirements</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List any specific requirements (e.g., First Aid/CPR certified, experience with dementia patients, etc.)"
                              rows={3}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push("/employer/dashboard")}
                      disabled={form.formState.isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Update Job
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
