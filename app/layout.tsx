import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HeaderGate } from "@/components/common/header-gate";
import { FooterGate } from "@/components/common/footer-gate";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./providers/provider";
import { authOptions } from "@/app/api/auth/authOptions";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FIGA LLC - Connecting Families with Trusted Caregivers",
  description:
    "Professional caregiving services in the San Francisco Bay Area. Find qualified caregivers or join our team of compassionate professionals.",
  keywords:
    "caregiving, elder care, home care, San Francisco, Bay Area, caregivers",
  generator: "v0.dev",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider session={session}>
          <div className="flex flex-col min-h-screen">
            <HeaderGate />
            <Toaster />
            <main className="flex-1">{children}</main>
            <FooterGate />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
