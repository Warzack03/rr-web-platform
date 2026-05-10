"use client";

import {
  LayoutDashboard,
  Menu,
  Newspaper,
  ShieldCheck,
  ShieldUser,
  Swords,
  Trophy,
  Users,
  UserSquare2,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { AdminNavItem } from "@/server/auth/permissions";

const iconMap = {
  dashboard: LayoutDashboard,
  seasons: Trophy,
  teams: ShieldUser,
  players: Users,
  matches: Swords,
  standings: Trophy,
  stats: UserSquare2,
  news: Newspaper,
  imports: ShieldCheck,
  users: Users,
  settings: ShieldUser,
} as const;

type AdminSidebarProps = {
  items: AdminNavItem[];
};

export function AdminSidebar({ items }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = items.map((item) => {
    const Icon = iconMap[item.section];
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setIsOpen(false)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition",
          isActive
            ? "border-amber-300/60 bg-amber-400 text-slate-950 shadow-[0_18px_40px_-26px_rgba(251,191,36,0.92)]"
            : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/18 hover:bg-white/[0.07] hover:text-white",
        )}
      >
        <Icon className="h-4 w-4" />
        {item.label}
      </Link>
    );
  });

  return (
    <>
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setIsOpen((currentValue) => !currentValue)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Cerrar menu" : "Abrir menu"}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-slate-100 transition hover:border-white/18 hover:bg-white/[0.07]"
        >
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          Menu
        </button>

        {isOpen ? (
          <nav className="mt-3 flex flex-col gap-2 rounded-[24px] border border-white/10 bg-slate-950/85 p-3">
            {navItems}
          </nav>
        ) : null}
      </div>

      <nav className="hidden flex-wrap justify-center gap-2 md:flex">{navItems}</nav>
    </>
  );
}
