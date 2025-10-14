"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, Heart, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  // Typing animation for hero title
  // Render first word immediately; animate the rest with correct spacing
  const headWord = "Compassionate";
  const line1Rest = "care"; // type only the word; we render a fixed space in JSX
  const line2 = " matched to your needs"; // leading space ensures correct sentence spacing
  const [typed1, setTyped1] = React.useState<string>(""); // types out line1Rest
  const [typed2, setTyped2] = React.useState<string>(""); // types out line2

  React.useEffect(() => {
    let cancelled = false;
    const speed = 40; // ms per character

    let i = 0;
    let j = 0;

    const typeSecond = () => {
      if (cancelled) return;
      if (j <= line2.length) {
        setTyped2(line2.slice(0, j));
        j += 1;
        if (j <= line2.length) setTimeout(typeSecond, speed);
      }
    };

    const typeFirst = () => {
      if (cancelled) return;
      if (i <= line1Rest.length) {
        setTyped1(line1Rest.slice(0, i));
        i += 1;
        if (i <= line1Rest.length) {
          setTimeout(typeFirst, speed);
        } else {
          // small pause before typing the second line
          setTimeout(typeSecond, 300);
        }
      }
    };

    // start typing on mount
    typeFirst();

    return () => {
      cancelled = true;
    };
  }, []);

  // Carousel ref and helper for Testimonials mobile arrows
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollByWidth = (dir: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const visible = el.clientWidth || 300;
    const amount = Math.max(visible * 0.7, 150);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/30">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-10 lg:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-blue-500/5 to-blue-700/10"></div>
          <div className="absolute top-0 left-0 w-full h-full">
            {/* Decorative blobs: hide on very small screens to reduce clutter */}
            <div className="hidden sm:block absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-blue-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="hidden sm:block absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-blue-500/20 to-blue-700/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="hidden sm:block absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-blue-600/20 to-blue-800/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[60vh]">
              {/* Left Side - Hero Content */}
              <div className="space-y-8 animate-slide-up text-center sm:text-left">
                <Badge className="mx-auto sm:mx-0 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all duration-300 px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-lg font-semibold animate-fade-in">
                  <Heart className="w-5 h-5 mr-2" />
                  Connecting Families with Trusted Caregivers
                </Badge>

                <div className="space-y-6">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                    <span>
                      {headWord}{" "}
                      <span>
                        {typed1}
                        {typed1.length < line1Rest.length ? (
                          <span
                            aria-hidden
                            className="ml-1 inline-block w-0.5 h-[1em] bg-slate-900 align-middle animate-blink"
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
                          className="ml-1 inline-block w-0.5 h-[1em] bg-blue-700 align-middle animate-blink"
                        />
                      ) : null}
                      {/* Show blinking cursor at end after animation finishes */}
                      {typed1.length === line1Rest.length &&
                        typed2.length === line2.length && (
                          <span
                            aria-hidden
                            className="ml-1 inline-block w-0.5 h-[1em] bg-blue-700 align-middle animate-blink"
                          />
                        )}
                    </span>
                  </h1>

                  <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed animate-fade-in-delay font-light">
                    We provide skilled, compassionate caregivers matched to your
                    unique needs. Quality care you can trust, when you need it
                    most.
                  </p>
                </div>

                {/* Mobile-only hero image: placed between motto text and CTA buttons */}
                <div className="block lg:hidden relative h-[220px] sm:h-[300px] w-full rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/elderly-care-image.png"
                    alt="Professional caregiver providing compassionate care to elderly person"
                    fill
                    className="object-contain"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>

                {/* Call to Action Links */}
                <div className="pt-4 animate-fade-in-delay-2">
                  <div className="flex flex-row flex-wrap items-center justify-center gap-3">
                    <Link href="/signup">
                      <Button
                        size="lg"
                        className="w-auto whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-xl font-semibold"
                      >
                        Apply as a Caregiver
                        <ArrowRight className="ml-3 w-6 h-6" />
                      </Button>
                    </Link>

                    <Link href="/signup">
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-auto whitespace-nowrap border-2 border-blue-200 hover:bg-blue-50 px-4 sm:px-8 py-2 sm:py-4 text-sm sm:text-xl bg-transparent"
                      >
                        Hire a Caregiver
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Side - Caring Image Only */}
              <div className="animate-fade-in-delay">
                {/* Desktop / large screens only - hide on small devices since we show a mobile image above the CTAs */}
                <div className="hidden lg:block relative h-[300px] sm:h-[400px] lg:h-[500px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/elderly-care-image.png"
                    alt="Professional caregiver providing compassionate care to elderly person"
                    fill
                    className="object-top object-contain sm:object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                  {/* Optional overlay text */}
                </div>
              </div>
            </div>
          </div>

          {/* Blinking Arrow at the end of hero section */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <ChevronDown className="w-5 h-5 text-white animate-bounce" />
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                How It Works
              </h2>
              <p className="text-xl text-slate-600">
                Simple steps to get started, whether you're seeking care or
                providing it
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* For Families */}
              <div className="space-y-8">
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 px-4 py-2 text-lg font-semibold mb-4">
                    For Families
                  </Badge>
                  <h3 className="text-2xl font-bold text-slate-900 mb-8">
                    Finding Your Perfect Caregiver
                  </h3>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      step: "1",
                      title: "Submit Request",
                      description:
                        "Fill out our detailed care needs assessment form with your specific requirements.",
                      icon: "📝",
                    },
                    {
                      step: "2",
                      title: "Get Shortlisted Resumes",
                      description:
                        "We send you profiles of pre-screened caregivers who match your needs and preferences.",
                      icon: "👥",
                    },
                    {
                      step: "3",
                      title: "Choose & Connect",
                      description:
                        "Review profiles, conduct interviews, and select the caregiver that feels right for your family.",
                      icon: "🤝",
                    },
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 sm:p-6 rounded-2xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-blue-100/50 transition-all duration-300 group animate-fade-in-stagger"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 text-xl sm:text-2xl">
                        {step.icon}
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mr-3">
                            {step.step}
                          </span>
                          <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                            {step.title}
                          </h4>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* For Caregivers */}
              <div className="space-y-8">
                <div className="text-center">
                  <Badge className="bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200 px-4 py-2 text-lg font-semibold mb-4">
                    For Caregivers
                  </Badge>
                  <h3 className="text-2xl font-bold text-slate-900 mb-8">
                    Start Your Caregiving Career
                  </h3>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      step: "1",
                      title: "Fill Out Application",
                      description:
                        "Complete our comprehensive application including experience, certifications, and availability.",
                      icon: "📋",
                    },
                    {
                      step: "2",
                      title: "Profile Review",
                      description:
                        "We verify your credentials, conduct background checks, and review your qualifications.",
                      icon: "🔍",
                    },
                    {
                      step: "3",
                      title: "Get Matched",
                      description:
                        "Once approved, we connect you with families whose needs match your skills and schedule.",
                      icon: "✨",
                    },
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 sm:p-6 rounded-2xl hover:bg-gradient-to-r hover:from-green-50/50 hover:to-green-100/50 transition-all duration-300 group animate-fade-in-stagger"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-white flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300 text-xl sm:text-2xl">
                        {step.icon}
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <span className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mr-3">
                            {step.step}
                          </span>
                          <h4 className="font-bold text-slate-900 text-base sm:text-lg">
                            {step.title}
                          </h4>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mt-16 space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 px-8 py-4 text-lg group"
                  >
                    Request Care Services
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-green-200 hover:bg-gradient-to-r hover:from-green-50 hover:to-green-100 hover:border-green-300 transition-all duration-300 px-8 py-4 text-lg bg-white/80 backdrop-blur-sm group"
                  >
                    Join Our Team
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-blue-100/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900 mb-6">
                What Our Families Say
              </h2>
              <p className="text-xl text-slate-600">
                Real feedback from families and caregivers in our community
              </p>
            </div>

            {/* Horizontal snap-scroll on small screens, grid on md+ */}
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20 md:hidden">
                <button
                  onClick={() => scrollByWidth("left")}
                  className="bg-white/90 p-2 rounded-full shadow-md"
                  aria-label="Scroll testimonials left"
                >
                  <ChevronLeft className="w-5 h-5 text-slate-700" />
                </button>
              </div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20 md:hidden">
                <button
                  onClick={() => scrollByWidth("right")}
                  className="bg-white/90 p-2 rounded-full shadow-md"
                  aria-label="Scroll testimonials right"
                >
                  <ChevronRight className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              <div ref={carouselRef} className="flex flex-row md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-visible hide-scrollbar snap-x snap-mandatory -mx-4 px-4">
              {[
                {
                  name: "Maria S.",
                  location: "San Francisco",
                  type: "Family",
                  content:
                    "FIGA LLC found us the perfect caregiver for my elderly mother. The process was smooth and professional, and we couldn't be happier with the match.",
                  rating: 5,
                  avatar: "👩‍👧‍👦",
                },
                {
                  name: "James L.",
                  location: "Oakland",
                  type: "Caregiver",
                  content:
                    "Working with FIGA LLC has been wonderful. They truly care about matching caregivers with the right families, and the support is excellent.",
                  rating: 5,
                  avatar: "👨‍⚕️",
                },
                {
                  name: "Linda K.",
                  location: "San Jose",
                  type: "Family",
                  content:
                    "The caregiver they matched us with has become like family. Professional, caring, and exactly what we needed for our father's care.",
                  rating: 5,
                  avatar: "👵",
                },
              ].map((testimonial, index) => (
                <Card
                  key={index}
                  className="snap-start flex-shrink-0 w-[85%] sm:w-[60%] md:w-auto bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 animate-fade-in-stagger"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  aria-label={`Testimonial from ${testimonial.name}`}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse-slow"
                        />
                      ))}
                    </div>
                    <p className="text-slate-700 mb-6 text-lg leading-relaxed italic">
                      "{testimonial.content}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-xl mr-4 animate-bounce-slow">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-slate-600">
                          {testimonial.type} • {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
        </section>
      </main>
    </div>
  );
}
