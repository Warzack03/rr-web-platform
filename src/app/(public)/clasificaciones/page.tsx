import { PageHero } from "@/src/components/public/page-hero";
import { StandingsTable } from "@/src/components/public/standings-table";
import { publicTeams, getStandings } from "@/src/lib/demo-data";

export default function StandingsPage() {
  return (
    <div className="space-y-10 pb-20">
      <PageHero
        eyebrow="Clasificaciones"
        title="Tablas y posiciones"
        description="Las clasificaciones manuales se separan de la home y se presentan por equipo con el propio club destacado."
      />

      <div className="grid gap-6">
        {publicTeams.slice(0, 3).map((team) => (
          <StandingsTable
            key={team.slug}
            rows={getStandings(team.slug)}
            title={`${team.name} · ${team.competition}`}
          />
        ))}
      </div>
    </div>
  );
}
