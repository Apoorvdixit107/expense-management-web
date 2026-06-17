import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const variants = {
  primary: "bg-brand text-white hover:bg-brand-hover",
  secondary: "border border-border bg-surface text-ink hover:bg-paper",
  ghost: "text-muted hover:bg-paper hover:text-ink",
  danger: "bg-error text-white hover:bg-red-700",
  outline: "border-2 border-brand bg-surface text-brand hover:bg-brand-light",
};

export function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  className = "",
  disabled,
  onClick,
}: ButtonProps) {
  const classes = `inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}
