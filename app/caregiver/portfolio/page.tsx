"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Container, Section } from "@/components/common";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  HeartPulse,
  GraduationCap,
  SlidersHorizontal,
  Phone,
  Hash,
  Languages,
  Loader2,
  Image as ImageIcon,
  UploadCloud,
  X,
} from "lucide-react";

// Schema mirrored from Portfolio table in Prisma schema
const emptyToUndefined = z
  .string()
  .transform((v) => (v.trim() === "" ? undefined : v));
const optionalText = z
  .union([z.string(), z.literal("")])
  .transform((v) => (v === "" ? undefined : v));

const portfolioSchema = z.object({
  sex: z.string().min(1, "Required"),
  phone_no: z.string().min(7, "Enter a valid phone"),
  age: z.coerce.number().int().min(16).max(100),
  certifications: optionalText.optional().nullable(),
  experience: optionalText.optional().nullable(),
  state_where_experience_gained: optionalText.optional().nullable(),
  suitable_work_days: optionalText.optional().nullable(),
  suitable_work_shift: optionalText.optional().nullable(),
  comfortability: z.string().min(1, "Required"),
  university_college: optionalText.optional().nullable(),
  study_field: optionalText.optional().nullable(),
  degree: optionalText.optional().nullable(),
  english_skill: z.string().min(1, "Required"),
  us_living_years: z.coerce.number().int().optional().nullable(),
  profile_image: z
    .union([z.string().url("Must be a valid URL"), z.literal("")])
    .optional()
    .nullable()
    .transform((v) => (v === "" ? undefined : v ?? undefined)),
});

export type PortfolioFormData = z.infer<typeof portfolioSchema>;

const steps = [
  { key: "basics", label: "Basic Info" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "preferences", label: "Preferences" },
  { key: "review", label: "Review & Submit" },
] as const;

type StepKey = (typeof steps)[number]["key"];

export default function CaregiverPortfolioPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState<StepKey>("basics");
  const [loadingPrefill, setLoadingPrefill] = useState(true);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      sex: "",
      phone_no: "",
      age: undefined as unknown as number,
      certifications: "",
      experience: "",
      state_where_experience_gained: "",
      suitable_work_days: "",
      suitable_work_shift: "",
      comfortability: "",
      university_college: "",
      study_field: "",
      degree: "",
      english_skill: "",
      us_living_years: undefined as unknown as number,
      profile_image: "",
    },
    mode: "onBlur",
  });

  const stepIndex = steps.findIndex((s) => s.key === currentStep);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const next = async () => {
    const fieldsByStep: Record<StepKey, (keyof PortfolioFormData)[]> = {
      basics: ["sex", "phone_no", "age", "english_skill"],
      experience: [
        "experience",
        "state_where_experience_gained",
        "certifications",
      ],
      education: ["university_college", "study_field", "degree"],
      preferences: [
        "suitable_work_days",
        "suitable_work_shift",
        "comfortability",
      ],
      review: [],
    };
    const fields = fieldsByStep[currentStep];
    if (fields.length) {
      const valid = await form.trigger(fields as any, { shouldFocus: true });
      if (!valid) return;
    }
    setCurrentStep(steps[Math.min(stepIndex + 1, steps.length - 1)].key);
  };
  const back = () => setCurrentStep(steps[Math.max(stepIndex - 1, 0)].key);

  const onSubmit = async (data: PortfolioFormData) => {
    try {
      const res = await fetch("/api/caregiver/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to save portfolio");
      }
      toast.success("Portfolio submitted for verification");
      router.push("/caregiver/dashboard");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unexpected error");
    }
  };

  // Keep preview in sync with typed URL
  useEffect(() => {
    const sub = form.watch((values, { name }) => {
      if (name === "profile_image") {
        if (values.profile_image && typeof values.profile_image === "string") {
          setPreviewUrl(values.profile_image);
        } else if (!selectedFileRef.current) {
          setPreviewUrl(null);
        }
      }
    });
    return () => sub.unsubscribe();
  }, [form]);

  // Track selected file (not uploaded yet)
  const selectedFileRef = useRef<File | null>(null);
  const onPickFile = () => fileInputRef.current?.click();
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    selectedFileRef.current = f || null;
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    }
  };
  useEffect(() => {
    return () => {
      if (previewUrl && selectedFileRef.current)
        URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (status === "loading") return null;
  if (!session || session.user?.role !== "EMPLOYEE") {
    router.push("/signin");
    return null;
  }

  // Prefill from API or local draft
  useEffect(() => {
    let mounted = true;
    async function prefill() {
      try {
        const res = await fetch("/api/caregiver/portfolio", {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          const p = data?.portfolio;
          if (p && mounted) {
            setIsVerified(Boolean(p.is_verified));
            form.reset({
              sex: p.sex || "",
              phone_no: p.phone_no || "",
              age:
                typeof p.age === "number"
                  ? p.age
                  : (undefined as unknown as number),
              certifications: p.certifications || "",
              experience: p.experience || "",
              state_where_experience_gained:
                p.state_where_experience_gained || "",
              suitable_work_days: p.suitable_work_days || "",
              suitable_work_shift: p.suitable_work_shift || "",
              comfortability: p.comfortability || "",
              university_college: p.university_college || "",
              study_field: p.study_field || "",
              degree: p.degree || "",
              english_skill: p.english_skill || "",
              us_living_years:
                typeof p.us_living_years === "number"
                  ? p.us_living_years
                  : (undefined as unknown as number),
              profile_image: p.profile_image || "",
            });
          } else if (mounted) {
            // load draft from localStorage
            const draft =
              typeof window !== "undefined"
                ? localStorage.getItem("portfolioDraft")
                : null;
            if (draft) {
              try {
                form.reset(JSON.parse(draft));
              } catch {}
            }
          }
        }
      } finally {
        if (mounted) setLoadingPrefill(false);
      }
    }
    prefill();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const FieldError = ({ name }: { name: keyof PortfolioFormData }) => {
    const err = (form.formState.errors as any)[name];
    if (!err) return null;
    return <p className="mt-1 text-sm text-red-600">{String(err.message)}</p>;
  };

  const StepIcon = useMemo(() => {
    switch (currentStep) {
      case "basics":
        return HeartPulse;
      case "experience":
        return ClipboardList;
      case "education":
        return GraduationCap;
      case "preferences":
        return SlidersHorizontal;
      default:
        return CheckCircle2;
    }
  }, [currentStep]);

  // Minimal required mark reused across labels for consistency
  const RequiredMark = () => (
    <span className="ml-1 text-red-600" aria-hidden="true">
      *
    </span>
  );

  return (
    <Section padding="sm">
      <Container size="xl">
        <div className="space-y-8">
          {/* Hero header */}
          <div className="relative overflow-hidden rounded-2xl border bg-white shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-sky-500 to-blue-400 opacity-10" />
            <div className="relative p-6 md:p-8">
              <h1 className="text-3xl font-bold text-slate-900">
                Your Portfolio
              </h1>
              <p className="text-slate-600 mt-1">
                Get verified and start applying to jobs
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Portfolio Details</CardTitle>
              <CardDescription>
                Complete all steps to submit your portfolio for verification
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
                          idx < stepIndex &&
                            "bg-blue-600 text-white border-blue-600",
                          idx === stepIndex &&
                            "bg-blue-50 text-blue-700 border-blue-200",
                          idx > stepIndex &&
                            "bg-gray-50 text-gray-600 border-gray-200"
                        )}
                        title={st.label}
                      >
                        {idx + 1}
                      </div>
                      <div className="hidden md:block truncate text-sm font-medium text-slate-700">
                        {st.label}
                      </div>
                      {idx < steps.length - 1 && (
                        <div
                          className={cn(
                            "flex-1 h-0.5 rounded",
                            idx < stepIndex ? "bg-blue-600" : "bg-gray-200"
                          )}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {isVerified !== null && (
                <div
                  className={cn(
                    "mb-6 rounded-lg border p-3 flex items-start gap-2",
                    isVerified
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-amber-200 bg-amber-50"
                  )}
                >
                  {isVerified ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600" />
                  )}
                  <div>
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isVerified ? "text-emerald-800" : "text-amber-800"
                      )}
                    >
                      {isVerified ? "Verified" : "Awaiting verification"}
                    </p>
                    {!isVerified && (
                      <p className="text-xs text-slate-600">
                        Submit all sections accurately to speed up review.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {loadingPrefill ? (
                <div className="py-10 text-center text-slate-500">Loading…</div>
              ) : (
                <form
                  onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    const first = Object.values(errors)[0] as any;
                    if (first?.message) toast.error(String(first.message));
                  })}
                  className="space-y-8"
                >
                  {stepIndex === 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <HeartPulse className="h-5 w-5 text-blue-600" /> Basic
                        Information
                      </h3>
                      {/* Profile Photo */}
                      <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 ring-2 ring-blue-100">
                            <AvatarImage
                              src={previewUrl || undefined}
                              alt="Profile"
                            />
                            <AvatarFallback className="bg-blue-600 text-white">
                              {/* Fallback could be initials if we had name */}
                              IMG
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <Label htmlFor="profile_image">
                              Profile Image URL (optional)
                            </Label>
                            <div className="flex gap-2">
                              <Input
                                id="profile_image"
                                placeholder="https://..."
                                {...form.register("profile_image")}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={onPickFile}
                              >
                                <UploadCloud className="h-4 w-4 mr-2" /> Upload
                              </Button>
                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={onFileChange}
                                className="hidden"
                              />
                            </div>
                            <p className="text-xs text-slate-500">
                              You can paste a URL now; we'll wire cloud upload
                              later.
                            </p>
                            {previewUrl && (
                              <div className="flex items-center gap-2">
                                <Badge
                                  variant="outline"
                                  className="border-blue-200 text-blue-700"
                                >
                                  Preview Ready
                                </Badge>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setPreviewUrl(null);
                                    selectedFileRef.current = null;
                                    form.setValue("profile_image", "");
                                  }}
                                >
                                  <X className="h-4 w-4 mr-1" /> Clear
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="sex">
                            Sex <RequiredMark />
                          </Label>
                          <div className="relative">
                            <Input
                              id="sex"
                              {...form.register("sex")}
                              placeholder="Male / Female"
                              className="pl-9"
                            />
                            <HeartPulse className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          </div>
                          <FieldError name="sex" />
                        </div>
                        <div>
                          <Label htmlFor="phone_no">
                            Phone Number <RequiredMark />
                          </Label>
                          <div className="relative">
                            <Input
                              id="phone_no"
                              {...form.register("phone_no")}
                              placeholder="(555) 555-1234"
                              className="pl-9"
                            />
                            <Phone className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          </div>
                          <FieldError name="phone_no" />
                        </div>
                        <div>
                          <Label htmlFor="age">
                            Age <RequiredMark />
                          </Label>
                          <div className="relative">
                            <Input
                              id="age"
                              type="number"
                              {...form.register("age", { valueAsNumber: true })}
                              className="pl-9"
                            />
                            <Hash className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          </div>
                          <FieldError name="age" />
                        </div>
                        <div>
                          <Label htmlFor="english_skill">
                            English Skill <RequiredMark />
                          </Label>
                          <div className="relative">
                            <Input
                              id="english_skill"
                              {...form.register("english_skill")}
                              placeholder="Basic / Fluent"
                              className="pl-9"
                            />
                            <Languages className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          </div>
                          <FieldError name="english_skill" />
                        </div>
                      </div>
                    </div>
                  )}

                  {stepIndex === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-green-600" />{" "}
                        Experience Details
                      </h3>
                      <div>
                        <Label htmlFor="experience">Experience</Label>
                        <Textarea
                          id="experience"
                          {...form.register("experience")}
                          placeholder="Describe your caregiving experience"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Share years, specialties (e.g., dementia care), and
                          key responsibilities.
                        </p>
                      </div>
                      <div>
                        <Label htmlFor="state_where_experience_gained">
                          State where experience gained
                        </Label>
                        <Input
                          id="state_where_experience_gained"
                          {...form.register("state_where_experience_gained")}
                        />
                      </div>
                      <div>
                        <Label htmlFor="certifications">Certifications</Label>
                        <Textarea
                          id="certifications"
                          {...form.register("certifications")}
                          placeholder="List certifications (if any)"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Comma-separated. Example: CNA, First Aid/CPR, OIS.
                        </p>
                      </div>
                    </div>
                  )}

                  {stepIndex === 2 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-purple-600" />{" "}
                        Education
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="university_college">
                            University/College
                          </Label>
                          <Input
                            id="university_college"
                            {...form.register("university_college")}
                          />
                        </div>
                        <div>
                          <Label htmlFor="study_field">Field of Study</Label>
                          <Input
                            id="study_field"
                            {...form.register("study_field")}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="degree">Degree</Label>
                          <Input id="degree" {...form.register("degree")} />
                        </div>
                      </div>
                    </div>
                  )}

                  {stepIndex === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <SlidersHorizontal className="h-5 w-5 text-orange-600" />{" "}
                        Preferences
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="suitable_work_days">
                            Suitable Work Days
                          </Label>
                          <Input
                            id="suitable_work_days"
                            {...form.register("suitable_work_days")}
                            placeholder="e.g. Mon-Fri"
                          />
                        </div>
                        <div>
                          <Label htmlFor="suitable_work_shift">
                            Suitable Work Shift
                          </Label>
                          <Input
                            id="suitable_work_shift"
                            {...form.register("suitable_work_shift")}
                            placeholder="e.g. Night shift"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label htmlFor="comfortability">Comfortability</Label>
                          <Textarea
                            id="comfortability"
                            {...form.register("comfortability")}
                            placeholder="What tasks are you comfortable with?"
                          />
                          <FieldError name="comfortability" />
                        </div>
                      </div>
                    </div>
                  )}

                  {stepIndex === 4 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Review & Submit
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        {(() => {
                          const v = form.getValues();
                          return (
                            <>
                              <div className="rounded-lg border p-3 bg-slate-50">
                                <div className="text-slate-500">Sex</div>
                                <div className="font-medium">
                                  {v.sex || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50">
                                <div className="text-slate-500">Phone</div>
                                <div className="font-medium">
                                  {v.phone_no || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50">
                                <div className="text-slate-500">Age</div>
                                <div className="font-medium">
                                  {v.age || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50">
                                <div className="text-slate-500">English</div>
                                <div className="font-medium">
                                  {v.english_skill || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50 md:col-span-2">
                                <div className="text-slate-500">Experience</div>
                                <div className="font-medium whitespace-pre-wrap">
                                  {v.experience || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50">
                                <div className="text-slate-500">
                                  State where experience gained
                                </div>
                                <div className="font-medium">
                                  {v.state_where_experience_gained || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50">
                                <div className="text-slate-500">
                                  Certifications
                                </div>
                                <div className="font-medium whitespace-pre-wrap">
                                  {v.certifications || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50">
                                <div className="text-slate-500">University</div>
                                <div className="font-medium">
                                  {v.university_college || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50">
                                <div className="text-slate-500">Field</div>
                                <div className="font-medium">
                                  {v.study_field || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50">
                                <div className="text-slate-500">Degree</div>
                                <div className="font-medium">
                                  {v.degree || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50">
                                <div className="text-slate-500">
                                  Suitable Work Days
                                </div>
                                <div className="font-medium">
                                  {v.suitable_work_days || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50">
                                <div className="text-slate-500">
                                  Suitable Work Shift
                                </div>
                                <div className="font-medium">
                                  {v.suitable_work_shift || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50 md:col-span-2">
                                <div className="text-slate-500">
                                  Comfortability
                                </div>
                                <div className="font-medium whitespace-pre-wrap">
                                  {v.comfortability || "—"}
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between gap-4 pt-6">
                    <div>
                      {stepIndex === 0 ? (
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
                          onClick={back}
                          disabled={form.formState.isSubmitting}
                        >
                          Back
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-3">
                      {stepIndex < steps.length - 1 && (
                        <Button
                          type="button"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={next}
                        >
                          Next
                        </Button>
                      )}
                      {stepIndex === steps.length - 1 && (
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
                            <>Submit Portfolio</>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
