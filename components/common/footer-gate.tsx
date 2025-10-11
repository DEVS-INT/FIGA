"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";

// Hides the footer on selected routes
export function FooterGate() {
  const pathname = usePathname();

  // Add routes that should NOT show the footer
  const hiddenRoutes: (string | RegExp)[] = [
    "/signin",
    "/signup",
    "/signout",
    "/jobs",
    // Hide on all employee (caregiver) and employer private areas
    /^\/caregiver(\/.*)?$/,
    /^\/employer(\/.*)?$/,
    /^\/staff(\/.*)?$/,
    /^\/admin(\/.*)?$/,
  ];

  const hide = hiddenRoutes.some((rule) =>
    typeof rule === "string" ? pathname === rule : rule.test(pathname)
  );

  if (hide) return null;
  return <Footer />;
}
