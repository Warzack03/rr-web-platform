import Link from "next/link";
import { CalendarDays, Shield, Trophy, Users } from "lucide-react";
import type { PublicPlayerProfile } from "@/lib/public/player-profile-content";

type PlayerContextLinksProps = {
  player: PublicPlayerProfile;
};

export function PlayerContextLinks({ player }: PlayerContextLinksProps) {
  if (player.teamType !== "academy") {
    return null;
  }

  const baseHref = `/equipos/${player.teamSlug}`;
  const links = [
    { href: baseHref, label: "Equipo", icon: Shield },
    { href: `${baseHref}/calendario`, label: "Calendario", icon: CalendarDays },
    { href: `${baseHref}/plantilla`, label: "Plantilla", icon: Users },
    { href: `${baseHref}/clasificacion`, label: "Clasificacion", icon: Trophy },
  ] as const;

  return (
    <div className="flex flex-wrap gap-3">
      {links.map((link) => {
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex min-h-11 items-center gap-2 border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-[1rem] text-white transition hover:-translate-y-0.5 hover:border-[color:var(--rr-border-strong)] hover:bg-[rgba(255,255,255,0.05)]"
          >
            <Icon className="h-4 w-4 text-[color:var(--rr-gold)]" strokeWidth={1.9} />
            <span className="rr-kicker text-[0.84rem] text-[color:var(--rr-muted)]">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
