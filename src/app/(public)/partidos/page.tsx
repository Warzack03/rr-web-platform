import { PageHero } from "@/src/components/public/page-hero";
import { MatchesTable } from "@/src/components/public/matches-table";
import { publicMatches } from "@/src/lib/demo-data";

export default function MatchesPage() {
  const firstTeamMatches = publicMatches.filter((match) => match.teamSlug === "primer-equipo");
  const academyMatches = publicMatches.filter((match) => match.teamSlug !== "primer-equipo");

  return (
    <div className="space-y-10 pb-20">
      <PageHero
        eyebrow="Calendario"
        title="Partidos y resultados"
        description="El calendario sale de la home y gana su propia pantalla, con partidos por equipo, estados y videos del Primer Equipo cuando existan."
      />

      <MatchesTable title="Primer Equipo" matches={firstTeamMatches} />
      <MatchesTable title="Academia y cantera" matches={academyMatches} />
    </div>
  );
}
