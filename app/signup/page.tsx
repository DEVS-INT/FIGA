"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { FigaLogo } from "@/components/figa-logo"
import { Eye, EyeOff, User, Mail, Lock, MapPin, Phone, Building2, ArrowRight, Heart, Users, CheckCircle2, AlertCircle, Globe, Calendar, Clock } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'

type UserRole = 'professional' | 'employer'

interface FormData {
  role: UserRole
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  // Professional specific
  location: string
  languages: string[]
  availability: string[]
  // Employer specific
  organizationName: string
  businessAddress: string
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState<FormData>({
    role: 'professional',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    location: '',
    languages: [],
    availability: [],
    organizationName: '',
    businessAddress: ''
  })

  const languageOptions = [
    'English', 'Spanish', 'French', 'German', 'Mandarin', 'Japanese', 'Korean', 'Other'
  ]

  const availabilityOptions = [
    'Full-time', 'Part-time', 'Contract', 'Freelance', 'Remote', 'On-site', 'Hybrid'
  ]

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleLanguageChange = (language: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      languages: checked 
        ? [...prev.languages, language]
        : prev.languages.filter(l => l !== language)
    }))
  }

  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: checked 
        ? [...prev.availability, availability]
        : prev.availability.filter(a => a !== availability)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Common validations
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Role-specific validations
    if (formData.role === 'professional') {
      if (!formData.location.trim()) {
        newErrors.location = 'Location is required'
      }
      if (formData.languages.length === 0) {
        newErrors.languages = 'Please select at least one language'
      }
      if (formData.availability.length === 0) {
        newErrors.availability = 'Please select your availability'
      }
    } else if (formData.role === 'employer') {
      if (!formData.organizationName.trim()) {
        newErrors.organizationName = 'Organization name is required'
      }
      if (!formData.businessAddress.trim()) {
        newErrors.businessAddress = 'Business address is required'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Redirect based on role
    if (formData.role === 'professional') {
      router.push('/dashboard/professional')
    } else {
      router.push('/dashboard/employer')
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/30 py-12 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-lg rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-8 pt-12 px-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                <FigaLogo size="lg" variant="white" />
              </div>
            </div>
            <CardTitle className="text-4xl font-bold text-slate-900 mb-4">
              Join FIGA LLC
            </CardTitle>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Connect with top professionals or find your next opportunity through our platform
            </p>
          </CardHeader>

          <CardContent className="px-12 pb-12">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Role Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-slate-900">
                  I am a...
                </Label>
                <RadioGroup
                  value={formData.role}
                  onValueChange={(value: UserRole) => handleInputChange('role', value)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="relative">
                    <RadioGroupItem value="professional" id="professional" className="peer sr-only" />
                    <Label
                      htmlFor="professional"
                      className="flex items-center space-x-4 p-6 rounded-2xl border-2 border-slate-200 cursor-pointer transition-all duration-300 hover:border-blue-300 hover:bg-blue-50/50 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:shadow-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 text-lg">Professional</div>
                        <div className="text-slate-600">I'm looking for opportunities</div>
                      </div>
                    </Label>
                  </div>

                  <div className="relative">
                    <RadioGroupItem value="employer" id="employer" className="peer sr-only" />
                    <Label
                      htmlFor="employer"
                      className="flex items-center space-x-4 p-6 rounded-2xl border-2 border-slate-200 cursor-pointer transition-all duration-300 hover:border-green-300 hover:bg-green-50/50 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:shadow-lg"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 text-lg">Employer</div>
                        <div className="text-slate-600">I need to hire professionals</div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-base font-semibold text-slate-700">
                    First Name *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`pl-12 h-14 text-lg rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 ${errors.firstName ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.firstName}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-base font-semibold text-slate-700">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`h-14 text-lg rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 ${errors.lastName ? 'border-red-300 focus:border-red-500' : ''}`}
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-semibold text-slate-700">
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`pl-12 h-14 text-lg rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 ${errors.email ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-base font-semibold text-slate-700">
                    Phone Number *
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(123) 456-7890"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={`pl-12 h-14 text-lg rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 ${errors.phone ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-base font-semibold text-slate-700">
                    Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className={`pl-12 pr-12 h-14 text-lg rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 ${errors.password ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-base font-semibold text-slate-700">
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`pl-12 pr-12 h-14 text-lg rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm flex items-center mt-1">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              {/* Role-specific Fields */}
              {formData.role === 'professional' && (
                <div className="space-y-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-2xl border border-blue-200/50">
                  <div className="flex items-center space-x-3 mb-4">
                    <User className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-slate-900">Professional Information</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-base font-semibold text-slate-700">
                      Location *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <Input
                        id="location"
                        type="text"
                        placeholder="City, State (e.g., San Francisco, CA)"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className={`pl-12 h-14 text-lg rounded-2xl border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80 ${errors.location ? 'border-red-300 focus:border-red-500' : ''}`}
                      />
                    </div>
                    {errors.location && (
                      <p className="text-red-600 text-sm flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-slate-700">
                      Languages Spoken * <span className="text-sm font-normal text-slate-500">(Select all that apply)</span>
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {languageOptions.map((language) => (
                        <div key={language} className="flex items-center space-x-2">
                          <Checkbox
                            id={`language-${language}`}
                            checked={formData.languages.includes(language)}
                            onCheckedChange={(checked) => handleLanguageChange(language, checked as boolean)}
                            className="rounded-lg"
                          />
                          <Label
                            htmlFor={`language-${language}`}
                            className="text-sm font-medium text-slate-700 cursor-pointer"
                          >
                            {language}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.languages && (
                      <p className="text-red-600 text-sm flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.languages}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base font-semibold text-slate-700">
                      Availability * <span className="text-sm font-normal text-slate-500">(Select all that apply)</span>
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {availabilityOptions.map((availability) => (
                        <div key={availability} className="flex items-center space-x-2">
                          <Checkbox
                            id={`availability-${availability}`}
                            checked={formData.availability.includes(availability)}
                            onCheckedChange={(checked) => handleAvailabilityChange(availability, checked as boolean)}
                            className="rounded-lg"
                          />
                          <Label
                            htmlFor={`availability-${availability}`}
                            className="text-sm font-medium text-slate-700 cursor-pointer"
                          >
                            {availability}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.availability && (
                      <p className="text-red-600 text-sm flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.availability}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {formData.role === 'employer' && (
                <div className="space-y-6 p-6 bg-gradient-to-r from-green-50 to-green-100/50 rounded-2xl border border-green-200/50">
                  <div className="flex items-center space-x-3 mb-4">
                    <Building2 className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-semibold text-slate-900">Organization Information</h3>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organizationName" className="text-base font-semibold text-slate-700">
                      Organization Name *
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <Input
                        id="organizationName"
                        type="text"
                        placeholder="Enter organization name"
                        value={formData.organizationName}
                        onChange={(e) => handleInputChange('organizationName', e.target.value)}
                        className={`pl-12 h-14 text-lg rounded-2xl border-slate-200 focus:border-green-500 focus:ring-green-500/20 bg-white/80 ${errors.organizationName ? 'border-red-300 focus:border-red-500' : ''}`}
                      />
                    </div>
                    {errors.organizationName && (
                      <p className="text-red-600 text-sm flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.organizationName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessAddress" className="text-base font-semibold text-slate-700">
                      Business Address *
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 text-slate-400 w-5 h-5" />
                      <Textarea
                        id="businessAddress"
                        placeholder="Enter your business address"
                        value={formData.businessAddress}
                        onChange={(e) => handleInputChange('businessAddress', e.target.value)}
                        className={`pl-12 min-h-[56px] text-lg rounded-2xl border-slate-200 focus:border-green-500 focus:ring-green-500/20 bg-white/80 resize-none ${errors.businessAddress ? 'border-red-300 focus:border-red-500' : ''}`}
                        rows={3}
                      />
                    </div>
                    {errors.businessAddress && (
                      <p className="text-red-600 text-sm flex items-center mt-1">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.businessAddress}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl">
                <Checkbox id="terms" className="mt-1" required />
                <Label htmlFor="terms" className="text-sm text-slate-600 leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                    Privacy Policy
                  </Link>
                  . I understand that FIGA LLC will verify my information as necessary.
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-16 text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-2xl"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Create Account
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-slate-600 text-lg">
                Already have an account?{' '}
                <Link href="/signin" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Log in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
