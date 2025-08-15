"use client";

import { useState } from "react";
import Image from "next/image";
import { FigaLogo } from "@/components/figa-logo";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { signIn } from "next-auth/react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function SignInPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success("Signed in successfully!", { position: "top-center" });

      // IMPORTANT: do not keep any unconditional redirect here like:
      // router.push("/employer/dashboard");

      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      // Try to read the role from the session (accounting for slight delay after sign-in)
      let userRole: string | undefined;
      for (let i = 0; i < 5 && !userRole; i++) {
        const res = await fetch("/api/auth/session", { cache: "no-store" });
        const session = await res.json();
        userRole = session?.user?.role;
        if (!userRole) await sleep(200);
      }

      const destinations: Record<string, string> = {
        EMPLOYER: "/employer/dashboard",
        EMPLOYEE: "/caregiver/dashboard",
        STAFF: "/staff/dashboard",
        ADMIN: "/admin/dashboard",
      };

      router.push(destinations[userRole ?? ""] ?? "/dashboard");
    } catch (error) {
      toast.error(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: unknown }).message)
          : "Invalid credentials. Please try again.",
        { position: "top-center" }
      );
    }
  };

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
            <div className="flex justify-center lg:justify-start mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                <FigaLogo size="lg" variant="white" />
              </div>
            </div>
            <div className="mb-6 text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                Welcome back
              </h1>
              <p className="text-slate-600">
                Sign in to your FIGA Care account
              </p>
            </div>

            <Card className="w-full max-w-md lg:max-w-lg mx-auto lg:mx-0 border border-slate-200 shadow-xl bg-white/90 backdrop-blur">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
                <CardDescription className="text-slate-600">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Show error from zod validation or signIn */}
                {errors.email && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                    {errors.email.message}
                  </div>
                )}
                {errors.password && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                    {errors.password.message}
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...register("email")}
                        className="pl-10"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        {...register("password")}
                        className="pl-10 pr-10"
                        minLength={6}
                        required
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl rounded-xl"
                    disabled={isSubmitting}
                    variant="default"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Sign In
                  </Button>
                </form>

                <div className="text-center text-sm text-slate-600">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign up
                  </Link>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-md border border-blue-100">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">
                    Demo Credentials:
                  </h3>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div>
                      <strong>Job Seeker:</strong> jobseeker@demo.com / demo123
                    </div>
                    <div>
                      <strong>Employer:</strong> employer@demo.com / demo123
                    </div>
                    <div>
                      <strong>Admin:</strong> admin@figacare.com / admin123
                    </div>
                    <div>
                      <strong>Staff:</strong> staff@figacare.com / staff123
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Visual panel (desktop only) */}
          <div className="hidden lg:block">
            <div className="relative h-[620px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              {/* Animated gradient background */}
              <div
                className="absolute inset-0 animate-gradient-move bg-gradient-to-br from-blue-600 via-purple-500 to-pink-400"
                style={{ backgroundSize: "200% 200%" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent" />
              <div className="absolute bottom-0 p-8 text-white space-y-3">
                <div className="flex items-center gap-2 text-blue-200">
                  <ShieldCheck className="w-5 h-5" />
                  Secure and private
                </div>
                <div className="flex items-center gap-2 text-blue-200">
                  <Sparkles className="w-5 h-5" />
                  Matched to your needs
                </div>
                <p className="mt-2 text-slate-100 text-lg max-w-md">
                  Compassionate caregivers, trusted by families across the Bay
                  Area.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
