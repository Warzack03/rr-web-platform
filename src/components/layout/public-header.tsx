"use client";

import Link from "next/link";
import { Menu, Shield, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { CTAButton } from "@/src/components/shared/cta-button";
import { ClubMark } from "@/src/components/shared/club-mark";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Primer Equipo", href: "/primer-equipo" },
  { label: "Equipos", href: "/equipos" },
  { label: "Noticias", href: "/noticias" },
];

export function PublicHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  function isActivePath(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--rr-border)] bg-[rgba(8,20,38,0.82)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[var(--rr-container)] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <ClubMark />
          <div>
            <p className="font-display text-xl uppercase tracking-[0.06em] text-[var(--rr-accent)] sm:text-2xl">
              Rising Raimon
            </p>
            <p className="text-sm uppercase tracking-[0.18em] text-[var(--rr-text-soft)]">
              Football Hub
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "border-b-2 pb-1 text-sm font-semibold uppercase tracking-[0.18em] transition",
                isActivePath(item.href)
                  ? "border-[var(--rr-accent)] text-[var(--rr-accent)]"
                  : "border-transparent text-[var(--rr-text)] hover:text-[var(--rr-accent)]",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <CTAButton href="https://tienda.risingraimon.es" external size="sm">
            Tienda Oficial
          </CTAButton>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((currentValue) => !currentValue)}
          className="inline-flex rounded-full border border-[var(--rr-border)] bg-white/5 p-3 text-[var(--rr-text)] transition hover:border-[var(--rr-border-strong)] hover:text-[var(--rr-accent)] lg:hidden"
          aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-[var(--rr-border)] bg-[rgba(8,20,38,0.94)] px-4 py-4 lg:hidden">
          <nav className="mx-auto flex max-w-[var(--rr-container)] flex-col gap-3">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-[16px] border px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] transition",
                  isActivePath(item.href)
                    ? "border-[var(--rr-border-strong)] bg-[var(--rr-accent)]/10 text-[var(--rr-accent)]"
                    : "border-[var(--rr-border)] bg-white/5 text-[var(--rr-text)] hover:border-[var(--rr-border-strong)] hover:text-[var(--rr-accent)]",
                )}
              >
                {item.label}
              </Link>
            ))}

            <CTAButton href="https://tienda.risingraimon.es" external fullWidth size="sm">
              Tienda Oficial
            </CTAButton>
            <Link
              href="/admin/login"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center gap-2 rounded-[16px] border border-[var(--rr-border)] bg-[var(--rr-surface)] px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rr-text-soft)] transition hover:text-white"
            >
              <Shield className="h-4 w-4" />
              Admin
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
