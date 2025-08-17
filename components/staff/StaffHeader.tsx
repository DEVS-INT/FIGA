import React from "react";
import { cn } from "@/lib/utils";

interface StaffHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  right?: React.ReactNode;
}

export function StaffHeader({
  title,
  subtitle,
  className,
  right,
}: StaffHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="flex items-center gap-2">{right}</div> : null}
    </div>
  );
}

export default StaffHeader;
