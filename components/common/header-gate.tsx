"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/common/header";

// Hides the header on selected routes (like sign-in) so the page can be perfectly centered
export function HeaderGate() {
  const pathname = usePathname();

  const hiddenRoutes: (string | RegExp)[] = ["/signin", "/signup"];

  const hide = hiddenRoutes.some((rule) =>
    typeof rule === "string" ? pathname === rule : rule.test(pathname)
  );

  if (hide) return null;
  return <Header />;
}
