// app/(auth)/signup/page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, User, Loader2, Building2 } from "lucide-react"

import { FigaLogo } from "@/components/figa-logo"
import { Container, Section } from "@/components/common"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// unify routing for both lowercase roles and Prisma enum roles
function routeForRole(role?: string) {
  const r = (role || "").toLowerCase()
  if (r === "jobseeker" || r === "employee") return "/caregiver/dashboard"
  if (r === "employer") return "/employer/dashboard"
  if (r === "admin") return "/admin"
  if (r === "staff") return "/staff/dashboard"
  return "/dashboard"
}

type UiRole = "jobseeker" | "employer"

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "jobseeker" as UiRole, // maps to EMPLOYEE in DB
  })

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!form.fullname.trim()) throw new Error("Full name is required")
      if (!form.email.includes("@")) throw new Error("Please enter a valid email address")
      if (form.password.length < 6) throw new Error("Password must be at least 6 characters")
      if (form.password !== form.confirmPassword) throw new Error("Passwords do not match")

      // map UI role to Prisma enum for your schema
      const dbRole = form.role === "jobseeker" ? "EMPLOYEE" : "EMPLOYER"

      // create user
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname: form.fullname,
          email: form.email,
          password: form.password,
          role: dbRole,
        }),
      })

      if (!res.ok) {
        let msg = "Registration failed"
        try {
          const data = await res.json()
          if (data?.error) msg = String(data.error)
        } catch (_) {}
        throw new Error(msg)
      }

      // auto sign-in
      const sign = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      })

      if (sign?.error) {
        // user created but signin failed (shouldn’t happen normally)
        throw new Error("Account created, but sign-in failed. Please try signing in.")
      }

      const session = await getSession()
      const role = (session?.user as any)?.role as string | undefined
      router.push(routeForRole(role))
    } catch (err) {
      setError(
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message?: unknown }).message)
          : "Something went wrong. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Section padding="xl">
      <Container size="sm">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
            <FigaLogo size="lg" variant="white" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Create your account</h1>
          <p className="text-slate-600">Join FIGA Care in a minute</p>
        </div>

        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
            <CardDescription className="text-center text-slate-600">
              Fill in your details to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

            <form onSubmit={onSubmit} className="space-y-4">
              {/* Full name */}
              <div className="space-y-2">
                <Label htmlFor="fullname">Full name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="fullname"
                    name="fullname"
                    type="text"
                    placeholder="Your full name"
                    value={form.fullname}
                    onChange={onChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={onChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {/* Role choice */}
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`border rounded-md p-3 flex items-center gap-2 cursor-pointer ${form.role === "jobseeker" ? "border-blue-500 bg-blue-50" : "border-slate-200"}`}>
                    <input
                      type="radio"
                      name="role"
                      className="sr-only"
                      checked={form.role === "jobseeker"}
                      onChange={() => setForm(p => ({ ...p, role: "jobseeker" }))}
                    />
                    <User className="w-4 h-4" />
                    <span>Job Seeker</span>
                  </label>
                  <label className={`border rounded-md p-3 flex items-center gap-2 cursor-pointer ${form.role === "employer" ? "border-green-500 bg-green-50" : "border-slate-200"}`}>
                    <input
                      type="radio"
                      name="role"
                      className="sr-only"
                      checked={form.role === "employer"}
                      onChange={() => setForm(p => ({ ...p, role: "employer" }))}
                    />
                    <Building2 className="w-4 h-4" />
                    <span>Employer</span>
                  </label>
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={form.password}
                    onChange={onChange}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={onChange}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-blue-600" disabled={isLoading}>
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Create Account
              </Button>
            </form>

            <div className="text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link href="/signin" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
