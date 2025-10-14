"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FigaLogo } from "@/components/figa-logo";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  variant?: "default" | "employer" | "caregiver";
}

export function Header({ variant = "default" }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Temporary authentication state - replace with your actual auth context
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john@example.com",
    imageUrl: "https://github.com/shadcn.png",
  });

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

  // Temporary authentication handlers
  const handleLogin = () => {
    setIsAuthenticated(true);
    setUser({
      name: "Jane Smith",
      email: "jane@example.com",
      imageUrl: "https://github.com/shadcn.png",
    });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setMobileMenuOpen(false);
    router.push("/signout");
  };

  return (
    <header className="border-b border-white/20 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
              <FigaLogo size="lg" />
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
                  isActiveLink(link.href) && "text-blue-600  shadow-sm"
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
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer border-2 border-blue-500 hover:scale-105 transition-transform">
                    <AvatarImage src={user.imageUrl} alt={user.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-800 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/caregiver/dashboard">Profile</Link>
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
              <>
                <Link href="/signin">
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
                </Link>
                <Link href="/signup">
                  <Button
                    className={cn(
                      "bg-gradient-to-r from-blue-600 to-blue-900 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105",
                      pathname === "/signup" &&
                        "from-blue-700 to-blue-800 shadow-xl scale-105"
                    )}
                    onClick={handleLogin}
                  >
                    Get Started
                  </Button>
                </Link>
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
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-slate-700 hover:text-blue-600 font-medium py-2 px-3 rounded-lg transition-colors",
                    isActiveLink(link.href) && "text-blue-600  shadow-sm"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-slate-200">
                {isAuthenticated ? (
                  <>
                    <Link href="/caregiver/dashboard">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Button>
                    </Link>
                    <Link href="/settings">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Settings
                      </Button>
                    </Link>
                    <Link href="employer/dashboard">
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
                  <>
                    <Link href="/signin">
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start text-slate-700 hover:text-blue-600 hover:bg-blue-50",
                          pathname === "/signin" && "text-blue-600"
                        )}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogin();
                        }}
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button
                        className={cn(
                          "w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white",
                          pathname === "/signup" && "from-blue-700 to-blue-900"
                        )}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogin();
                        }}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
