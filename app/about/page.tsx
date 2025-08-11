"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  Shield,
  Users,
  Award,
  Clock,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MapPin,
  Send,
  AlertCircle,
} from "lucide-react"

export default function AboutPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      service: value,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium">About FIGA LLC</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
              Compassionate Care{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Since 2015
              </span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
              We're dedicated to connecting families with trusted, professional caregivers who provide exceptional
              in-home care services throughout the San Francisco Bay Area.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Our Mission & Values</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Built on a foundation of trust, compassion, and excellence in caregiving
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Compassion</h3>
                  <p className="text-slate-600">
                    Every interaction is guided by empathy, kindness, and genuine care for our clients and their
                    families.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Trust</h3>
                  <p className="text-slate-600">
                    We maintain the highest standards of reliability, transparency, and integrity in all our services.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Excellence</h3>
                  <p className="text-slate-600">
                    We continuously strive for the highest quality of care through ongoing training and improvement.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Community</h3>
                  <p className="text-slate-600">
                    We're committed to strengthening our community by supporting families and caregivers alike.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Our Story</h2>
              <p className="text-xl text-slate-600">Founded with a vision to transform home care services</p>
            </div>

            <div className="space-y-8">
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="prose prose-lg max-w-none text-slate-700">
                    <p className="text-xl leading-relaxed mb-6">
                      FIGA LLC was founded in 2015 with a simple yet powerful mission: to provide families with access
                      to compassionate, professional caregivers who truly understand the importance of quality home
                      care.
                    </p>

                    <p className="leading-relaxed mb-6">
                      Our founders recognized a gap in the caregiving industry – while there were many agencies
                      providing basic services, few were truly focused on building meaningful relationships between
                      caregivers and families. We set out to change that by creating a platform that prioritizes trust,
                      communication, and personalized care.
                    </p>

                    <p className="leading-relaxed mb-6">
                      Today, we're proud to serve hundreds of families across the San Francisco Bay Area, connecting
                      them with carefully vetted, experienced caregivers who share our commitment to excellence. Our
                      team includes registered nurses, certified nursing assistants, companion caregivers, and
                      specialized care providers.
                    </p>

                    <p className="leading-relaxed">
                      What sets us apart is our dedication to ongoing support – we don't just make a match and walk
                      away. We maintain regular communication with both families and caregivers to ensure the highest
                      quality of care and satisfaction for everyone involved.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Our Services</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Comprehensive care solutions tailored to meet your family's unique needs
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Personal Care</h3>
                      <p className="text-slate-600 mb-4">
                        Assistance with daily activities including bathing, dressing, grooming, and mobility support.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Bathing and hygiene assistance
                        </li>
                        <li className="flex items-center text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Medication reminders
                        </li>
                        <li className="flex items-center text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Mobility and transfer support
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Companion Care</h3>
                      <p className="text-slate-600 mb-4">
                        Social interaction, emotional support, and assistance with light household tasks.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Conversation and companionship
                        </li>
                        <li className="flex items-center text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Light housekeeping
                        </li>
                        <li className="flex items-center text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Transportation to appointments
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Specialized Care</h3>
                      <p className="text-slate-600 mb-4">
                        Expert care for specific conditions including dementia, Alzheimer's, and post-surgical recovery.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Dementia and Alzheimer's care
                        </li>
                        <li className="flex items-center text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Post-surgical recovery support
                        </li>
                        <li className="flex items-center text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Chronic condition management
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3">Respite Care</h3>
                      <p className="text-slate-600 mb-4">
                        Temporary relief for family caregivers, allowing them time to rest and recharge.
                      </p>
                      <ul className="space-y-2">
                        <li className="flex items-center text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Short-term care coverage
                        </li>
                        <li className="flex items-center text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Flexible scheduling
                        </li>
                        <li className="flex items-center text-slate-600">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          Family caregiver support
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Our Commitment</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Every caregiver in our network is carefully screened, trained, and supported
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Thorough Screening</h3>
                  <p className="text-slate-600">
                    Background checks, reference verification, and skills assessment for every caregiver.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Ongoing Training</h3>
                  <p className="text-slate-600">
                    Continuous education and certification programs to maintain the highest care standards.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">24/7 Support</h3>
                  <p className="text-slate-600">
                    Round-the-clock support for both families and caregivers to ensure peace of mind.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Find Us Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Find Us</h2>
              <p className="text-xl text-slate-600">Visit our office in the heart of San Francisco</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Address Card */}
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-900">FIGA Care Services</h3>
                        <div className="text-slate-600">
                          <p>123 Care Street, Suite 200</p>
                          <p>San Francisco, CA 94102</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Map */}
              <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl h-64 flex items-center justify-center">
                    <div className="text-center space-y-4">
                      <MapPin className="w-16 h-16 text-slate-500 mx-auto" />
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-slate-700">Interactive Map</h3>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() =>
                            window.open("https://maps.google.com/?q=123+Care+Street+San+Francisco+CA", "_blank")
                          }
                        >
                          View on Google Maps
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">Contact Us</h2>
              <p className="text-xl text-slate-600">
                Ready to get started? We're here to help you find the perfect caregiver
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Information */}
              <div className="space-y-8">
                <div className="grid sm:grid-cols-2 gap-6">
                  <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Phone className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-slate-900">Phone</h3>
                          <a href="tel:+15551234567" className="text-blue-600 hover:text-blue-700 font-medium">
                            (555) 123-4567
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-slate-900">Email</h3>
                          <a
                            href="mailto:info@figacare.com"
                            className="text-green-600 hover:text-green-700 font-medium"
                          >
                            info@figacare.com
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-slate-900">Office</h3>
                          <p className="text-slate-600">
                            123 Care Street, Suite 200
                            <br />
                            San Francisco, CA 94102
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-slate-900">Hours</h3>
                          <div className="text-slate-600 text-sm">
                            <p>Mon-Fri: 8:00 AM - 6:00 PM</p>
                            <p>Sat: 9:00 AM - 4:00 PM</p>
                            <p>Sun: Emergency calls only</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Emergency Contact */}
                <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200 shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-slate-900">Emergency Care Needed?</h3>
                        <p className="text-slate-600">For urgent care needs, call our 24/7 emergency line</p>
                        <Button
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => (window.location.href = "tel:+15551234567")}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now: (555) 123-4567
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <div className="space-y-8">
                <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-xl">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-slate-900">Send Us a Message</h3>
                        <p className="text-slate-600">
                          Fill out the form below and we'll get back to you within 24 hours.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="firstName" className="text-sm font-medium text-slate-700">
                              First Name *
                            </label>
                            <Input
                              id="firstName"
                              name="firstName"
                              type="text"
                              required
                              value={formData.firstName}
                              onChange={handleChange}
                              className="w-full"
                              placeholder="Enter your first name"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="lastName" className="text-sm font-medium text-slate-700">
                              Last Name *
                            </label>
                            <Input
                              id="lastName"
                              name="lastName"
                              type="text"
                              required
                              value={formData.lastName}
                              onChange={handleChange}
                              className="w-full"
                              placeholder="Enter your last name"
                            />
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-slate-700">
                              Email Address *
                            </label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={handleChange}
                              className="w-full"
                              placeholder="Enter your email"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                              Phone Number
                            </label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              className="w-full"
                              placeholder="Enter your phone number"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="service" className="text-sm font-medium text-slate-700">
                            Service Needed
                          </label>
                          <Select onValueChange={handleSelectChange}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="personal-care">Personal Care</SelectItem>
                              <SelectItem value="companion-care">Companion Care</SelectItem>
                              <SelectItem value="specialized-care">Specialized Care</SelectItem>
                              <SelectItem value="respite-care">Respite Care</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="message" className="text-sm font-medium text-slate-700">
                            Message *
                          </label>
                          <Textarea
                            id="message"
                            name="message"
                            required
                            value={formData.message}
                            onChange={handleChange}
                            rows={5}
                            className="w-full resize-none"
                            placeholder="Tell us about your caregiving needs..."
                          />
                        </div>

                        <Button
                          type="submit"
                          size="lg"
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </Button>
                      </form>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
