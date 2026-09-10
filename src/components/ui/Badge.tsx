import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "category" | "gold" | "secondary" | "subtle";
  className?: string;
}

export function Badge({ children, variant = "category", className }: BadgeProps) {
  const variantStyles = {
    category:
      "bg-surface-container text-primary border border-surface-container-high font-semibold",
    gold:
      "bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary-container/40 font-semibold",
    secondary:
      "bg-secondary-container text-on-secondary-container font-semibold",
    subtle:
      "bg-surface-container-low text-on-surface-variant font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-space-sm py-0.5 rounded-full text-label-sm uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
