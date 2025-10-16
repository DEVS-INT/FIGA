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
  Hash,
  Languages,
  Loader2,
  Image as ImageIcon,
  UploadCloud,
  X,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Schema mirrored from Portfolio table in Prisma schema
const emptyToUndefined = z
  .string()
  .transform((v) => (v.trim() === "" ? undefined : v));
const optionalText = z
  .union([z.string(), z.literal("")])
  .transform((v) => (v === "" ? undefined : v));

const portfolioSchema = z.object({
  sex: z.string().min(1, "Required"),
  // phone number is captured on the User at signup; not part of portfolio anymore
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
  driving_details: optionalText.optional().nullable(),
  authorized_to_work: optionalText.optional().nullable(),
  currently_employed: optionalText.optional().nullable(),
  reason_left_previous_job: optionalText.optional().nullable(),
  job_type_preference: optionalText.optional().nullable(),
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
  const [draftState, setDraftState] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const saveTimeoutRef = useRef<number | null>(null);

  const form = useForm<PortfolioFormData>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      sex: "",
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
      driving_details: "",
      authorized_to_work: "",
      currently_employed: "",
      reason_left_previous_job: "",
      job_type_preference: "",
    },
    mode: "onBlur",
  });

  // Google Form option sets
  const sexOptions = ["Male", "Female"] as const;
  const certificationOptions = [
    "Tire1",
    "Tire2",
    "OIS",
    "First Aid and CPR",
    "HBS",
  ];
  const experienceOptions = [
    "Less than 1 year",
    "1 year",
    "2 year",
    "3 year",
    "more than 3 years",
    "No Experience",
  ];
  const dayOptions = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const shiftOptions = ["Day shift", "Night shift", "Weekends"];
  const englishOptions = [
    "Very Limited (Can speak a few basic words; relies on gestures or translation)",
    "Basic Beginner (Can introduce self, say simple phrases (e.g., “My name is…”)",
    "Basic Conversational (Can hold short conversations with frequent pauses)",
    "Lower Intermediate (Understands and responds to common questions with effort)",
    "Intermediate (Can discuss daily topics, ask and answer questions clearly",
    "Upper Intermediate (Can express opinions, follow conversations, and clarify misunderstandings)",
    "Advanced (Speaks fluently with few errors, understands complex instructions)",
    "Near-Native (Fluent and confident in both formal and informal settings)",
    "Native/Fluent (Equivalent to someone raised speaking English)",
  ];
  const reasonLeftOptions = [
    "Uncomfortable caregiving setting",
    "Low payment",
    "Disagreement with the owner/provider",
    "Interpersonal challenges with residents",
    "Relocated to a different state or returned to home country",
  ];
  const jobTypeOptions = ["Full time", "Part time", "Any"];

  // Helpers to manage CSV fields
  const parseCsv = (v?: string | null) =>
    (v || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  const toggleCsvValue = (field: keyof PortfolioFormData, value: string) => {
    const cur = parseCsv(form.getValues(field as any) as any);
    const has = cur.includes(value);
    const next = has ? cur.filter((x) => x !== value) : [...cur, value];
    form.setValue(field as any, next.join(","), { shouldDirty: true });
  };

  // Local UI states for optional "Other" inputs
  const [showOtherCerts, setShowOtherCerts] = useState(false);
  const [showOtherDays, setShowOtherDays] = useState(false);
  const [showOtherShifts, setShowOtherShifts] = useState(false);
  const [showOtherReasons, setShowOtherReasons] = useState(false);

  // Small reusable Chip button
  const Chip = ({
    selected,
    onClick,
    children,
  }: {
    selected: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-sm border transition-colors shadow-sm hover:shadow md:active:translate-y-px",
        selected
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
      )}
    >
      {children}
    </button>
  );

  const stepIndex = steps.findIndex((s) => s.key === currentStep);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const next = async () => {
    const fieldsByStep: Record<StepKey, (keyof PortfolioFormData)[]> = {
      basics: ["sex", "age", "english_skill"],
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
      const res = await fetch("/api/caregiver/portfolio?mode=full", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to save portfolio");
      }
      toast.success("Portfolio submitted for verification");
      try {
        // Clear draft and notify header instantly
        localStorage.removeItem("portfolioDraft");
        window.dispatchEvent(new Event("portfolio:submitted"));
      } catch {}
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
      // autosave draft (debounced)
      try {
        setDraftState("saving");
        if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = window.setTimeout(() => {
          try {
            localStorage.setItem("portfolioDraft", JSON.stringify(values));
            setDraftState("saved");
            window.setTimeout(() => setDraftState("idle"), 1500);
          } catch {}
        }, 500);
      } catch {}
    });
    return () => sub.unsubscribe();
  }, [form]);

  // Track selected file (not uploaded yet)
  const selectedFileRef = useRef<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const onPickFile = () => fileInputRef.current?.click();
  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0];
    selectedFileRef.current = f || null;
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
      // upload immediately to Cloudinary (unsigned preset)
      void (async () => {
        try {
          setUploading(true);
          const fd = new FormData();
          fd.append("file", f);

          // POST file to our server-side upload handler
          const res = await fetch("/api/uploads/cloudinary", {
            method: "POST",
            body: fd,
          });
          if (!res.ok) {
            const text = await res.text();
            throw new Error(text || "Upload failed");
          }
          const json = await res.json();
          const urlFromCloud = json?.secure_url || json?.url;
          if (!urlFromCloud) throw new Error("No URL returned from upload API");

          // set form value to Cloudinary URL
          form.setValue("profile_image", urlFromCloud, { shouldDirty: true });
          setPreviewUrl(urlFromCloud);
          // clear the selected file ref (we now have a hosted URL)
          selectedFileRef.current = null;
          // Notify user and notify UI (header) that a new profile image is available
          toast.success("Image uploaded");
          try {
            // persist to localStorage under a per-user key so only this user's
            // clients pick it up. Also include userId in the event detail.
            const userId = session?.user?.id;
            const key = userId ? `figa:profileImage:${userId}` : "figa:profileImage";
            localStorage.setItem(key, urlFromCloud);
            window.dispatchEvent(
              new CustomEvent("profile:image:uploaded", {
                detail: { userId, url: urlFromCloud },
              })
            );
          } catch (e) {}
        } catch (err) {
          console.error(err);
          toast.error(err instanceof Error ? err.message : "Upload failed");
        } finally {
          setUploading(false);
        }
      })();
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
              driving_details: p.driving_details || "",
              authorized_to_work: p.authorized_to_work || "",
              currently_employed: p.currently_employed || "",
              reason_left_previous_job: p.reason_left_previous_job || "",
              job_type_preference: p.job_type_preference || "",
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
                <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
                  <span>
                    Step {stepIndex + 1} of {steps.length}
                  </span>
                  {draftState !== "idle" && (
                    <span className="flex items-center gap-1">
                      {draftState === "saving" ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" /> Saving…
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />{" "}
                          Saved
                        </>
                      )}
                    </span>
                  )}
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
                            <Label
                              htmlFor="profile_image"
                              className="block mb-1.5"
                            >
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
                                disabled={uploading}
                              >
                                <UploadCloud className="h-4 w-4 mr-2" />
                                {uploading ? "Uploading..." : "Upload"}
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

                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2 min-w-0">
                          <Label className="block mb-1.5">
                            Sex <RequiredMark />
                          </Label>
                          <div className="flex gap-2 mt-2">
                            {sexOptions.map((o) => (
                              <Chip
                                key={o}
                                selected={form.watch("sex") === o}
                                onClick={() =>
                                  form.setValue("sex", o, { shouldDirty: true })
                                }
                              >
                                {o}
                              </Chip>
                            ))}
                          </div>
                          <FieldError name="sex" />
                        </div>
                        {/* Phone is captured at signup now */}
                        <div className="space-y-2 min-w-0">
                          <Label htmlFor="age" className="block mb-1.5">
                            Age <RequiredMark />
                          </Label>
                          <div className="relative">
                            <Input
                              id="age"
                              type="number"
                              {...form.register("age", { valueAsNumber: true })}
                              className="pl-9 w-full"
                            />
                            <Hash className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          </div>
                          <FieldError name="age" />
                        </div>
                        <div className="space-y-2 min-w-0">
                          <Label
                            htmlFor="english_skill"
                            className="block mb-1.5"
                          >
                            English Skill <RequiredMark />
                          </Label>
                          <div className="relative ">
                            <Select
                              onValueChange={(v) =>
                                form.setValue("english_skill", v, {
                                  shouldDirty: true,
                                })
                              }
                              value={form.watch("english_skill")}
                            >
                              <SelectTrigger className="w-full md:w-auto pl-9 whitespace-normal">
                                  <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                              <SelectContent>
                                {englishOptions.map((o) => (
                                  <SelectItem key={o} value={o}>
                                    {o}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Languages className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          </div>
                          <FieldError name="english_skill" />
                        </div>
                      </div>
                    </div>
                  )}

                  {stepIndex === 1 && (
                    <div className="space-y-5">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-green-600" />{" "}
                        Experience Details
                      </h3>
                      <div className="space-y-2">
                        <Label className="block mb-1.5">
                          Experience (years)
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {experienceOptions.map((o) => (
                            <Chip
                              key={o}
                              selected={form.watch("experience") === o}
                              onClick={() =>
                                form.setValue("experience", o, {
                                  shouldDirty: true,
                                })
                              }
                            >
                              {o}
                            </Chip>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500">
                          Pick the closest match—no need to be exact.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="state_where_experience_gained"
                          className="block mb-1.5"
                        >
                          State where experience gained
                        </Label>
                        <Input
                          id="state_where_experience_gained"
                          {...form.register("state_where_experience_gained")}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="block mb-1.5">
                          What certifications or trainings do you have?
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {certificationOptions.map((o) => {
                            const selected = parseCsv(
                              form.watch("certifications")
                            ).includes(o);
                            return (
                              <Chip
                                key={o}
                                selected={selected}
                                onClick={() =>
                                  toggleCsvValue("certifications", o)
                                }
                              >
                                {o}
                              </Chip>
                            );
                          })}
                          <Chip
                            selected={showOtherCerts}
                            onClick={() => setShowOtherCerts((s) => !s)}
                          >
                            + Other
                          </Chip>
                        </div>
                        {showOtherCerts && (
                          <div className="mt-2">
                            <Input
                              placeholder="Other (comma-separated)"
                              value={(() => {
                                const cur = parseCsv(
                                  form.watch("certifications")
                                );
                                const known = new Set(certificationOptions);
                                const others = cur.filter(
                                  (x) => !known.has(x as any)
                                );
                                return others.join(", ");
                              })()}
                              onChange={(e) => {
                                const cur = new Set(
                                  parseCsv(form.watch("certifications"))
                                );
                                certificationOptions.forEach((o) =>
                                  cur.delete(o)
                                );
                                e.target.value
                                  .split(",")
                                  .map((s) => s.trim())
                                  .filter(Boolean)
                                  .forEach((v) => cur.add(v));
                                form.setValue(
                                  "certifications",
                                  Array.from(cur).join(","),
                                  { shouldDirty: true }
                                );
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="block mb-1.5">
                          Do you have a valid driver’s license?
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {["Yes", "No"].map((o) => (
                            <Chip
                              key={o}
                              selected={
                                (form.watch("driving_details") || "") === o
                              }
                              onClick={() =>
                                form.setValue("driving_details", o, {
                                  shouldDirty: true,
                                })
                              }
                            >
                              {o}
                            </Chip>
                          ))}
                        </div>
                        <p className="text-xs text-slate-500">
                          Tap “+ Other” to add anything not listed.
                        </p>
                      </div>
                    </div>
                  )}

                  {stepIndex === 2 && (
                    <div className="space-y-5">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-purple-600" />{" "}
                        Education
                      </h3>
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <Label
                            htmlFor="university_college"
                            className="block mb-1.5"
                          >
                            University/College
                          </Label>
                          <Input
                            id="university_college"
                            {...form.register("university_college")}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="study_field" className="block mb-1.5">
                            Field of Study
                          </Label>
                          <Input
                            id="study_field"
                            {...form.register("study_field")}
                          />
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="degree" className="block mb-1.5">
                            Degree
                          </Label>
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
                      <div className="grid md:grid-cols-2 gap-5">
                        <div className="md:col-span-2 space-y-2">
                          <Label className="block mb-1.5">
                            Which days are you available to work?
                          </Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {dayOptions.map((d) => {
                              const selected = parseCsv(
                                form.watch("suitable_work_days")
                              ).includes(d);
                              return (
                                <Chip
                                  key={d}
                                  selected={selected}
                                  onClick={() =>
                                    toggleCsvValue("suitable_work_days", d)
                                  }
                                >
                                  {d}
                                </Chip>
                              );
                            })}
                            <Chip
                              selected={showOtherDays}
                              onClick={() => setShowOtherDays((s) => !s)}
                            >
                              + Other
                            </Chip>
                          </div>
                          {showOtherDays && (
                            <div className="mt-2">
                              <Input
                                placeholder="Other day(s) (comma-separated)"
                                onChange={(e) => {
                                  const days = new Set(
                                    parseCsv(form.watch("suitable_work_days"))
                                  );
                                  dayOptions.forEach((o) => days.delete(o));
                                  e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                                    .forEach((v) => days.add(v));
                                  form.setValue(
                                    "suitable_work_days",
                                    Array.from(days).join(","),
                                    { shouldDirty: true }
                                  );
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label className="block mb-1.5">
                            Which shifts are you available to work?
                          </Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {shiftOptions.map((s) => {
                              const selected = parseCsv(
                                form.watch("suitable_work_shift")
                              ).includes(s);
                              return (
                                <Chip
                                  key={s}
                                  selected={selected}
                                  onClick={() =>
                                    toggleCsvValue("suitable_work_shift", s)
                                  }
                                >
                                  {s}
                                </Chip>
                              );
                            })}
                            <Chip
                              selected={showOtherShifts}
                              onClick={() => setShowOtherShifts((s) => !s)}
                            >
                              + Other
                            </Chip>
                          </div>
                          {showOtherShifts && (
                            <div className="mt-2">
                              <Input
                                placeholder="Other shift(s) (comma-separated)"
                                onChange={(e) => {
                                  const shifts = new Set(
                                    parseCsv(form.watch("suitable_work_shift"))
                                  );
                                  shiftOptions.forEach((o) => shifts.delete(o));
                                  e.target.value
                                    .split(",")
                                    .map((s) => s.trim())
                                    .filter(Boolean)
                                    .forEach((v) => shifts.add(v));
                                  form.setValue(
                                    "suitable_work_shift",
                                    Array.from(shifts).join(","),
                                    { shouldDirty: true }
                                  );
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label
                            htmlFor="comfortability"
                            className="block mb-1.5"
                          >
                            Are you comfortable assisting with personal care
                            (e.g., showering, toileting, feeding)?
                          </Label>
                          <Select
                            onValueChange={(v) =>
                              form.setValue("comfortability", v, {
                                shouldDirty: true,
                              })
                            }
                            value={form.watch("comfortability")}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Yes or No" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                          <FieldError name="comfortability" />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="authorized_to_work"
                            className="block mb-1.5"
                          >
                            Are you legally authorized to work in the U.S. and
                            able to be on payroll?
                          </Label>
                          <Select
                            onValueChange={(v) =>
                              form.setValue("authorized_to_work", v, {
                                shouldDirty: true,
                              })
                            }
                            value={form.watch("authorized_to_work") || ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Yes or No" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor="currently_employed"
                            className="block mb-1.5"
                          >
                            Are you currently employed?
                          </Label>
                          <Select
                            onValueChange={(v) =>
                              form.setValue("currently_employed", v, {
                                shouldDirty: true,
                              })
                            }
                            value={form.watch("currently_employed") || ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Yes or No" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Yes">Yes</SelectItem>
                              <SelectItem value="No">No</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {form.watch("currently_employed") === "No" && (
                          <div className="md:col-span-2 space-y-2">
                            <Label className="block mb-1.5">
                              If you are not currently employed, why did you
                              leave your previous job?
                            </Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {reasonLeftOptions.map((r) => {
                                const selected = parseCsv(
                                  form.watch("reason_left_previous_job")
                                ).includes(r);
                                return (
                                  <Chip
                                    key={r}
                                    selected={selected}
                                    onClick={() =>
                                      toggleCsvValue(
                                        "reason_left_previous_job",
                                        r
                                      )
                                    }
                                  >
                                    {r}
                                  </Chip>
                                );
                              })}
                              <Chip
                                selected={showOtherReasons}
                                onClick={() => setShowOtherReasons((s) => !s)}
                              >
                                + Other
                              </Chip>
                            </div>
                            {showOtherReasons && (
                              <div className="mt-2">
                                <Input
                                  placeholder="Other reason(s) (comma-separated)"
                                  onChange={(e) => {
                                    const cur = new Set(
                                      parseCsv(
                                        form.watch("reason_left_previous_job")
                                      )
                                    );
                                    reasonLeftOptions.forEach((o) =>
                                      cur.delete(o)
                                    );
                                    e.target.value
                                      .split(",")
                                      .map((s) => s.trim())
                                      .filter(Boolean)
                                      .forEach((v) => cur.add(v));
                                    form.setValue(
                                      "reason_left_previous_job",
                                      Array.from(cur).join(","),
                                      { shouldDirty: true }
                                    );
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label className="block mb-1.5">
                            Are you looking for part-time, full-time, etc.,
                            work?
                          </Label>
                          <Select
                            onValueChange={(v) =>
                              form.setValue("job_type_preference", v, {
                                shouldDirty: true,
                              })
                            }
                            value={form.watch("job_type_preference") || ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {jobTypeOptions.map((o) => (
                                <SelectItem key={o} value={o}>
                                  {o}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {/* Redundant raw inputs removed in favor of selects/chips above */}
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
                              {/* Phone is stored on your account; omitted from portfolio review */}
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
                              <div className="rounded-lg border p-3 bg-slate-50 md:col-span-2">
                                <div className="text-slate-500">
                                  Driving and License
                                </div>
                                <div className="font-medium whitespace-pre-wrap">
                                  {v.driving_details || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50">
                                <div className="text-slate-500">
                                  Authorized to Work
                                </div>
                                <div className="font-medium">
                                  {v.authorized_to_work || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50">
                                <div className="text-slate-500">
                                  Currently Employed
                                </div>
                                <div className="font-medium">
                                  {v.currently_employed || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50 md:col-span-2">
                                <div className="text-slate-500">
                                  Reason Left Previous Job
                                </div>
                                <div className="font-medium whitespace-pre-wrap">
                                  {v.reason_left_previous_job || "—"}
                                </div>
                              </div>
                              <div className="rounded-lg border p-3 bg-slate-50">
                                <div className="text-slate-500">
                                  Job Type Preference
                                </div>
                                <div className="font-medium">
                                  {v.job_type_preference || "—"}
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
                      {draftState !== "idle" && (
                        <span className="ml-3 inline-flex items-center gap-1 text-xs text-slate-600">
                          {draftState === "saving" ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin" />{" "}
                              Saving…
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-emerald-600" />{" "}
                              Saved
                            </>
                          )}
                        </span>
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
