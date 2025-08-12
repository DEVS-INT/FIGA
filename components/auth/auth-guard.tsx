// components/auth/auth-guard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const userRole = session?.user?.role as string | undefined;

  useEffect(() => {
    if (status === "loading") return;

    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo);
    } else if (!requireAuth && isAuthenticated) {
      router.push("/dashboard");
    } else if (
      requireAuth &&
      isAuthenticated &&
      allowedRoles.length > 0 &&
      (!userRole || !allowedRoles.includes(userRole))
    ) {
      router.push("/unauthorized");
    }
  }, [status, requireAuth, isAuthenticated, redirectTo, router, allowedRoles, userRole]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (
    (requireAuth && !isAuthenticated) ||
    (!requireAuth && isAuthenticated) ||
    (allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole)))
  ) {
    return null;
  }

  return <>{children}</>;
}