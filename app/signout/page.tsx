"use client";

import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOutPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, go home immediately
    if (status === "unauthenticated") {
      router.replace("/");
      return;
    }
    // Trigger NextAuth sign out and send user to home
    const timer = setTimeout(() => {
      signOut({ callbackUrl: "/" });
    }, 250);
    return () => clearTimeout(timer);
  }, [status, router]);

  return (
    <main className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <h1 className="text-2xl font-semibold mb-2">Signing you out…</h1>
        <p className="text-slate-600">
          You’ll be redirected to the homepage in a moment.
        </p>
        <div className="mt-6 inline-flex h-10 w-10 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
      </div>
    </main>
  );
}
