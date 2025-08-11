import { cn } from "@/lib/utils"

interface FigaLogoProps {
  variant?: "default" | "white"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function FigaLogo({ variant = "default", size = "md", className }: FigaLogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }

  const colorClasses = {
    default: "text-blue-600",
    white: "text-white",
  }

  return (
    <div className={cn("flex items-center", className)}>
      <svg
        className={cn(sizeClasses[size], colorClasses[variant])}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Geometric FIGA logo based on the reference image */}
        <g fill="currentColor">
          {/* Outer diamond frame */}
          <path d="M50 10 L85 35 L85 65 L50 90 L15 65 L15 35 Z" stroke="currentColor" strokeWidth="4" fill="none" />

          {/* Inner geometric pattern forming F-I-G-A */}
          <path d="M25 25 L25 45 L40 45 M25 35 L35 35" strokeWidth="3" stroke="currentColor" fill="none" />
          <path d="M45 25 L45 45 M45 35 L45 35" strokeWidth="3" stroke="currentColor" fill="none" />
          <path
            d="M55 45 L55 25 L70 25 L70 35 L60 35 L70 45 L55 45"
            strokeWidth="3"
            stroke="currentColor"
            fill="none"
          />
          <path d="M25 55 L40 55 L32.5 70 L25 55 M40 55 L40 75" strokeWidth="3" stroke="currentColor" fill="none" />

          {/* Connecting lines */}
          <path d="M30 50 L70 50" strokeWidth="2" stroke="currentColor" opacity="0.6" />
          <path d="M50 20 L50 80" strokeWidth="2" stroke="currentColor" opacity="0.6" />
        </g>
      </svg>
      <span className={cn("ml-3 text-xl font-bold", colorClasses[variant])}>FIGA</span>
    </div>
  )
}
