"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FigaLogo } from "@/components/figa-logo";
import {
  Menu,
  X,
  CalendarDays,
  Check,
  Clock,
  ClipboardList,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signIn } from "next-auth/react";

interface HeaderProps {
  variant?: "default" | "employer" | "caregiver";
}

export function Header({ variant = "default" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // allow immediate UI update after profile image upload without sign-out/sign-in
  const [overrideImage, setOverrideImage] = useState<string | null>(null);
  // Ensure session is available for effects below
  const { status, data: session } = useSession();
  React.useEffect(() => {
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent<any>).detail as
          | { userId?: string; url?: string }
          | undefined;
        const url = detail?.url as string | undefined;
        const eventUserId = detail?.userId as string | undefined;
        const myUserId = session?.user?.id as string | undefined;
        // If the event includes a userId, only accept it when it matches our session user id.
        if (eventUserId) {
          if (!myUserId) return;
          if (eventUserId !== myUserId) return;
        }
        if (url) setOverrideImage(url);
      } catch (err) {}
    };
    window.addEventListener("profile:image:uploaded", handler as EventListener);
    return () =>
      window.removeEventListener(
        "profile:image:uploaded",
        handler as EventListener
      );
  }, [session]);

  // read any persisted profile image (set after upload) so avatar updates without reload
  React.useEffect(() => {
    try {
      const myUserId = session?.user?.id as string | undefined;
      const key = myUserId
        ? `figa:profileImage:${myUserId}`
        : "figa:profileImage";
      const url = localStorage.getItem(key);
      setOverrideImage(url ?? null);
    } catch {}
  }, [session]);

  // If session doesn't include an image (common after upload), try fetching the caregiver portfolio
  // to retrieve profile_image and use it as the avatar. This handles the case where session JWT
  // wasn't refreshed after the upload.
  React.useEffect(() => {
    let mounted = true;
    async function loadProfileImageFromApi() {
      try {
        if (!session?.user || overrideImage) return;
        if (session.user.role !== "EMPLOYEE") return;
        const res = await fetch("/api/caregiver/portfolio", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const json = await res.json();
        const url = json?.portfolio?.profile_image as string | undefined;
        if (mounted && url) {
          setOverrideImage(url);
          try {
            localStorage.setItem("figa:profileImage", url);
          } catch {}
        }
      } catch (e) {
        // ignore
      }
    }
    void loadProfileImageFromApi();
    return () => {
      mounted = false;
    };
  }, [session, overrideImage]);
  const pathname = usePathname();
  const router = useRouter();

  // Check authentication and role
  const isAuthenticated = status === "authenticated";
  const isEmployer = isAuthenticated && session?.user?.role === "EMPLOYER";
  const isEmployee = isAuthenticated && session?.user?.role === "EMPLOYEE";
  const user = session?.user;
  const userInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() ||
    user?.email?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  const getNavLinks = () => {
    switch (variant) {
      case "employer":
        return [
          { href: "/employer/dashboard", label: "Dashboard" },
          { href: "/employer/post-job", label: "Post Job" },
          { href: "/jobs", label: "Browse Caregivers" },
          { href: "/about", label: "About" },
        ];
      case "caregiver":
        return [
          { href: "/caregiver/dashboard", label: "Dashboard" },
          { href: "/jobs", label: "Find Jobs" },
          { href: "/caregiver/portfolio", label: "Portfolio" },
          { href: "/about", label: "About" },
        ];
      default:
        return [
          { href: "/jobs", label: "Find Jobs" },
          { href: "/about", label: "About Us" },
          { href: "/faq", label: "FAQ" },
        ];
    }
  };

  const navLinks = getNavLinks();

  const isActiveLink = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const handleLogin = () => {
    signIn(undefined, { callbackUrl: "/employer/dashboard" });
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  const handleLogout = () => {
    setMobileMenuOpen(false);
    router.push("/signout");
  };

  // Get dashboard path based on role
  const getDashboardPath = () => {
    if (session?.user?.role === "EMPLOYER") return "/employer/dashboard";
    if (session?.user?.role === "EMPLOYEE") return "/caregiver/dashboard";
    if (session?.user?.role === "STAFF" || session?.user?.role === "ADMIN")
      return "/staff";
    return "/dashboard";
  };

  // Get profile path based on role
  const getProfilePath = () => {
    if (session?.user?.role === "EMPLOYEE") return "/caregiver/dashboard";
    if (session?.user?.role === "EMPLOYER") return "/employer/profile";
    return "/profile";
  };

  // Loading state
  if (status === "loading") {
    return (
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
              <div className="h-6 w-32 bg-gray-200 rounded-md"></div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="h-9 w-24 bg-gray-200 rounded-md"></div>
              <div className="h-9 w-32 bg-gray-200 rounded-md"></div>
            </div>

            <div className="md:hidden p-2">
              <div className="w-6 h-6 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-white/20 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
              <FigaLogo size="sm" variant="white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              FIGA LLC
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium relative group px-3 py-2 rounded-lg",
                  isActiveLink(link.href) && "text-blue-600"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-1 left-3 right-3 h-0.5 bg-gradient-to-r from-blue-600 to-blue-800 transition-all duration-300",
                    isActiveLink(link.href)
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  )}
                />
              </Link>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && isEmployee && <EmployeeHeaderAction />}
            {isAuthenticated ? (
              // Only show avatar for EMPLOYER role
              isEmployer ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer border-2 border-blue-500 hover:scale-105 transition-transform">
                      {/* Prefer uploaded image (user.image) then user.imageUrl if present */}
                      {overrideImage ? (
                        <AvatarImage
                          src={overrideImage}
                          alt={user?.name || "User"}
                        />
                      ) : user?.image || (user as any)?.imageUrl ? (
                        <AvatarImage
                          src={(user as any)?.image || (user as any)?.imageUrl}
                          alt={user?.name || "User"}
                        />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-blue-800 font-medium">
                          {user?.name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getProfilePath()}>Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/employer/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-700 focus:bg-red-50"
                      onClick={handleLogout}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                // Non-employer (includes STAFF/ADMIN/EMPLOYEE): show account dropdown with initial avatar
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer border-2 border-blue-500 hover:scale-105 transition-transform">
                      {overrideImage ? (
                        <AvatarImage
                          src={overrideImage}
                          alt={user?.name || "User"}
                        />
                      ) : (user as any)?.image || (user as any)?.imageUrl ? (
                        <AvatarImage
                          src={(user as any)?.image || (user as any)?.imageUrl}
                          alt={user?.name || "User"}
                        />
                      ) : (
                        <AvatarFallback className="bg-blue-100 text-blue-800 font-medium">
                          {userInitial}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={getProfilePath()}>Profile</Link>
                    </DropdownMenuItem>
                    {/* Staff/Admin quick dashboard entry */}
                    {(session?.user?.role === "STAFF" ||
                      session?.user?.role === "ADMIN") && (
                      <DropdownMenuItem asChild>
                        <Link href="/staff/dashboard">Staff Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    {isEmployee && (
                      <DropdownMenuItem asChild>
                        <Link href="/caregiver/portfolio">Portfolio</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-700 focus:bg-red-50"
                      onClick={handleLogout}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            ) : (
              <>
                <Button
                  variant="ghost"
                  className={cn(
                    "hover:bg-blue-50 hover:text-blue-600 transition-all duration-300",
                    pathname === "/signin" && " text-blue-600"
                  )}
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
                <Button
                  className={cn(
                    "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105",
                    pathname === "/signup" &&
                      "from-blue-700 to-blue-800 shadow-xl scale-105"
                  )}
                  onClick={handleSignup}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t  border-slate-200">
            <div className="flex  flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-slate-700 hover:text-blue-600 font-medium py-2 px-3 rounded-lg transition-colors",
                    isActiveLink(link.href) && "text-blue-600"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
                {isAuthenticated ? (
                  <>
                    {/* Show account links for all authenticated users */}
                    <Link href={getProfilePath()}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Button>
                    </Link>
                    {isEmployee && (
                      <Link href="/caregiver/portfolio">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Portfolio
                        </Button>
                      </Link>
                    )}
                    <Link href="/settings">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Settings
                      </Button>
                    </Link>
                    <Link href={getDashboardPath()}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      
                      variant="ghost"
                      className={cn(
                        "w-fit  justify-start bg-gradient-to-r from-blue-100 to-blue-200 text-slate-700 hover:text-blue-600 hover:bg-blue-300",
                        pathname === "/signin" && "text-blue-600"
                      )}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogin();
                      }}
                    >
                      Sign In
                    </Button>
                    <Button
                      className={cn(
                        "w-fit  bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white",
                        pathname === "/signup" && "from-blue-700 to-blue-800"
                      )}
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignup();
                      }}
                    >
                      Get Started
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function EmployeeHeaderAction() {
  const [loading, setLoading] = React.useState(true);
  const [hasPortfolio, setHasPortfolio] = React.useState<boolean | null>(null);
  const pathname = usePathname();

  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/caregiver/portfolio", {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        if (!alive) return;
        setHasPortfolio(Boolean(json?.portfolio));
      } catch {
        if (!alive) return;
        setHasPortfolio(false);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [pathname]);

  // React to immediate submit without reload
  React.useEffect(() => {
    const onSubmitted = () => setHasPortfolio(true);
    const onFocus = () => {
      // Re-validate on focus
      fetch("/api/caregiver/portfolio", { cache: "no-store" })
        .then((r) => (r.ok ? r.json() : null))
        .then((j) => {
          if (j) setHasPortfolio(Boolean(j?.portfolio));
        })
        .catch(() => {});
    };
    window.addEventListener(
      "portfolio:submitted",
      onSubmitted as EventListener
    );
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener(
        "portfolio:submitted",
        onSubmitted as EventListener
      );
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  if (loading) {
    return (
      <Button
        variant="outline"
        className="border-slate-200 text-slate-500"
        disabled
      >
        <span className="inline-block h-4 w-20 bg-slate-200 rounded animate-pulse" />
      </Button>
    );
  }

  if (hasPortfolio) {
    return <EmployeeAvailabilityButton />;
  }

  return (
    <Link href="/caregiver/portfolio">
      <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow">
        <ClipboardList className="h-4 w-4 mr-2" /> Portfolio
      </Button>
    </Link>
  );
}

function EmployeeAvailabilityButton() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [days, setDays] = useState<Set<string>>(new Set());
  const [shifts, setShifts] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const dayOptions = [
    { value: "Monday", short: "Mon" },
    { value: "Tuesday", short: "Tue" },
    { value: "Wednesday", short: "Wed" },
    { value: "Thursday", short: "Thu" },
    { value: "Friday", short: "Fri" },
    { value: "Saturday", short: "Sat" },
    { value: "Sunday", short: "Sun" },
  ];

  const dayCanonicalMap: Record<string, string> = {
    monday: "Monday",
    mon: "Monday",
    tuesday: "Tuesday",
    tue: "Tuesday",
    tues: "Tuesday",
    wednesday: "Wednesday",
    wed: "Wednesday",
    thursday: "Thursday",
    thu: "Thursday",
    thurs: "Thursday",
    friday: "Friday",
    fri: "Friday",
    saturday: "Saturday",
    sat: "Saturday",
    sunday: "Sunday",
    sun: "Sunday",
  };

  const canonicalizeDay = (s: string) =>
    dayCanonicalMap[s.trim().toLowerCase()] || s.trim();

  const fetchAvailability = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/caregiver/portfolio", {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load availability");
      const json = await res.json();
      const existing: string = json?.portfolio?.suitable_work_days || "";
      const parsed = existing
        .split(",")
        .map((s: string) => canonicalizeDay(s))
        .filter(Boolean);
      setDays(new Set(parsed));

      const existingShift: string = json?.portfolio?.suitable_work_shift || "";
      const parsedShift = existingShift
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
      setShifts(new Set(parsedShift));
    } catch (e: any) {
      setError(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (value: string) => {
    setDays((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const suitable_work_days = Array.from(days).join(",");
      const suitable_work_shift = Array.from(shifts).join(",");
      const res = await fetch("/api/caregiver/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suitable_work_days, suitable_work_shift }),
      });
      if (!res.ok) throw new Error("Failed to save availability");
      setOpen(false);
      toast.success("Availability updated");
    } catch (e: any) {
      setError(e?.message || "Failed to save");
      toast.error(e?.message || "Failed to save availability");
    } finally {
      setSaving(false);
    }
  };

  if (!session) return null;

  return (
    <>
      <Button
        variant="outline"
        className="border-blue-200 text-blue-700 hover:bg-blue-50"
        onClick={() => {
          setOpen(true);
          fetchAvailability();
        }}
      >
        <CalendarDays className="h-4 w-4 mr-2" /> Availability
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white shadow">
                <CalendarDays className="h-5 w-5" />
              </span>
              Set your availability
            </DialogTitle>
            <DialogDescription>
              Choose the days of the week you are available to work. This helps
              employers find you.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-4">
            {loading ? (
              <div className="text-slate-500">Loading…</div>
            ) : (
              <>
                <div>
                  <div className="mb-2 text-sm font-medium text-slate-700 flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-blue-600" />
                    Days of the week
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {dayOptions.map((d) => {
                      const selected = days.has(d.value);
                      return (
                        <button
                          key={d.value}
                          type="button"
                          onClick={() => toggleDay(d.value)}
                          className={cn(
                            "flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors",
                            selected
                              ? "border-blue-300 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          )}
                        >
                          <span className="font-medium">{d.short}</span>
                          {selected && (
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="mb-2 mt-4 text-sm font-medium text-slate-700 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Preferred shifts
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {["Day shift", "Night shift", "Weekends"].map((label) => {
                      const selected = shifts.has(label);
                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() =>
                            setShifts((prev) => {
                              const next = new Set(prev);
                              if (next.has(label)) next.delete(label);
                              else next.add(label);
                              return next;
                            })
                          }
                          className={cn(
                            "flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors",
                            selected
                              ? "border-blue-300 bg-blue-50 text-blue-700"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          )}
                        >
                          <span className="font-medium">{label}</span>
                          {selected && (
                            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                              <Check className="h-3.5 w-3.5" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

            {error && <div className="text-sm text-red-600">{error}</div>}
          </div>

          <DialogFooter className="mt-2">
            <Button
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              onClick={save}
              disabled={saving || loading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
            >
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
