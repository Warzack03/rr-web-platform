import Link from "next/link";
import { BarChart3, CalendarDays, Shield, Trophy, Users } from "lucide-react";
import type { TeamSectionKey, TeamSectionNavLink } from "@/lib/public/team-section-links";
import { cn } from "@/lib/utils";

const NAV_ICONS = {
  overview: Shield,
  squad: Users,
  calendar: CalendarDays,
  standing: Trophy,
  statistics: BarChart3,
} satisfies Record<TeamSectionKey, typeof Shield>;

type TeamSectionNavigationProps = {
  links: TeamSectionNavLink[];
  activeKey: TeamSectionKey;
  className?: string;
};

export function TeamSectionNavigation({
  links,
  activeKey,
  className,
}: TeamSectionNavigationProps) {
  return (
    <nav className={cn("flex flex-wrap gap-3", className)} aria-label="Secciones del equipo">
      {links.map((link) => {
        const Icon = NAV_ICONS[link.key];
        const isActive = link.key === activeKey;

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 border px-4 py-3 text-[1rem] transition",
              isActive
                ? "border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.1)] text-white"
                : "border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] text-white hover:-translate-y-0.5 hover:border-[color:var(--rr-border-strong)] hover:bg-[rgba(255,255,255,0.05)]",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4",
                isActive ? "text-[color:var(--rr-gold)]" : "text-[color:var(--rr-gold)]",
              )}
              strokeWidth={1.9}
            />
            <span
              className={cn(
                "rr-kicker text-[0.84rem]",
                isActive ? "text-[color:var(--rr-gold)]" : "text-[color:var(--rr-muted)]",
              )}
            >
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export const TeamStatsNavigation = TeamSectionNavigation;
