import { cn } from "@/lib/utils"
import type { ReactNode } from "react"

interface SectionProps {
  children: ReactNode
  className?: string
  padding?: "sm" | "md" | "lg" | "xl"
  background?: "white" | "gray" | "blue" | "transparent"
}

export function Section({ children, className, padding = "lg", background = "transparent" }: SectionProps) {
  const paddingClasses = {
    sm: "py-8",
    md: "py-12",
    lg: "py-20",
    xl: "py-32",
  }

  const backgroundClasses = {
    white: "bg-white",
    gray: "bg-gray-50",
    blue: "bg-blue-50",
    transparent: "bg-transparent",
  }

  return <section className={cn(paddingClasses[padding], backgroundClasses[background], className)}>{children}</section>
}
