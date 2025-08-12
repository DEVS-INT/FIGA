"use client"

import type React from "react"
import { useState } from "react"
import { FigaLogo } from "@/components/figa-logo"
import { Container, Section } from "@/components/common"
import { useRouter } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLoginSuccess = async () => {
    const session = await getSession()
    const role = session?.user?.role
    switch (role) {
      case "EMPLOYEE":
        router.push("/caregiver/dashboard")
        break
      case "EMPLOYER":
        router.push("/employer/dashboard")
        break
      case "ADMIN":
        router.push("/admin")
        break
      case "STAFF":
        router.push("/staff/dashboard")
        break
      default:
        router.push("/")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Basic validation
      if (!formData.email.includes("@")) {
        throw new Error("Please enter a valid email address")
      }

      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters")
      }

      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error("Invalid email or password")
      }

      await handleLoginSuccess()
    } catch (err) {
      setError(
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message?: unknown }).message)
          : "Login failed. Please try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
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
            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-blue-500" disabled={isLoading} variant="default">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Sign In
              </Button>
            </form>

            <div className="text-center text-sm text-slate-600">
              Don't have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign up
              </Link>
            </div>

          </CardContent>
        </Card>
      </Container>
    </Section>
  )
}
