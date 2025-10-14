"use client";

import Link from "next/link"
import { FigaLogo } from "@/components/figa-logo"
import { Mail, Phone, MapPin, ChevronDown } from "lucide-react"
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Footer() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);
  const currentYear = new Date().getFullYear()
  const pathname = usePathname();

  if ([
    "@/signin",
    "@/signup",
    "/signout",
    "/admin",
    "/admin/users",
    "/admin/todos",
  ].includes(pathname)) {
    return null;
  }

  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <FigaLogo variant="white" size="lg" />
            <p className="text-slate-300 leading-relaxed">
              Connecting families with trusted, compassionate caregivers across the San Francisco Bay Area.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-slate-300">
                <Phone className="w-4 h-4 mr-2" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Mail className="w-4 h-4 mr-2" />
                <span>info@figacare.com</span>
              </div>
              <div className="flex items-center text-slate-300">
                <MapPin className="w-4 h-4 mr-2" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Three columns wrapper: horizontal on mobile, grid on md+ */}
          <div className="col-span-3">
            <div className="flex flex-row gap-6 overflow-x-auto hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible">
              {/* Services */}
              <div className="flex-shrink-0 min-w-[200px] md:min-w-0">
                <div>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between md:justify-start md:block font-semibold text-lg mb-4 text-left md:text-inherit md:mb-2"
                    onClick={() => setServicesOpen((s) => !s)}
                    aria-expanded={servicesOpen}
                  >
                    <span>Services</span>
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 md:hidden ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <ul className={`${servicesOpen ? 'block' : 'hidden'} md:block space-y-2`}>
                    <li>
                      <Link href="/services/elderly-care" className="text-slate-300 hover:text-white transition-colors">
                        Elderly Care
                      </Link>
                    </li>
                    <li>
                      <Link href="/services/companion-care" className="text-slate-300 hover:text-white transition-colors">
                        Companion Care
                      </Link>
                    </li>
                    <li>
                      <Link href="/services/respite-care" className="text-slate-300 hover:text-white transition-colors">
                        Respite Care
                      </Link>
                    </li>
                    <li>
                      <Link href="/services/live-in-care" className="text-slate-300 hover:text-white transition-colors">
                        Live-in Care
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Company */}
              <div className="flex-shrink-0 min-w-[200px] md:min-w-0">
                <div>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between md:justify-start md:block font-semibold text-lg mb-4 text-left md:text-inherit md:mb-2"
                    onClick={() => setCompanyOpen((s) => !s)}
                    aria-expanded={companyOpen}
                  >
                    <span>Company</span>
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 md:hidden ${companyOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <ul className={`${companyOpen ? 'block' : 'hidden'} md:block space-y-2`}>
                    <li>
                      <Link href="/about" className="text-slate-300 hover:text-white transition-colors">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/jobs" className="text-slate-300 hover:text-white transition-colors">
                        Careers
                      </Link>
                    </li>
                    <li>
                      <Link href="/faq" className="text-slate-300 hover:text-white transition-colors">
                        FAQ
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Legal */}
              <div className="flex-shrink-0 min-w-[200px] md:min-w-0">
                <div>
                  <button
                    type="button"
                    className="w-full flex items-center justify-between md:justify-start md:block font-semibold text-lg mb-4 text-left md:text-inherit md:mb-2"
                    onClick={() => setLegalOpen((s) => !s)}
                    aria-expanded={legalOpen}
                  >
                    <span>Legal</span>
                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 md:hidden ${legalOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <ul className={`${legalOpen ? 'block' : 'hidden'} md:block space-y-2`}>
                    <li>
                      <Link href="/privacy" className="text-slate-300 hover:text-white transition-colors">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link href="/terms" className="text-slate-300 hover:text-white transition-colors">
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link href="/licensing" className="text-slate-300 hover:text-white transition-colors">
                        Licensing
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © {currentYear} FIGA LLC. All rights reserved. Licensed and insured caregiving services.
          </p>
        </div>
      </div>
    </footer>
  )
}
