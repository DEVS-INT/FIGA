"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FigaLogo } from "@/components/figa-logo";
import {
  Home,
  Users,
  Calendar,
  Settings,
  FileText,
  BarChart3,
  User,
  Briefcase,
} from "lucide-react";

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  variant?: "employer" | "caregiver" | "admin" | "staff";
  className?: string;
}

export function Sidebar({ variant = "employer", className }: SidebarProps) {
  const pathname = usePathname();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Only fetch unread count for employer variant
  useEffect(() => {
    if (variant !== "employer") return;
    let mounted = true;
    const fetchUnread = async () => {
      try {
        const res = await fetch("/api/employer/messages?unreadOnly=true", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = await res.json();
        if (mounted)
          setUnreadCount(Array.isArray(data?.data) ? data.data.length : 0);
      } catch {
        // ignore sidebar badge errors
      }
    };
    fetchUnread();
    const onFocus = () => fetchUnread();
    const onVisibility = () => {
      if (document.visibilityState === "visible") fetchUnread();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      mounted = false;
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [variant]);

  const getItems = (): SidebarItem[] => {
    switch (variant) {
      case "employer":
        return [
          { href: "/employer/dashboard", label: "Dashboard", icon: Home },
          { href: "/employer/messages", label: "Messages", icon: FileText },
          { href: "/employer/post-job", label: "Post Job", icon: FileText },
          {
            href: "/employer/applications",
            label: "Applications",
            icon: Users,
          },
          { href: "/employer/schedule", label: "Schedule", icon: Calendar },
          { href: "/employer/settings", label: "Settings", icon: Settings },
        ];
      case "caregiver":
        return [
          { href: "/caregiver/dashboard", label: "Dashboard", icon: Home },
          { href: "/caregiver/jobs", label: "Available Jobs", icon: Briefcase },
          {
            href: "/caregiver/applications",
            label: "My Applications",
            icon: FileText,
          },
          { href: "/caregiver/schedule", label: "Schedule", icon: Calendar },
          { href: "/caregiver/portfolio", label: "Portfolio", icon: User },
          { href: "/caregiver/settings", label: "Settings", icon: Settings },
        ];
      case "admin":
        return [
          { href: "/admin/dashboard", label: "Dashboard", icon: Home },
          { href: "/admin/users", label: "Users", icon: Users },
          { href: "/admin/jobs", label: "Jobs", icon: Briefcase },
          { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
          { href: "/admin/settings", label: "Settings", icon: Settings },
        ];
      case "staff":
        return [
          { href: "/staff/dashboard", label: "Dashboard", icon: Home },
          { href: "/staff/jobs", label: "Manage Jobs", icon: Briefcase },
          { href: "/staff/applicants", label: "Applicants", icon: Users },
          { href: "/staff/employees", label: "Employees", icon: Users },
          { href: "/staff/portfolios", label: "Portfolios", icon: User },
          { href: "/staff/employers/new", label: "New Employer", icon: User },
          { href: "/staff/messages", label: "Messages", icon: FileText },
        ];
      default:
        return [];
    }
  };

  const items = getItems();

  return (
    <div
      className={cn(
        "flex flex-col w-64 bg-white border-r border-slate-200 h-full",
        className
      )}
    >
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
            const Icon = item.icon;
            const isActive = pathname === item.href;

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
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      isActive ? "text-blue-600" : "text-slate-500"
                    )}
                  />
                  <span>{item.label}</span>
                  {variant === "employer" &&
                    item.href === "/employer/messages" &&
                    unreadCount > 0 && (
                      <span className="ml-auto inline-flex items-center justify-center rounded-full bg-red-600 text-white text-xs font-semibold h-5 min-w-[1.25rem] px-1.5 shadow-sm">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
