import { SectionHeader } from "@/src/components/shared/section-header";
import { CTAButton } from "@/src/components/shared/cta-button";
import { PageHero } from "@/src/components/public/page-hero";
import { TeamCard } from "@/src/components/public/team-card";
import { publicTeams } from "@/src/lib/demo-data";

const featuredTeam = publicTeams[0];
const academyTeams = publicTeams.filter((team) => !team.isFirstTeam);

export default function TeamsPage() {
  return (
    <div className="space-y-10 pb-20">
      <PageHero
        eyebrow="Estructura deportiva"
        title="Nuestros equipos"
        description="La esencia del club se reparte por categorias. Cada equipo tiene ahora su propio espacio, en lugar de vivir comprimido en la home."
        rightPanel={
          <div className="rounded-[22px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.7)] p-5 text-right">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
              Temporada activa
            </p>
            <p className="mt-3 font-display text-5xl uppercase text-white">2026/27</p>
          </div>
        }
      />

      <section className="space-y-6">
        <SectionHeader eyebrow="Primer Equipo" title="Acceso premium del club" />
        <div className="grid gap-0 overflow-hidden rounded-[24px] border border-[var(--rr-border-strong)] bg-[linear-gradient(145deg,rgba(32,52,81,0.96),rgba(9,20,36,0.98))] lg:grid-cols-[1.25fr_0.75fr]">
          <div className="rr-stadium-surface min-h-[280px]" />
          <div className="flex flex-col justify-center gap-5 px-6 py-8">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
              {featuredTeam.clubTag}
            </p>
            <h2 className="font-display text-5xl uppercase text-white">{featuredTeam.name}</h2>
            <p className="text-lg leading-7 text-[var(--rr-text-muted)]">{featuredTeam.summary}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CTAButton href="/primer-equipo">Ver plantilla completa</CTAButton>
              <CTAButton href="/partidos" variant="ghost">
                Calendario
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Cantera"
          title="Academia de alto rendimiento"
          description="Agrupamos cantera y filial para que el listado se parezca al wireframe y tenga jerarquia real."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {academyTeams.map((team) => (
            <TeamCard key={team.slug} team={team} />
          ))}
          <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface-card)] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
              Futuro Raimon
            </p>
            <h3 className="mt-3 font-display text-4xl uppercase text-white">Metodologia</h3>
            <p className="mt-4 text-base leading-7 text-[var(--rr-text-muted)]">
              El bloque final del listado queda reservado para explicar el ecosistema formativo sin saturar la pantalla.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
