// components/auth/auth-guard.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/common";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}

export function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = "/signin",
  allowedRoles = [],
}: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    userRole: string | null;
  }>({ isAuthenticated: false, userRole: null });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          const userData = localStorage.getItem("userData");
          
          if (userData) {
            const { email, role } = JSON.parse(userData);
            
            const demoCredentials = [
              { email: "jobseeker@demo.com", password: "demo123", role: "jobseeker" },
              { email: "employer@demo.com", password: "demo123", role: "employer" },
              { email: "admin@figacare.com", password: "admin123", role: "admin" },
              { email: "staff@figacare.com", password: "staff123", role: "staff" },
            ];

            const isValidUser = demoCredentials.some(
              (cred) => cred.email === email && cred.role === role
            );

            setAuthState({
              isAuthenticated: isValidUser,
              userRole: isValidUser ? role : null,
            });
          } else {
            setAuthState({ isAuthenticated: false, userRole: null });
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthState({ isAuthenticated: false, userRole: null });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !authState.isAuthenticated) {
        router.push(redirectTo);
      } else if (!requireAuth && authState.isAuthenticated) {
        router.push("/dashboard");
      } else if (
        requireAuth &&
        authState.isAuthenticated &&
        allowedRoles.length > 0
      ) {
        if (!authState.userRole || !allowedRoles.includes(authState.userRole)) {
          router.push("/unauthorized");
        }
      }
    }
  }, [isLoading, authState, requireAuth, redirectTo, router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (
    (requireAuth && !authState.isAuthenticated) ||
    (!requireAuth && authState.isAuthenticated) ||
    (allowedRoles.length > 0 &&
      (!authState.userRole || !allowedRoles.includes(authState.userRole)))
  ) {
    return null;
  }

  return <>{children}</>;
}