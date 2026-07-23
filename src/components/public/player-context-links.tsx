import Link from "next/link";
import { CalendarDays, Shield, Trophy, Users } from "lucide-react";
import type { PublicPlayerProfile } from "@/lib/contracts/public";

type PlayerContextLinksProps = {
  player: PublicPlayerProfile;
};

export function PlayerContextLinks({ player }: PlayerContextLinksProps) {
  const academyTeams = player.relatedTeams?.filter((team) => team.teamType === "academy") ?? [];
  const relatedTeams = Array.from(
    new Map(
      (player.relatedTeams ?? []).map((team) => [`${team.teamType}:${team.teamSlug}`, team]),
    ).values(),
  );

  if (relatedTeams.length > 1) {
    return (
      <div className="space-y-3">
        <p className="rr-kicker text-[0.78rem] text-[color:var(--rr-gold)]">
          Equipos en esta temporada
        </p>
        <div className="flex flex-wrap gap-3">
          {relatedTeams.map((team) => {
            const href =
              team.teamType === "first-team" ? "/primer-equipo" : `/equipos/${team.teamSlug}`;

            return (
              <Link
                key={`${team.teamType}-${team.teamSlug}`}
                href={href}
                className="inline-flex min-h-11 items-center gap-2 border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-white transition hover:-translate-y-0.5 hover:border-[color:var(--rr-border-strong)] hover:bg-[rgba(255,255,255,0.05)]"
              >
                <Shield className="h-4 w-4 text-[color:var(--rr-gold)]" strokeWidth={1.9} />
                <span className="rr-kicker text-[0.84rem] text-[color:var(--rr-muted)]">
                  {team.teamLabel}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  if (player.teamType !== "academy") {
    return null;
  }

  const baseTeamSlug =
    academyTeams.length === 0
      ? player.teamSlug
      : academyTeams.length === 1
        ? academyTeams[0].teamSlug
        : null;

  if (!baseTeamSlug) {
    return null;
  }

  const baseHref = `/equipos/${baseTeamSlug}`;
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
