import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

export function CTAButton({
  href,
  children,
  variant = "primary",
  className,
}: CTAButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 border px-5 py-3 font-[var(--rr-font-body)] text-[0.96rem] font-bold uppercase leading-none tracking-[0.18em] transition md:min-w-[180px] [&_svg]:shrink-0 [&_svg]:stroke-current [&_svg]:text-current",
        variant === "primary"
          ? "border-[color:var(--rr-gold)] bg-[color:var(--rr-gold)] text-[color:var(--rr-on-gold)] hover:-translate-y-0.5 hover:bg-[#ffd46f]"
          : "border-[color:var(--rr-gold)] bg-transparent text-[color:var(--rr-gold)] hover:bg-[rgba(253,203,88,0.08)]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
