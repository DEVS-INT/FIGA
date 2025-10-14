"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AboutPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      service: "",
      message: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      service: value,
    }));
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // Carousel ref for Mission & Values mobile arrows
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollByWidth = (dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const visible = el.clientWidth || 300;
    const amount = Math.max(visible * 0.7, 150);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="py-10 lg:py-16 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('/pattern-dark.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        {/* Animated dots decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          {/* Blue dots group - top left */}
          <div className="absolute top-[15%] left-[10%] w-5 h-5 rounded-full bg-blue-400 animate-pulse"></div>
          <div className="absolute top-[25%] left-[30%] w-5 h-5 rounded-full bg-indigo-400 animate-pulse delay-200"></div>
          <div className="absolute top-[10%] left-[50%] w-5 h-5 rounded-full bg-slate-400 animate-pulse delay-300"></div>
          <div className="absolute top-[30%] left-[15%] w-5 h-5 rounded-full bg-blue-400 animate-pulse delay-250"></div>
          <div className="absolute top-[20%] left-[70%] w-5 h-5 rounded-full bg-indigo-400 animate-pulse delay-400"></div>
          <div className="absolute top-[35%] left-[60%] w-5 h-5 rounded-full bg-blue-400 animate-pulse delay-350"></div>
          <div className="absolute top-[5%] left-[80%] w-5 h-5 rounded-full bg-slate-500 animate-pulse delay-500"></div>

          {/* Indigo dot - top right with delay */}
          <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-indigo-400 animate-pulse delay-300"></div>

          {/* Slate dot - bottom left with delay */}
          <div className="absolute bottom-1/4 left-1/3 w-6 h-6 rounded-full bg-slate-400 animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-white/10 text-white border-white/20 px-5 py-2 text-sm font-medium hover:scale-105 transition-all duration-300 hover:bg-white/20 backdrop-blur-sm">
              About FIGA LLC
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Compassionate Care{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 animate-gradient">
                Since 2020
              </span>
            </h1>

            <p className="text-xl text-blue-100/90 leading-relaxed max-w-3xl mx-auto">
              Connecting families with trusted caregivers in the San Francisco
              Bay Area.
            </p>

            <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Button
                className="w-auto whitespace-nowrap bg-white text-blue-800 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 px-4 sm:px-8 py-2.5 sm:py-6 text-sm sm:text-lg font-semibold"
                size="lg"
                onClick={() =>
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Conatact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                className="w-auto whitespace-nowrap bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white px-4 sm:px-8 py-2.5 sm:py-6 text-sm sm:text-lg font-semibold"
                size="lg"
                onClick={() =>
                  document
                    .getElementById("serviece")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-slate-600">
              The foundation of everything we do
            </p>
          </div>

          <div className="relative">
            {/* Mobile arrows */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 sm:hidden">
              <button
                onClick={() => scrollByWidth("left")}
                className="bg-white/90 p-2 rounded-full shadow-md"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5 text-slate-700" />
              </button>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 sm:hidden">
              <button
                onClick={() => scrollByWidth("right")}
                className="bg-white/90 p-2 rounded-full shadow-md"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5 text-slate-700" />
              </button>
            </div>

            <div ref={carouselRef} className="flex flex-row sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible hide-scrollbar snap-x snap-mandatory -mx-4 sm:mx-0 px-4 sm:px-0">
            {[
              {
                icon: Heart,
                title: "Compassion",
                color: "from-red-500 to-pink-600",
                desc: "Empathy and kindness guide every interaction.",
              },
              {
                icon: Shield,
                title: "Trust",
                color: "from-blue-500 to-indigo-600",
                desc: "Highest standards of reliability and integrity.",
              },
              {
                icon: Award,
                title: "Excellence",
                color: "from-green-500 to-emerald-600",
                desc: "Continuous training for quality care.",
              },
              {
                icon: Users,
                title: "Community",
                color: "from-purple-500 to-violet-600",
                desc: "Supporting families and caregivers alike.",
              },
            ].map((item, index) => (
              <Card
                key={index}
                className="snap-start flex-shrink-0 w-[85%] sm:w-auto bg-white border-0 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform`}
                  >
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
      </section>

      {/* Services Overview */}
      <section
        id="serviece"
        className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-slate-600">
              Tailored solutions for your family's unique needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Clock,
                title: "Personal Care",
                color: "blue",
                items: [
                  "Bathing assistance",
                  "Medication reminders",
                  "Mobility support",
                ],
              },
              {
                icon: Heart,
                title: "Companion Care",
                color: "green",
                items: ["Conversation", "Light housekeeping", "Transportation"],
              },
              {
                icon: Shield,
                title: "Specialized Care",
                color: "purple",
                items: [
                  "Dementia care",
                  "Post-surgical recovery",
                  "Chronic conditions",
                ],
              },
              {
                icon: Users,
                title: "Respite Care",
                color: "orange",
                items: [
                  "Short-term coverage",
                  "Flexible scheduling",
                  "Family support",
                ],
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 bg-${service.color}-100 rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <service.icon
                        className={`w-5 h-5 text-${service.color}-600`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-3">
                        {service.title}
                      </h3>
                      <ul className="space-y-2">
                        {service.items.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-center text-slate-600 text-sm"
                          >
                            <CheckCircle
                              className={`w-4 h-4 text-${service.color}-500 mr-2`}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Commitment Section
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Our Promise</h2>
            <p className="text-xl text-slate-600">
              Every caregiver is screened, trained, and supported
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Thorough Screening", desc: "Background checks and skills assessment" },
              { icon: Award, title: "Ongoing Training", desc: "Continuous education programs" },
              { icon: Star, title: "24/7 Support", desc: "Round-the-clock assistance" }
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-8 text-center border border-slate-100 hover:border-blue-200 transition-all"
                
              >
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}
      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Contact us today to find the perfect caregiver for your family
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    {
                      icon: Phone,
                      title: "Phone",
                      value: "(555) 123-4567",
                      color: "blue",
                      action: "tel:+15551234567",
                    },
                    {
                      icon: Mail,
                      title: "Email",
                      value: "info@figacare.com",
                      color: "green",
                      action: "mailto:info@figacare.com",
                    },
                    {
                      icon: MapPin,
                      title: "Office",
                      value: "123 Care St, SF",
                      color: "purple",
                      action: "https://maps.google.com",
                    },
                    {
                      icon: Clock,
                      title: "Hours",
                      value: "Mon-Fri: 8AM-6PM",
                      color: "orange",
                      action: null,
                    },
                  ].map((item, index) => (
                    <Card
                      key={index}
                      className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                      onClick={() =>
                        item.action && window.open(item.action, "_blank")
                      }
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 bg-${item.color}-100 rounded-full flex items-center justify-center`}
                          >
                            <item.icon
                              className={`w-5 h-5 text-${item.color}-600`}
                            />
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-500">
                              {item.title}
                            </h3>
                            <p className="font-medium text-gray-900">
                              {item.value}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Emergency Card */}
                <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          Emergency Care Needed?
                        </h3>
                        <Button
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() =>
                            (window.location.href = "tel:+15551234567")
                          }
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Call Now
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contact Form */}
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">
                    Send Us a Message
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          First Name *
                        </label>
                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          required
                          value={formData.firstName}
                          onChange={handleChange}
                          className="bg-gray-50 border-gray-300"
                          placeholder="Your first name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Last Name *
                        </label>
                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          required
                          value={formData.lastName}
                          onChange={handleChange}
                          className="bg-gray-50 border-gray-300"
                          placeholder="Your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="bg-gray-50 border-gray-300"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="service"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Service Needed
                      </label>
                      <Select onValueChange={handleSelectChange}>
                        <SelectTrigger className="bg-gray-50 border-gray-300 text-gray-900">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          <SelectItem value="personal-care">
                            Personal Care
                          </SelectItem>
                          <SelectItem value="companion-care">
                            Companion Care
                          </SelectItem>
                          <SelectItem value="specialized-care">
                            Specialized Care
                          </SelectItem>
                          <SelectItem value="respite-care">
                            Respite Care
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="bg-gray-50 border-gray-300"
                        placeholder="Tell us about your needs..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
