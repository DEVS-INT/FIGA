'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { FigaLogo } from '@/components/figa-logo'
import { Home, Users, Calendar, Settings, FileText, BarChart3, User, Briefcase } from 'lucide-react'

interface SidebarItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

interface SidebarProps {
  variant?: 'employer' | 'caregiver' | 'admin'
  className?: string
}

export function Sidebar({ variant = 'employer', className }: SidebarProps) {
  const pathname = usePathname()

  const getItems = (): SidebarItem[] => {
    switch (variant) {
      case 'employer':
        return [
          { href: '/employer/dashboard', label: 'Dashboard', icon: Home },
          { href: '/employer/post-job', label: 'Post Job', icon: FileText },
          { href: '/employer/applications', label: 'Applications', icon: Users },
          { href: '/employer/schedule', label: 'Schedule', icon: Calendar },
          { href: '/employer/settings', label: 'Settings', icon: Settings },
        ]
      case 'caregiver':
        return [
          { href: '/caregiver/dashboard', label: 'Dashboard', icon: Home },
          { href: '/caregiver/jobs', label: 'Available Jobs', icon: Briefcase },
          { href: '/caregiver/applications', label: 'My Applications', icon: FileText },
          { href: '/caregiver/schedule', label: 'Schedule', icon: Calendar },
          { href: '/caregiver/profile', label: 'Profile', icon: User },
          { href: '/caregiver/settings', label: 'Settings', icon: Settings },
        ]
      case 'admin':
        return [
          { href: '/admin/dashboard', label: 'Dashboard', icon: Home },
          { href: '/admin/users', label: 'Users', icon: Users },
          { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
          { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
          { href: '/admin/settings', label: 'Settings', icon: Settings },
        ]
      default:
        return []
    }
  }

  const items = getItems()

  return (
    <div className={cn(
      "flex flex-col w-64 bg-white border-r border-slate-200 h-full",
      className
    )}>
      {/* Logo */}
      <div className="flex items-center space-x-3 p-6 border-b border-slate-200">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-lg flex items-center justify-center">
          <FigaLogo size="sm" variant="white" />
        </div>
        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          FIGA Care
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-600 border border-blue-200"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5",
                    isActive ? "text-blue-600" : "text-slate-500"
                  )} />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
