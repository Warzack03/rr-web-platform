"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarRange,
  ClipboardList,
  Gauge,
  Image,
  Newspaper,
  Settings,
  ShieldUser,
  Swords,
  Trophy,
  Upload,
  UserRoundCog,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminNavItem } from "@/server/auth/permissions";

export const adminIconMap = {
  dashboard: Gauge,
  seasons: CalendarRange,
  teams: ShieldUser,
  players: Users,
  assignments: ClipboardList,
  matches: Swords,
  standings: Trophy,
  stats: Gauge,
  news: Newspaper,
  media: Image,
  imports: Upload,
  users: UserRoundCog,
  settings: Settings,
} as const;

type AdminNavigationProps = {
  items: AdminNavItem[];
  onNavigate?: () => void;
};

export function AdminNavigation({ items, onNavigate }: AdminNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {items.map((item) => {
        const Icon = adminIconMap[item.section];
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-[18px] border px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] transition",
              isActive
                ? "border-[var(--rr-border-strong)] bg-[rgba(120,143,180,0.32)] text-[var(--rr-accent)]"
                : "border-transparent text-[var(--rr-text-muted)] hover:border-[var(--rr-border)] hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
