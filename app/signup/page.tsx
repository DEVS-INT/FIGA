"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FigaLogo } from "@/components/figa-logo";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Heart,
  User,
  Briefcase,
  Phone,
  Home as HomeIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

const formSchema = z
  .object({
    fullname: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .min(7, "Enter a valid phone number")
      .max(20, "Phone seems too long"),
    role: z.enum(["EMPLOYER", "EMPLOYEE"], {
      required_error: "Role is required",
    }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[a-z]/, "Must contain at least one lowercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

export default function SignUpPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      phone: "",
      role: "EMPLOYEE",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to sign up");
      }

      toast.success("Account created successfully!", {
        position: "top-center",
      });
      router.push("/signin");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Unexpected error", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100/50 px-4 py-4">
      {/* subtle brand blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {/* Home button in the top-left of the container */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 z-20">
          <Button
            type="button"
            size="sm"
            className="rounded-full bg-white/80 hover:bg-white text-slate-700 shadow backdrop-blur"
            onClick={() => router.push("/")}
          >
            <HomeIcon className="w-4 h-4 mr-1.5" /> Home
          </Button>
        </div>
        <div className="grid md:grid-cols-2 rounded-3xl shadow-2xl border border-slate-200 overflow-auto md:overflow-hidden bg-white/80 backdrop-blur md:h-[600px] lg:h-[640px] max-h-[90svh] min-h-0">
          {/* Left: image panel (mirrored vs. sign-in) */}
          <div className="relative hidden md:block h-full bg-blue-900">
            <Image
              src="/signin.png"
              alt="Caregiver focused and ready"
              fill
              sizes="(max-width: 768px) 0px, 50vw"
              priority
              className="object-cover [object-position:68%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/70 via-blue-700/40 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="flex items-center justify-end text-white/90">
                <span className="inline-flex items-center bg-white/10 backdrop-blur px-3 py-1 rounded-full border border-white/20 text-sm">
                  <Heart className="w-4 h-4 mr-1" /> Caring made simple
                </span>
              </div>
              <div className="text-white">
                <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
                  Your trusted partner in care
                </h2>
                <p className="mt-3 text-white/80 max-w-sm">
                  Connect with compassionate caregivers and employers in a safe,
                  secure community.
                </p>
              </div>
            </div>
            {/* Motto below the image area */}
            <div className="absolute left-4 right-4 bottom-4">
              <div className="bg-white/90 backdrop-blur-sm text-blue-900 text-sm md:text-base px-4 py-3 rounded-xl shadow-md border border-white/60">
                Compassion meets reliability. Building trusted care connections,
                one match at a time.
              </div>
            </div>
          </div>

          {/* Right: form panel */}
          <div className="p-6 sm:p-8 lg:p-10 pt-8 md:pt-10 lg:pt-12 flex h-full justify-center items-start overflow-y-auto min-h-0">
            <div className="w-full max-w-md">
              <div className="flex items-center justify-center mb-6">
                <FigaLogo size="lg" />
              </div>

              {/* Mobile-only overlay content (show the left-panel text but without the image) */}
              <div className="block md:hidden mb-6">
                <div className="rounded-2xl p-4 bg-gradient-to-tr from-blue-900/85 via-blue-700/50 to-indigo-600 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center bg-white/10 backdrop-blur px-3 py-1 rounded-full border border-white/20 text-sm">
                      <Heart className="w-4 h-4 mr-1" /> Caring made simple
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold leading-tight mb-2">
                    Your trusted partner in care
                  </h2>
                  <p className="text-white/80 mb-3">
                    Connect with compassionate caregivers and employers in a
                    safe, secure community.
                  </p>

                  <div className="bg-white/90 text-blue-900 text-sm px-3 py-2 rounded-xl shadow-sm border border-white/60">
                    Compassion meets reliability. Building trusted care
                    connections, one match at a time.
                  </div>
                </div>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 bg-transparent"
                >
                  <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                      Sign Up
                    </h1>
                    <p className="text-slate-600 mt-1">
                      Join FIGA Care to get started
                    </p>
                  </div>

                  {/* Role Selection */}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">
                          I am a...
                        </FormLabel>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="grid grid-cols-2 gap-4"
                        >
                          <label
                            className={`p-4 border rounded-lg cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                              field.value === "EMPLOYEE"
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200"
                            }`}
                          >
                            <RadioGroupItem
                              value="EMPLOYEE"
                              className="sr-only"
                            />
                            <User
                              className={
                                field.value === "EMPLOYEE"
                                  ? "text-blue-600"
                                  : "text-slate-500"
                              }
                            />
                            <span>Employee</span>
                          </label>
                          <label
                            className={`p-4 border rounded-lg cursor-pointer text-center flex flex-col items-center justify-center gap-2 ${
                              field.value === "EMPLOYER"
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200"
                            }`}
                          >
                            <RadioGroupItem
                              value="EMPLOYER"
                              className="sr-only"
                            />
                            <Briefcase
                              className={
                                field.value === "EMPLOYER"
                                  ? "text-blue-600"
                                  : "text-slate-500"
                              }
                            />
                            <span>Employer</span>
                          </label>
                        </RadioGroup>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Full Name */}
                  <FormField
                    control={form.control}
                    name="fullname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="John Doe" />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="your@email.com"
                            type="email"
                          />
                        </FormControl>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Phone (moved below Email) */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="(555) 555-1234"
                              {...field}
                              className="pl-9"
                            />
                            <Phone className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">
                          Password
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <ul className="text-xs text-gray-500 mt-1 space-y-1">
                          <li
                            className={
                              field.value?.length >= 8 ? "text-green-500" : ""
                            }
                          >
                            • At least 8 characters
                          </li>
                          <li
                            className={
                              /[A-Z]/.test(field.value) ? "text-green-500" : ""
                            }
                          >
                            • One uppercase letter
                          </li>
                          <li
                            className={
                              /[a-z]/.test(field.value) ? "text-green-500" : ""
                            }
                          >
                            • One lowercase letter
                          </li>
                          <li
                            className={
                              /[0-9]/.test(field.value) ? "text-green-500" : ""
                            }
                          >
                            • One number
                          </li>
                        </ul>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700">
                          Confirm Password
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        <FormMessage className="text-red-500 text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>

                  <div className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                      href="/signin"
                      className="font-medium text-blue-600 hover:text-blue-500"
                    >
                      Sign in
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
