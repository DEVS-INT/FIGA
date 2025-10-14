"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
}

const caregiversFAQs: FAQItem[] = [
  {
    question: "Do I need a certification to become a caregiver?",
    answer:
      "While certification is not always required, we prefer caregivers with CNA, HHA, or similar certifications. We also provide training opportunities for qualified candidates without formal certification but with relevant experience.",
  },
  {
    question: "What does the background check process involve?",
    answer:
      "Our comprehensive background check includes criminal history, employment verification, reference checks, and driving record review. The process typically takes 3-5 business days to complete.",
  },
  {
    question: "How much can I expect to earn as a caregiver?",
    answer:
      "Compensation varies based on experience, certifications, and type of care provided. Our caregivers typically earn between $18-$28 per hour, with opportunities for overtime and bonuses for exceptional service.",
  },
  {
    question: "Can I choose my own schedule and clients?",
    answer:
      "Yes! We work with you to match your availability and preferences with suitable clients. You can specify your preferred hours, days of the week, and types of care you're comfortable providing.",
  },
  {
    question: "What kind of training and support do you provide?",
    answer:
      "We offer ongoing training in areas such as dementia care, medication management, and emergency procedures. Our support team is available 24/7 for any questions or concerns that arise during your assignments.",
  },
];

const familiesFAQs: FAQItem[] = [
  {
    question: "How quickly can you match me with a caregiver?",
    answer:
      "We typically provide qualified caregiver profiles within 48-72 hours of receiving your care assessment. Emergency placements can often be arranged within 24 hours, depending on availability and specific requirements.",
  },
  {
    question: "What are your rates and how is pricing determined?",
    answer:
      "Our rates vary based on the level of care needed, schedule requirements, and caregiver qualifications. We provide transparent pricing with no hidden fees. Contact us for a personalized quote based on your specific needs.",
  },
  {
    question: "What if I'm not satisfied with my caregiver?",
    answer:
      "Your satisfaction is our priority. If you're not completely happy with your caregiver match, we'll work quickly to find a replacement at no additional cost. We also provide ongoing support to address any concerns.",
  },
  {
    question: "Are your services covered by insurance?",
    answer:
      "Some insurance plans, including long-term care insurance and certain Medicare Advantage plans, may cover our services. We can help you understand your coverage and assist with insurance documentation.",
  },
  {
    question: "What types of care do your caregivers provide?",
    answer:
      "Our caregivers provide companion care, personal care assistance, medication reminders, light housekeeping, meal preparation, transportation, and specialized care for conditions like dementia and Alzheimer's.",
  },
];

function FAQSection({
  title,
  faqs,
  badgeColor,
}: {
  title: string;
  faqs: FAQItem[];
  badgeColor: string;
}) {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <Badge className={`${badgeColor} px-4 py-2 text-sm font-medium`}>
          {title}
        </Badge>
        <h2 className="text-3xl font-bold text-slate-900">{title} FAQs</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Card
            key={index}
            className="bg-white/80 backdrop-blur-lg border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <CardContent className="p-0">
              <button
                onClick={() => toggleItem(index)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-50/50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-slate-900 pr-4">
                  {faq.question}
                </h3>
                {openItems.includes(index) ? (
                  <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                )}
              </button>

              {openItems.includes(index) && (
                <div className="px-6 pb-6 pt-0">
                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="py-10 lg:py-16 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0 bg-[url('/pattern-dark.svg')] opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-[15%] left-[10%] w-5 h-5 rounded-full bg-blue-400 animate-pulse"></div>
          <div className="absolute top-[25%] left-[30%] w-5 h-5 rounded-full bg-indigo-400 animate-pulse delay-200"></div>
          <div className="absolute top-[10%] left-[50%] w-5 h-5 rounded-full bg-slate-400 animate-pulse delay-300"></div>
          <div className="absolute top-[30%] left-[15%] w-5 h-5 rounded-full bg-blue-400 animate-pulse delay-250"></div>
          <div className="absolute top-[20%] left-[70%] w-5 h-5 rounded-full bg-indigo-400 animate-pulse delay-400"></div>
          <div className="absolute top-[35%] left-[60%] w-5 h-5 rounded-full bg-blue-400 animate-pulse delay-350"></div>
          <div className="absolute top-[5%] left-[80%] w-5 h-5 rounded-full bg-slate-500 animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge className="bg-white/10 text-white border-white/20 px-5 py-2 text-sm font-medium hover:scale-105 transition-all duration-300 hover:bg-white/20 backdrop-blur-sm">
              Frequently Asked Questions
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
              Get Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 animate-gradient">
                Questions Answered
              </span>
            </h1>

            <p className="text-xl text-blue-100/90 leading-relaxed max-w-3xl mx-auto">
              Find answers to common questions about our caregiving services,
              whether you're looking to hire a caregiver or join our team of
              professionals.
            </p>

            <div className="flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Button
                className="w-auto whitespace-nowrap bg-white text-blue-800 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 px-4 sm:px-8 py-2.5 sm:py-6 text-sm sm:text-lg font-semibold"
                size="lg"
                onClick={() =>
                  document
                    .getElementById("caregivers")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                For Caregivers
              </Button>
              <Button
                variant="outline"
                className="w-auto whitespace-nowrap bg-transparent text-white border-white/30 hover:bg-white/10 hover:text-white px-4 sm:px-8 py-2.5 sm:py-6 text-sm sm:text-lg font-semibold"
                size="lg"
                onClick={() =>
                  document
                    .getElementById("familes")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                For Families
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-blue-400/10 blur-xl"></div>
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-indigo-400/10 blur-xl"></div>
      </section>

      {/* FAQ Sections - now side by side on large screens */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Caregivers - left side */}
            <div id="caregivers">
              <FAQSection
                title="For Caregivers"
                faqs={caregiversFAQs}
                badgeColor="bg-green-100 text-green-800"
              />
            </div>

            {/* For Families - right side */}
            <div id="familes">
              <FAQSection
                title="For Families"
                faqs={familiesFAQs}
                badgeColor="bg-blue-100 text-blue-800"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
