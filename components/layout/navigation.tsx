 'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { FigaLogo } from '@/components/figa-logo'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationItem {
  href: string
  label: string
  active?: boolean
}

interface NavigationProps {
  items: NavigationItem[]
  variant?: 'default' | 'minimal'
  className?: string
}

export function Navigation({ items, variant = 'default', className }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className={cn(
      "bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm sticky top-0 z-50",
      className
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <FigaLogo size="sm" variant="white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              FIGA Care
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-slate-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group",
                  pathname === item.href && "text-blue-600"
                )}
              >
                {item.label}
                <span className={cn(
                  "absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-600 to-blue-800 transition-all duration-300",
                  pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                )} />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-2">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-slate-700 hover:text-blue-600 font-medium py-2 px-2 rounded-lg transition-colors",
                    pathname === item.href && "text-blue-600 bg-blue-50"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
