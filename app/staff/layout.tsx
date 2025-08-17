import React from "react";
import { Sidebar } from "@/components/layout/sidebar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="hidden md:block">
        <Sidebar variant="staff" />
      </aside>
      <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
    </div>
  );
}
