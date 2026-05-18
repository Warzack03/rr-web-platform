import Link from "next/link";
import { Menu, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", key: "home" },
  { href: "/primer-equipo", label: "Primer Equipo", key: "primer-equipo" },
  { href: "/equipos", label: "Equipos", key: "equipos" },
  { href: "/noticias", label: "Noticias", key: "noticias" },
] as const;

type PublicHeaderProps = {
  activeKey?: (typeof navItems)[number]["key"];
};

export function PublicHeader({ activeKey }: PublicHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--rr-border)] bg-[rgba(7,22,41,0.9)] backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between gap-4 px-5 md:px-8 xl:px-16">
        <Link href="/primer-equipo" className="flex shrink-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-[4px] border border-[color:var(--rr-gold)] bg-[rgba(253,203,88,0.08)] text-[color:var(--rr-gold)]">
            <Shield className="h-4 w-4" strokeWidth={1.8} />
          </span>
          <span className="rr-brand text-[2.25rem] leading-none text-[color:var(--rr-gold)] sm:text-[2.7rem]">
            Rising Raimon
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => {
            const isActive = item.key === activeKey;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "rr-kicker border-b pb-1 text-[0.98rem] text-[color:var(--rr-text)]/82 transition hover:text-[color:var(--rr-gold)]",
                  isActive && "border-[color:var(--rr-gold)] text-[color:var(--rr-gold)]",
                  !isActive && "border-transparent",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <a
            href="https://tienda.risingraimon.es"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center border border-[color:var(--rr-gold)] bg-[color:var(--rr-gold)] px-6 py-3 font-[var(--rr-font-body)] text-[0.96rem] font-bold uppercase leading-none tracking-[0.18em] text-[color:var(--rr-on-gold)] transition hover:-translate-y-0.5 hover:bg-[#ffd46f]"
          >
            Tienda Oficial
          </a>
        </div>

        <details className="relative md:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-[4px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] text-[color:var(--rr-text)]">
            <Menu className="h-5 w-5" />
          </summary>
          <div className="rr-panel absolute right-0 mt-3 w-60 overflow-hidden">
            <nav className="flex flex-col">
              {navItems.map((item) => {
                const isActive = item.key === activeKey;

                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={cn(
                      "rr-kicker border-b border-[color:var(--rr-border)] px-4 py-3 text-[0.92rem] text-[color:var(--rr-text)]/84 last:border-b-0",
                      isActive && "bg-[rgba(253,203,88,0.08)] text-[color:var(--rr-gold)]",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <a
                href="https://tienda.risingraimon.es"
                target="_blank"
                rel="noreferrer"
                className="mx-4 my-4 inline-flex min-h-12 items-center justify-center border border-[color:var(--rr-gold)] bg-[color:var(--rr-gold)] px-4 py-3 text-center font-[var(--rr-font-body)] text-[0.92rem] font-bold uppercase leading-none tracking-[0.18em] text-[color:var(--rr-on-gold)]"
              >
                Tienda Oficial
              </a>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}
