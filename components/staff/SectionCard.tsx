import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SectionCardProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function SectionCard({
  header,
  children,
  className,
  contentClassName,
}: SectionCardProps) {
  return (
    <Card className={cn("shadow-sm border-slate-200", className)}>
      {header ? <CardHeader className="pb-0">{header}</CardHeader> : null}
      <CardContent className={cn("pt-4", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}

export default SectionCard;
