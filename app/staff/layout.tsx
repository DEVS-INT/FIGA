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
      <main className="flex-1 overflow-x-hidden pl-4 md:pl-6 lg:pl-8 pr-4 md:pr-6 lg:pr-8 py-4 md:py-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
