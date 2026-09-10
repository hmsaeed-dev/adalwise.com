import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "gold" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  icon,
  className,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-label-md uppercase tracking-wider font-semibold transition-all active:scale-[0.98] select-none";

  const variantClasses = {
    primary:
      "bg-primary-container text-surface hover:bg-primary rounded-full shadow-sm",
    secondary:
      "bg-secondary text-on-secondary hover:bg-secondary-container hover:text-on-secondary-container rounded-full",
    gold:
      "bg-tertiary-container text-on-tertiary-container hover:bg-tertiary-fixed rounded-full shadow-sm",
    outline:
      "bg-transparent border border-outline-variant text-primary hover:bg-surface-container rounded-full",
    ghost:
      "bg-transparent text-primary hover:bg-surface-container rounded-full",
  };

  const sizeClasses = {
    sm: "min-h-[36px] px-space-sm py-1 text-label-sm gap-1",
    md: "min-h-[44px] px-space-md py-space-xs text-label-md gap-space-xs",
    lg: "min-h-[48px] px-space-lg py-space-sm text-body-md gap-space-sm",
  };

  const combinedClasses = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        <span>{children}</span>
        {icon && <span className="inline-flex shrink-0">{icon}</span>}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      <span>{children}</span>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
    </button>
  );
}
