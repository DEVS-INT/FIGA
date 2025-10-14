"use client";

import { useState } from "react";
import { FigaLogo } from "@/components/figa-logo";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Loader2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Home as HomeIcon,
  Heart,
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

      // debug
      // eslint-disable-next-line no-console
      console.debug("signIn result", result);

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success("Signed in successfully!", { position: "top-center" });

      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      // Poll /api/auth/session for the user role (session cookie may take a moment to be available)
      let userRole: string | undefined;
      let attempt = 0;
      const maxAttempts = 10;
      while (attempt < maxAttempts && !userRole) {
        try {
          const res = await fetch("/api/auth/session", { cache: "no-store" });
          const session = await res.json();
          // debug
          // eslint-disable-next-line no-console
          console.debug("session poll", attempt, session);
          userRole = session?.user?.role;
          if (userRole) break;
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error("session poll error", err);
        }
        attempt++;
        // exponential backoff up to ~1s
        await sleep(Math.min(200 * attempt, 1000));
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

  // For the right side content
  const headWord = "Access";
  const typed1 = "Trusted Care";
  const line1Rest = "Trusted Care";
  const typed2 = "Connections";
  const line2 = "Connections";

  return (
    <div className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-100/50 px-4 py-4">
      {/* subtle brand blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Split Card */}
      <div className="relative z-10 w-full max-w-6xl">
        {/* Back button in the top-right of the container */}
        <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20">
          <Button
            type="button"
            size="sm"
            className="rounded-full bg-white/80 hover:bg-white text-slate-700 shadow backdrop-blur"
            onClick={() => router.push("/")}
          >
            <HomeIcon className="w-4 h-4 mr-1.5" /> Home
          </Button>
        </div>
        <div className="grid md:grid-cols-2 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden bg-white/80 backdrop-blur md:h-[600px] lg:h-[640px] max-h-[90svh]">
          {/* Left: form panel */}
          <div className="p-6 sm:p-8 lg:p-10 pt-8 md:pt-10 lg:pt-12 flex h-full justify-center items-start overflow-y-auto">
            <div className="w-full max-w-md">
              <div className="flex items-center justify-center mb-6">
                <FigaLogo size="lg" />
              </div>

              {/* Mobile-only overlay content (show the right-panel text but without the image) */}
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
                    Connect with compassionate caregivers and employers in a safe,
                    secure community.
                  </p>

                  <div className="bg-white/90 text-blue-900 text-sm px-3 py-2 rounded-xl shadow-sm border border-white/60">
                    Compassion meets reliability. Building trusted care connections,
                    one match at a time.
                  </div>
                </div>
              </div>

              <Card className="border-0 shadow-none bg-transparent w-full">
                <CardHeader className="space-y-1 p-0 mb-4">
                  <CardTitle className="text-3xl font-extrabold tracking-tight text-slate-900">
                    Log In
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Welcome back! Please enter your details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-0">
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
                          placeholder="you@example.com"
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
                      Log in
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
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right: image panel */}
          <div className="relative hidden md:block h-full bg-blue-900">
            <Image
              src="/signin.png"
              alt="Caregiver listening to music while holding a bottle"
              fill
              sizes="(max-width: 768px) 0px, 50vw"
              priority
              className="object-cover [object-position:68%_center]"
            />
            {/* Overlay for brand tint and content */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/70 via-blue-700/40 to-transparent" />
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="flex items-center gap-2 text-white/90">
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
            {/* Optional motto below image for balance */}
            <div className="absolute left-4 right-4 bottom-4">
              <div className="bg-white/90 backdrop-blur-sm text-blue-900 text-sm md:text-base px-4 py-3 rounded-xl shadow-md border border-white/60">
                Compassion meets reliability. Building trusted care connections,
                one match at a time.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
