"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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

  return (
    <div className="container mx-auto px-4 py-8 min-h-[calc(100vh-6rem)] grid place-items-start md:place-items-center">
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Stepper */}
        <aside className="lg:col-span-2">
          <div className="sticky top-24">
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-slate-900">
                Your Portfolio
              </h1>
              <p className="text-slate-600">
                Complete your portfolio to get verified and start applying.
              </p>
            </div>
            {isVerified !== null && (
              <div
                className={`mb-4 rounded-lg border p-3 flex items-start gap-2 ${
                  isVerified
                    ? "border-green-200 bg-green-50"
                    : "border-yellow-200 bg-yellow-50"
                }`}
              >
                {isVerified ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 text-yellow-600" />
                )}
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isVerified ? "text-green-800" : "text-yellow-800"
                    }`}
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
            <Card className="shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Verification Steps</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2">
                  {steps.map((s, idx) => {
                    const done = idx < stepIndex;
                    const active = s.key === currentStep;
                    const Icon =
                      idx === 0
                        ? HeartPulse
                        : idx === 1
                        ? ClipboardList
                        : idx === 2
                        ? GraduationCap
                        : idx === 3
                        ? SlidersHorizontal
                        : CheckCircle2;
                    return (
                      <li key={s.key}>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(s.key)}
                          className={`w-full text-left flex items-center gap-3 rounded-lg border px-3 py-2 transition ${
                            active
                              ? "border-blue-300 bg-blue-50"
                              : "border-slate-200 hover:bg-slate-50"
                          }`}
                        >
                          <span
                            className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                              done
                                ? "bg-green-600 text-white"
                                : active
                                ? "bg-blue-600 text-white"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {idx + 1}
                          </span>
                          <Icon
                            className={`h-4 w-4 ${
                              done
                                ? "text-green-600"
                                : active
                                ? "text-blue-600"
                                : "text-slate-500"
                            }`}
                          />
                          <span
                            className={`font-medium ${
                              active ? "text-blue-700" : "text-slate-700"
                            }`}
                          >
                            {s.label}
                          </span>
                          {done && (
                            <CheckCircle2 className="ml-auto h-4 w-4 text-green-600" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4">
                  <Progress value={progress} className="h-2" />
                  <div className="mt-2 text-sm text-slate-600">
                    Step {stepIndex + 1} of {steps.length}:{" "}
                    {steps[stepIndex].label}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Right: Form */}
        <section className="lg:col-span-3">
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {(() => {
                  const I = StepIcon;
                  return <I className="h-5 w-5 text-blue-600" />;
                })()}
                <CardTitle>Verification Form</CardTitle>
              </div>
              <Badge
                variant="outline"
                className="border-blue-200 text-blue-700"
              >
                {steps[stepIndex].label}
              </Badge>
            </CardHeader>
            <CardContent>
              {loadingPrefill ? (
                <div className="py-10 text-center text-slate-500">Loading…</div>
              ) : (
                <form
                  onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    // Show first error message in a toast for visibility
                    const first = Object.values(errors)[0] as any;
                    if (first?.message) toast.error(String(first.message));
                  })}
                  className="space-y-6"
                >
                  {currentStep === "basics" && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sex">
                          Sex <span className="text-red-500">*</span>
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
                          Phone Number <span className="text-red-500">*</span>
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
                          Age <span className="text-red-500">*</span>
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
                          English Skill <span className="text-red-500">*</span>
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
                  )}

                  {currentStep === "experience" && (
                    <div className="space-y-4">
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

                  {currentStep === "education" && (
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
                  )}

                  {currentStep === "preferences" && (
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
                  )}

                  {currentStep === "review" && (
                    <div className="space-y-4 text-sm text-slate-700">
                      <p>
                        Please review your information before submitting. You
                        can go back to make changes.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        {(() => {
                          const v = form.getValues();
                          return (
                            <>
                              <Card className="border-slate-200">
                                <CardHeader className="py-3">
                                  <CardTitle className="text-sm">
                                    Basics
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm space-y-1">
                                  <div>
                                    <span className="text-slate-500">Sex:</span>{" "}
                                    {v.sex || "-"}{" "}
                                  </div>
                                  <div>
                                    <span className="text-slate-500">
                                      Phone:
                                    </span>{" "}
                                    {v.phone_no || "-"}{" "}
                                  </div>
                                  <div>
                                    <span className="text-slate-500">Age:</span>{" "}
                                    {v.age || "-"}{" "}
                                  </div>
                                  <div>
                                    <span className="text-slate-500">
                                      English:
                                    </span>{" "}
                                    {v.english_skill || "-"}{" "}
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="border-slate-200">
                                <CardHeader className="py-3">
                                  <CardTitle className="text-sm">
                                    Experience
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm space-y-1">
                                  <div className="line-clamp-3">
                                    <span className="text-slate-500">
                                      Experience:
                                    </span>{" "}
                                    {v.experience || "-"}{" "}
                                  </div>
                                  <div>
                                    <span className="text-slate-500">
                                      State:
                                    </span>{" "}
                                    {v.state_where_experience_gained || "-"}{" "}
                                  </div>
                                  <div className="line-clamp-2">
                                    <span className="text-slate-500">
                                      Certifications:
                                    </span>{" "}
                                    {v.certifications || "-"}{" "}
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="border-slate-200">
                                <CardHeader className="py-3">
                                  <CardTitle className="text-sm">
                                    Education
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm space-y-1">
                                  <div>
                                    <span className="text-slate-500">
                                      University:
                                    </span>{" "}
                                    {v.university_college || "-"}{" "}
                                  </div>
                                  <div>
                                    <span className="text-slate-500">
                                      Field:
                                    </span>{" "}
                                    {v.study_field || "-"}{" "}
                                  </div>
                                  <div>
                                    <span className="text-slate-500">
                                      Degree:
                                    </span>{" "}
                                    {v.degree || "-"}{" "}
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="border-slate-200">
                                <CardHeader className="py-3">
                                  <CardTitle className="text-sm">
                                    Preferences
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="text-sm space-y-1">
                                  <div>
                                    <span className="text-slate-500">
                                      Work Days:
                                    </span>{" "}
                                    {v.suitable_work_days || "-"}{" "}
                                  </div>
                                  <div>
                                    <span className="text-slate-500">
                                      Work Shift:
                                    </span>{" "}
                                    {v.suitable_work_shift || "-"}{" "}
                                  </div>
                                  <div className="line-clamp-2">
                                    <span className="text-slate-500">
                                      Comfortability:
                                    </span>{" "}
                                    {v.comfortability || "-"}{" "}
                                  </div>
                                </CardContent>
                              </Card>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={back}
                      disabled={stepIndex === 0}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          try {
                            const values = form.getValues();
                            localStorage.setItem(
                              "portfolioDraft",
                              JSON.stringify(values)
                            );
                            // lightweight feedback
                            console.info("Draft saved");
                          } catch {}
                        }}
                      >
                        Save Draft
                      </Button>
                      {stepIndex < steps.length - 1 ? (
                        <Button type="button" onClick={next}>
                          Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button type="submit">Submit</Button>
                      )}
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
