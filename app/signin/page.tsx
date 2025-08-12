// "use client"

// import type React from "react"
// import { useState } from "react"
// import { FigaLogo } from "@/components/figa-logo"
// import { Container, Section } from "@/components/common"
// import { useRouter } from "next/navigation"
// import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// export default function SignInPage() {
//   const router = useRouter()
//   const [showPassword, setShowPassword] = useState(false)
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   })
//   const [error, setError] = useState("")
//   const [isLoading, setIsLoading] = useState(false)

//   const demoCredentials = [
//     { email: "jobseeker@demo.com", password: "demo123", role: "jobseeker" },
//     { email: "employer@demo.com", password: "demo123", role: "employer" },
//     { email: "admin@figacare.com", password: "admin123", role: "admin" },
//     { email: "staff@figacare.com", password: "staff123", role: "staff" },
//   ]

//   const handleLoginSuccess = (role: string) => {
//     switch (role) {
//       case "jobseeker":
//         router.push("/caregiver/dashboard")
//         break
//       case "employer":
//         router.push("/employer/dashboard")
//         break
//       case "admin":
//         router.push("/admin")
//         break
//       case "staff":
//         router.push("/staff/dashboard")
//         break
//       default:
//         router.push("/dashboard")
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setIsLoading(true)

//     try {
//       // Basic validation
//       if (!formData.email.includes("@")) {
//         throw new Error("Please enter a valid email address")
//       }

//       if (formData.password.length < 6) {
//         throw new Error("Password must be at least 6 characters")
//       }

//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       const user = demoCredentials.find((cred) => cred.email === formData.email && cred.password === formData.password)

//       if (!user) {
//         throw new Error("Invalid email or password")
//       }

//       // Call success handler with role
//       handleLoginSuccess(user.role)
//     } catch (err) {
//       setError(
//         typeof err === "object" && err !== null && "message" in err
//           ? String((err as { message?: unknown }).message)
//           : "Login failed. Please try again.",
//       )
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }))
//   }

//   return (
//     <Section padding="xl">
//       <Container size="sm">
//         <div className="flex justify-center mb-6">
//           <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
//             <FigaLogo size="lg" variant="white" />
//           </div>
//         </div>
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-slate-900 mb-4">Welcome Back</h1>
//           <p className="text-slate-600">Sign in to your FIGA Care account</p>
//         </div>

//         <Card className="w-full max-w-md mx-auto">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
//             <CardDescription className="text-center text-slate-600">
//               Enter your credentials to access your account
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="email">Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
//                   <Input
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="Enter your email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className="pl-10"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
//                   <Input
//                     id="password"
//                     name="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={handleChange}
//                     className="pl-10 pr-10"
//                     required
//                     minLength={6}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
//                     aria-label={showPassword ? "Hide password" : "Show password"}
//                   >
//                     {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                   </button>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
//                   Forgot password?
//                 </Link>
//               </div>

//               <Button type="submit" className="w-full bg-blue-500" disabled={isLoading} variant="default">
//                 {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
//                 Sign In
//               </Button>
//             </form>

//             <div className="text-center text-sm text-slate-600">
//               Don't have an account?{" "}
//               <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
//                 Sign up
//               </Link>
//             </div>

//             <div className="mt-6 p-4 bg-blue-50 rounded-md">
//               <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h3>
//               <div className="text-xs text-blue-700 space-y-1">
//                 <div>
//                   <strong>Job Seeker:</strong> jobseeker@demo.com / demo123
//                 </div>
//                 <div>
//                   <strong>Employer:</strong> employer@demo.com / demo123
//                 </div>
//                 <div>
//                   <strong>Admin:</strong> admin@figacare.com / admin123
//                 </div>
//                 <div>
//                   <strong>Staff:</strong> staff@figacare.com / staff123
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </Container>
//     </Section>
//   )
// }

"use client";

import { useState } from "react";
import { FigaLogo } from "@/components/figa-logo";
import { Container, Section } from "@/components/common";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
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
      router.push("/caregiver/dashboard"); 
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
    <Section padding="xl">
      <Container size="sm">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
            <FigaLogo size="lg" variant="white" />
          </div>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Welcome Back</h1>
          <p className="text-slate-600">Sign in to your FIGA Care account</p>
        </div>

        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
            <CardDescription className="text-center text-slate-600">
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
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
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
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
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
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
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
                className="w-full bg-blue-500"
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

            <div className="mt-6 p-4 bg-blue-50 rounded-md">
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
      </Container>
    </Section>
  );
}

