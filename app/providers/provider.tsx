"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { ReactNode } from "react";
import SessionTimeoutWatcher from "@/components/auth/SessionTimeoutWatcher";

interface AuthProviderProps {
  children: ReactNode;
  session?: Session | null;
}

export default function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session}>
      <SessionTimeoutWatcher />
      {children}
    </SessionProvider>
  );
}
