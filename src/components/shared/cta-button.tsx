import Link from "next/link";
import { cn } from "@/lib/utils";

type CTAButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  external?: boolean;
  fullWidth?: boolean;
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  size = "md",
  external = false,
  fullWidth = false,
}: CTAButtonProps) {
  const className = cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--rr-radius-pill)] border font-semibold uppercase tracking-[0.18em] transition duration-300 hover:-translate-y-0.5",
    size === "sm" ? "px-5 py-2.5 text-sm" : "px-6 py-3.5 text-sm sm:text-[15px]",
    fullWidth ? "w-full" : "",
    variant === "primary" &&
      "border-[var(--rr-accent)] bg-[var(--rr-accent)] text-[var(--rr-bg)] shadow-[var(--rr-shadow)] hover:brightness-105",
    variant === "secondary" &&
      "border-[var(--rr-border-strong)] bg-transparent text-[var(--rr-accent)] hover:bg-[var(--rr-accent)] hover:text-[var(--rr-bg)]",
    variant === "ghost" &&
      "border-[var(--rr-border)] bg-white/5 text-[var(--rr-text)] hover:border-[var(--rr-border-strong)] hover:text-[var(--rr-accent)]",
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
