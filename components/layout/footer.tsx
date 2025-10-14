"use client";
import Link from "next/link";
import { FigaLogo } from "@/components/figa-logo";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export function Footer() {
  const [quickOpen, setQuickOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <FigaLogo size="lg" variant="white" />
              </div>
              <span className="text-2xl font-bold">FIGA LLC</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Connecting families with trusted, compassionate caregivers across
              the San Francisco Bay Area since 2020.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              {/* Telegram */}
              <a
                href="https://t.me/your_handle"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                title="Telegram"
                className="w-10 h-10 bg-slate-700 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300"
              >
                {/* Inline Telegram logo SVG to avoid extra deps */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5"
                >
                  <path d="M12 0C5.371 0 0 5.371 0 12s5.371 12 12 12 12-5.371 12-12S18.629 0 12 0zm5.3 8.034l-1.675 7.9c-.127.575-.464.712-.94.442l-2.6-1.92-1.254 1.21c-.139.14-.254.254-.515.254l.183-2.621 4.762-4.3c.207-.184-.045-.289-.322-.103l-5.885 3.706-2.536-.793c-.552-.173-.565-.552.116-.816l9.91-3.824c.535-.2 1.005.116 1.145.907z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-between md:justify-start md:block text-lg font-semibold mb-6 text-left md:text-inherit"
              onClick={() => setQuickOpen((s) => !s)}
              aria-expanded={quickOpen}
            >
              <span>Quick Links</span>
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 md:hidden ${quickOpen ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`${quickOpen ? 'block' : 'hidden'} md:block space-y-3`}>
              {[
                { href: "/about", label: "About Us" },
                { href: "/jobs", label: "Find Jobs" },
                { href: "/contact", label: "Contact Us" },
                { href: "/faq", label: "FAQ" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-300 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-between md:justify-start md:block text-lg font-semibold mb-6 text-left md:text-inherit"
              onClick={() => setServicesOpen((s) => !s)}
              aria-expanded={servicesOpen}
            >
              <span>Services</span>
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 md:hidden ${servicesOpen ? 'rotate-180' : ''}`} />
            </button>
            <ul className={`${servicesOpen ? 'block' : 'hidden'} md:block space-y-3`}>
              {[
                "Elder Care",
                "Companion Care",
                "Personal Care",
                "Respite Care",
                "Live-in Care",
                "Specialized Care",
              ].map((service) => (
                <li key={service}>
                  <span className="text-slate-300">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-between md:justify-start md:block text-lg font-semibold mb-6 text-left md:text-inherit"
              onClick={() => setContactOpen((s) => !s)}
              aria-expanded={contactOpen}
            >
              <span>Contact Info</span>
              <ChevronDown className={`w-4 h-4 ml-2 transition-transform duration-200 md:hidden ${contactOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`${contactOpen ? 'block' : 'hidden'} md:block space-y-4`}>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300">(415) 555-0123</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300">info@figallc.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1" />
                <span className="text-slate-300">
                  123 Market Street
                  <br />
                  San Francisco, CA 94102
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400 text-sm">
              © 2024 FIGA LLC. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                href="/privacy"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className="text-slate-400 hover:text-white transition-colors duration-300"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
