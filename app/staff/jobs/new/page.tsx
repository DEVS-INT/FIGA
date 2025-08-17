"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StaffPostJobRemoved() {
  const router = useRouter();
  useEffect(() => {
    const t = setTimeout(() => router.replace("/staff/jobs"), 0);
    return () => clearTimeout(t);
  }, [router]);
  return null;
}
