"use client";

import { Button } from "@/components/ui/button";
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
import { ArrowRight, Eye, EyeOff, Heart, User } from "lucide-react";
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

  // For the right side content
  const headWord = "Start";
  const typed1 = "Your  ";
  const line1Rest = "Your ";
  const typed2 = "Journey ";
  const line2 = "Journey ";

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/40">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-300/25 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 items-center">
          {/* Left: Form */}
          <div>
            {/* <div className="mb-6 text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                Create your account
              </h1>
              <p className="text-slate-600">Join FIGA Care to get started</p>
            </div> */}

            <div className="w-full max-w-md lg:max-w-lg mx-auto lg:mx-0">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 bg-white/90 backdrop-blur rounded-2xl border border-slate-200 shadow-xl p-6"
                >
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
                            className={`p-4 border rounded-lg cursor-pointer text-center ${
                              field.value === "EMPLOYEE"
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200"
                            }`}
                          >
                            <RadioGroupItem
                              value="EMPLOYEE"
                              className="sr-only"
                            />
                            Employee
                          </label>
                          <label
                            className={`p-4 border rounded-lg cursor-pointer text-center ${
                              field.value === "EMPLOYER"
                                ? "border-blue-500 bg-blue-50"
                                : "border-slate-200"
                            }`}
                          >
                            <RadioGroupItem
                              value="EMPLOYER"
                              className="sr-only"
                            />
                            Employer
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

                  <div className="text-center text-sm text-gray-600 dark:text-gray-400">
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

          {/* Right: Visual panel (desktop only) */}
          <div className="hidden lg:flex items-center justify-center h-full">
            <div className="space-y-8 animate-slide-up max-w-md">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 px-6 py-3 text-lg font-semibold animate-fade-in rounded-full inline-flex items-center border">
                <Heart className="w-5 h-5 mr-2" />
                Join a Caring Community
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  <span>
                    {headWord}{" "}
                    <span>
                      {typed1}
                      {typed1.length < line1Rest.length ? (
                        <span
                          aria-hidden
                          className="ml-1 inline-block w-0.5 h-8 bg-slate-900 align-middle animate-pulse"
                        />
                      ) : null}
                    </span>
                  </span>
                  <span className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent block animate-gradient">
                    {typed2}
                    {typed1.length === line1Rest.length &&
                    typed2.length < line2.length ? (
                      <span
                        aria-hidden
                        className="ml-1 inline-block w-0.5 h-8 bg-blue-700 align-middle animate-pulse"
                      />
                    ) : null}
                  </span>
                </h1>

                <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed animate-fade-in-delay font-light">
                  Whether you’re a caregiver looking to share your skills, or a family in need of support, FIGA Care makes it easy to connect.
Create your account today and become part of a trusted network built on compassion and reliability.
                </p>
              </div>

              {/* Call to Action Links */}
              <div className="space-y-4 pt-4 animate-fade-in-delay-2">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-xl font-semibold"
                    >
                      Go to Home
                      <ArrowRight className="ml-3 w-6 h-6" />
                    </Button>
                  </Link>

                  <Link href="/about">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto border-2 border-blue-200 hover:bg-blue-50 px-8 py-6 text-xl bg-transparent"
                    >
                      Learn About Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}