import Link from "next/link"
import { FigaLogo } from "@/components/figa-logo"
import { Mail, Phone, MapPin } from "lucide-react"
import { usePathname } from "next/navigation";

export function Footer() {
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

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
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

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
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

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
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

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            © {currentYear} FIGA LLC. All rights reserved. Licensed and insured caregiving services.
          </p>
        </div>
      </div>
    </footer>
  )
}
