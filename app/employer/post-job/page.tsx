"use client";

import { Container, Section } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";
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
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

// Minimal required mark used across labels
const RequiredMark = () => (
  <span className="ml-1 text-red-600" aria-hidden="true">
    *
  </span>
);

// Zod schema matching our API validation
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

export default function PostJobPage() {
  const router = useRouter();
  const steps = useMemo(
    () => [
      { key: "basic", title: "Basic Info" },
      { key: "schedule", title: "Schedule" },
      { key: "preferences", title: "Preferences" },
      { key: "requirements", title: "Requirements" },
      { key: "review", title: "Review & Submit" },
    ],
    []
  );
  const [step, setStep] = useState(0);
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

  const onSubmit = async (data: JobFormValues) => {
    try {
      // Convert datetime-local format to ISO string
      const payload = {
        ...data,
        schedule_start: new Date(data.schedule_start).toISOString(),
        schedule_end: new Date(data.schedule_end).toISOString(),
        deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      };

      const response = await fetch("/api/job", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to post job");
      }

      const job = await response.json();

      toast.success(
        "Job posted successfully! Your job is now pending approval."
      );

      // Redirect to job listing or dashboard
      router.push("/employer/dashboard");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error posting job. Please try again."
      );
    }
  };

  const fieldsForStep = (s: number): (keyof JobFormValues)[] => {
    switch (s) {
      case 0:
        return ["title", "location", "description"];
      case 1:
        return [
          "schedule_start",
          "schedule_end",
          "deadline",
          "shift_type",
          "job_urgency",
        ];
      case 2:
        return [
          "gender_preference",
          "driving_license_required",
          "language_level_requirement",
        ];
      case 3:
        return ["job_requirements"];
      default:
        return [];
    }
  };

  const goNext = async () => {
    const fields = fieldsForStep(step);
    const valid = await form.trigger(fields as any, { shouldFocus: true });
    if (!valid) return;
    // Additional schedule ordering check
    if (step === 1) {
      const { schedule_start, schedule_end } = form.getValues();
      const s = new Date(schedule_start);
      const e = new Date(schedule_end);
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
    }
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => setStep((prev) => Math.max(prev - 1, 0));

  return (
    <Section padding="sm">
      <Container size="xl">
        <div className="space-y-8">
          {/* Hero header */}
          <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400 opacity-10" />
            <div className="relative p-6 md:p-8">
              <h1 className="text-3xl font-bold text-slate-900">
                Post a Caregiver Job
              </h1>
              <p className="text-slate-600 mt-1">
                Find the perfect caregiver for your needs
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
              <CardDescription>
                Fill out all required fields to post your job
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Stepper */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  {steps.map((st, idx) => (
                    <div
                      key={st.key}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full border flex items-center justify-center text-sm font-semibold",
                          idx < step &&
                            "bg-blue-600 text-white border-blue-600",
                          idx === step &&
                            "bg-blue-50 text-blue-700 border-blue-200",
                          idx > step &&
                            "bg-gray-50 text-gray-600 border-gray-200"
                        )}
                        title={st.title}
                      >
                        {idx + 1}
                      </div>
                      <div className="hidden md:block truncate text-sm font-medium text-slate-700">
                        {st.title}
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={cn(
                            "flex-1 h-0.5 rounded",
                            idx < step ? "bg-blue-600" : "bg-gray-200"
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  {step === 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" /> Basic
                        Information
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
                  )}

                  {step === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Clock className="h-5 w-5 text-green-600" /> Schedule
                        Details
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
                            <FormLabel>
                              Application Deadline (Optional)
                            </FormLabel>
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
                              defaultValue={field.value}
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
                                <SelectItem value="One-time">
                                  One-time
                                </SelectItem>
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
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <User className="h-5 w-5 text-purple-600" /> Caregiver
                        Preferences
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
                                defaultValue={field.value}
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
                                defaultValue={field.value}
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
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-orange-600" />{" "}
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
                  )}

                  {step === 4 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Review & Submit
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="rounded-lg border p-3 bg-slate-50">
                          <div className="text-slate-500">Job Title</div>
                          <div className="font-medium">
                            {form.getValues().title || "—"}
                          </div>
                        </div>
                        <div className="rounded-lg border p-3 bg-slate-50">
                          <div className="text-slate-500">Location</div>
                          <div className="font-medium">
                            {form.getValues().location || "—"}
                          </div>
                        </div>
                        <div className="rounded-lg border p-3 bg-slate-50">
                          <div className="text-slate-500">Shift Type</div>
                          <div className="font-medium">
                            {form.getValues().shift_type || "—"}
                          </div>
                        </div>
                        <div className="rounded-lg border p-3 bg-slate-50">
                          <div className="text-slate-500">Urgency</div>
                          <div className="font-medium">
                            {form.getValues().job_urgency || "—"}
                          </div>
                        </div>
                        <div className="rounded-lg border p-3 bg-slate-50 md:col-span-2">
                          <div className="text-slate-500">Schedule</div>
                          <div className="font-medium">
                            {form.getValues().schedule_start || "—"} →{" "}
                            {form.getValues().schedule_end || "—"}
                          </div>
                        </div>
                        <div className="rounded-lg border p-3 bg-slate-50">
                          <div className="text-slate-500">
                            Gender Preference
                          </div>
                          <div className="font-medium">
                            {form.getValues().gender_preference || "—"}
                          </div>
                        </div>
                        <div className="rounded-lg border p-3 bg-slate-50">
                          <div className="text-slate-500">Driving Required</div>
                          <div className="font-medium">
                            {form.getValues().driving_license_required
                              ? "Yes"
                              : "No"}
                          </div>
                        </div>
                        <div className="rounded-lg border p-3 bg-slate-50 md:col-span-2">
                          <div className="text-slate-500">Language</div>
                          <div className="font-medium">
                            {form.getValues().language_level_requirement || "—"}
                          </div>
                        </div>
                        <div className="rounded-lg border p-3 bg-slate-50 md:col-span-2">
                          <div className="text-slate-500">Description</div>
                          <div className="font-medium whitespace-pre-wrap">
                            {form.getValues().description || "—"}
                          </div>
                        </div>
                        <div className="rounded-lg border p-3 bg-slate-50 md:col-span-2">
                          <div className="text-slate-500">Requirements</div>
                          <div className="font-medium whitespace-pre-wrap">
                            {form.getValues().job_requirements || "—"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between gap-4 pt-6">
                    <div>
                      {step === 0 ? (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => router.back()}
                          disabled={form.formState.isSubmitting}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={goBack}
                          disabled={form.formState.isSubmitting}
                        >
                          Back
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {step < steps.length - 1 && (
                        <Button
                          type="button"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={goNext}
                        >
                          Next
                        </Button>
                      )}
                      {step === steps.length - 1 && (
                        <Button
                          type="submit"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" /> Submit Job
                            </>
                          )}
                        </Button>
                      )}
                    </div>
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
