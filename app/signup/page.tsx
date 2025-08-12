// "use client"

// import React, { useState } from 'react'
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Checkbox } from "@/components/ui/checkbox"
// import { AlertCircle } from 'lucide-react'
// import Link from "next/link"
// import { useRouter } from 'next/navigation'
// import { FigaLogo } from "@/components/figa-logo"
// import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from 'lucide-react'

// type UserRole = 'professional' | 'employer'

// interface FormData {
//   fullname: string
//   email: string
//   role: UserRole
//   password: string
//   confirmPassword: string
// }

// export default function SignUpPage() {
//   const [showPassword, setShowPassword] = useState(false)
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false)
//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()

//   const [formData, setFormData] = useState<FormData>({
//     fullname: '',
//     email: '',
//     role: 'professional',
//     password: '',
//     confirmPassword: ''
//   })

//   const handleInputChange = (field: keyof FormData, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }))
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }))
//     }
//   }

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {}

//     if (!formData.fullname.trim()) {
//       newErrors.fullname = 'Full name is required'
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required'
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Please enter a valid email address'
//     }

//     if (!formData.password) {
//       newErrors.password = 'Password is required'
//     } else if (formData.password.length < 8) {
//       newErrors.password = 'Password must be at least 8 characters'
//     }

//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password'
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match'
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
    
//     if (!validateForm()) {
//       return
//     }

//     setIsLoading(true)

//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1500))

//     // Redirect based on role
//     if (formData.role === 'professional') {
//       router.push('/dashboard/professional')
//     } else {
//       router.push('/dashboard/employer')
//     }

//     setIsLoading(false)
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/30 py-12 px-4">
//       {/* Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl"></div>
//       </div>

//       <div className="max-w-md mx-auto relative">
//         <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-lg rounded-3xl overflow-hidden">
//           <CardHeader className="text-center pb-8 pt-12 px-8">
//             <div className="flex justify-center mb-6">
//               <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
//                 <FigaLogo size="lg" variant="white" />
//               </div>
//             </div>
//             <CardTitle className="text-3xl font-bold text-slate-900 mb-4">
//               Join FIGA LLC
//             </CardTitle>
//             <p className="text-lg text-slate-600 leading-relaxed">
//               Create your account to get started
//             </p>
//           </CardHeader>

//           <CardContent className="px-8 pb-8">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Role Selection */}
//               <div className="space-y-4">
//                 <Label className="text-lg font-semibold text-slate-900">
//                   I am a...
//                 </Label>
//                 <RadioGroup
//                   value={formData.role}
//                   onValueChange={(value: UserRole) => handleInputChange('role', value)}
//                   className="grid grid-cols-2 gap-4"
//                 >
//                   <div className="relative">
//                     <RadioGroupItem value="professional" id="professional" className="peer sr-only" />
//                     <Label
//                       htmlFor="professional"
//                       className="flex flex-col items-center p-4 rounded-xl border-2 border-slate-200 cursor-pointer transition-all duration-300 hover:border-blue-300 hover:bg-blue-50/50 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:shadow-lg"
//                     >
//                       <User className="w-6 h-6 text-blue-600 mb-2" />
//                       <div className="font-medium text-slate-900">Professional</div>
//                     </Label>
//                   </div>

//                   <div className="relative">
//                     <RadioGroupItem value="employer" id="employer" className="peer sr-only" />
//                     <Label
//                       htmlFor="employer"
//                       className="flex flex-col items-center p-4 rounded-xl border-2 border-slate-200 cursor-pointer transition-all duration-300 hover:border-green-300 hover:bg-green-50/50 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:shadow-lg"
//                     >
//                       <User className="w-6 h-6 text-green-600 mb-2" />
//                       <div className="font-medium text-slate-900">Employer</div>
//                     </Label>
//                   </div>
//                 </RadioGroup>
//               </div>

//               {/* Full Name */}
//               <div className="space-y-2">
//                 <Label htmlFor="fullname" className="text-base font-semibold text-slate-700">
//                   Full Name *
//                 </Label>
//                 <div className="relative">
//                   <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//                   <Input
//                     id="fullname"
//                     type="text"
//                     placeholder="Your full name"
//                     value={formData.fullname}
//                     onChange={(e) => handleInputChange('fullname', e.target.value)}
//                     className={`pl-12 h-12 text-base rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 ${errors.fullname ? 'border-red-300 focus:border-red-500' : ''}`}
//                   />
//                 </div>
//                 {errors.fullname && (
//                   <p className="text-red-600 text-sm flex items-center mt-1">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.fullname}
//                   </p>
//                 )}
//               </div>

//               {/* Email */}
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="text-base font-semibold text-slate-700">
//                   Email Address *
//                 </Label>
//                 <div className="relative">
//                   <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//                   <Input
//                     id="email"
//                     type="email"
//                     placeholder="Enter your email address"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange('email', e.target.value)}
//                     className={`pl-12 h-12 text-base rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="text-red-600 text-sm flex items-center mt-1">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.email}
//                   </p>
//                 )}
//               </div>

//               {/* Password */}
//               <div className="space-y-2">
//                 <Label htmlFor="password" className="text-base font-semibold text-slate-700">
//                   Password *
//                 </Label>
//                 <div className="relative">
//                   <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//                   <Input
//                     id="password"
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Create a password"
//                     value={formData.password}
//                     onChange={(e) => handleInputChange('password', e.target.value)}
//                     className={`pl-12 pr-12 h-12 text-base rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 ${errors.password ? 'border-red-300 focus:border-red-500' : ''}`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
//                   >
//                     {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="text-red-600 text-sm flex items-center mt-1">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.password}
//                   </p>
//                 )}
//               </div>

//               {/* Confirm Password */}
//               <div className="space-y-2">
//                 <Label htmlFor="confirmPassword" className="text-base font-semibold text-slate-700">
//                   Confirm Password *
//                 </Label>
//                 <div className="relative">
//                   <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
//                   <Input
//                     id="confirmPassword"
//                     type={showConfirmPassword ? "text" : "password"}
//                     placeholder="Confirm your password"
//                     value={formData.confirmPassword}
//                     onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
//                     className={`pl-12 pr-12 h-12 text-base rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}`}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
//                   >
//                     {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//                   </button>
//                 </div>
//                 {errors.confirmPassword && (
//                   <p className="text-red-600 text-sm flex items-center mt-1">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.confirmPassword}
//                   </p>
//                 )}
//               </div>

//               {/* Terms and Conditions */}
//               <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-xl">
//                 <Checkbox id="terms" className="mt-1" required />
//                 <Label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
//                   I agree to the{' '}
//                   <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
//                     Terms of Service
//                   </Link>{' '}
//                   and{' '}
//                   <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
//                     Privacy Policy
//                   </Link>
//                 </Label>
//               </div>

//               {/* Submit Button */}
//               <Button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full h-12 font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
//               >
//                 {isLoading ? (
//                   <div className="flex items-center">
//                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
//                     Creating Account...
//                   </div>
//                 ) : (
//                   <div className="flex items-center">
//                     Create Account
//                     <ArrowRight className="ml-2 w-5 h-5" />
//                   </div>
//                 )}
//               </Button>
//             </form> 

//             <div className="mt-6 text-center">
//               <p className="text-slate-600">
//                 Already have an account?{' '}
//                 <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-semibold">
//                   Log in here
//                 </Link>
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   )
// }

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
import { Eye, EyeOff, User } from "lucide-react";
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

      toast.success("Account created successfully!", { position: "top-center" });
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md">
              <User className="text-white w-7 h-7" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Join Our Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create your account to get started
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    I am a...
                  </FormLabel>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="grid grid-cols-2 gap-4"
                  >
                    <label className={`p-4 border rounded-lg cursor-pointer text-center ${field.value === "EMPLOYEE" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
                      <RadioGroupItem value="EMPLOYEE" className="sr-only" />
                      Employee
                    </label>
                    <label className={`p-4 border rounded-lg cursor-pointer text-center ${field.value === "EMPLOYER" ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}>
                      <RadioGroupItem value="EMPLOYER" className="sr-only" />
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
                  <FormLabel className="text-gray-700 dark:text-gray-300">
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
                  <FormLabel className="text-gray-700 dark:text-gray-300">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="your@email.com" type="email" />
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
                  <FormLabel className="text-gray-700 dark:text-gray-300">
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
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <ul className="text-xs text-gray-500 mt-1 space-y-1">
                    <li className={field.value?.length >= 8 ? "text-green-500" : ""}>
                      • At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(field.value) ? "text-green-500" : ""}>
                      • One uppercase letter
                    </li>
                    <li className={/[a-z]/.test(field.value) ? "text-green-500" : ""}>
                      • One lowercase letter
                    </li>
                    <li className={/[0-9]/.test(field.value) ? "text-green-500" : ""}>
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
                  <FormLabel className="text-gray-700 dark:text-gray-300">
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
