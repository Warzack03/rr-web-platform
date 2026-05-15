import Link from "next/link";
import { ArrowRight, ChevronRight, ShoppingBag } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { MatchCard } from "@/src/components/shared/match-card";
import { SectionHeader } from "@/src/components/shared/section-header";
import { StatChip } from "@/src/components/shared/stat-chip";
import { NewsCard } from "@/src/components/public/news-card";
import { TeamCard } from "@/src/components/public/team-card";
import { PageHero } from "@/src/components/public/page-hero";
import { StandingsTable } from "@/src/components/public/standings-table";
import {
  getLatestResults,
  getRelatedNews,
  getStandings,
  getUpcomingMatch,
  publicTeams,
} from "@/src/lib/demo-data";

const firstTeam = publicTeams[0];
const featuredMatch = getUpcomingMatch("primer-equipo");
const recentResults = getLatestResults("primer-equipo").slice(0, 3);
const recentNews = getRelatedNews("primer-equipo").slice(0, 3);

export default function HomePage() {
  return (
    <div className="space-y-12 pb-20 lg:space-y-16">
      <PageHero
        eyebrow="El nuevo estandar"
        title="Mas que un club, una identidad"
        description="La home pasa a ser una puerta de entrada clara: presenta el club, destaca al Primer Equipo y deriva el resto del contenido a rutas propias."
        stadium
        actions={
          <>
            <CTAButton href="/primer-equipo">Ver Primer Equipo</CTAButton>
            <CTAButton href="/equipos" variant="secondary">
              Ver equipos
            </CTAButton>
          </>
        }
        rightPanel={
          <div className="w-full max-w-[360px] rounded-[24px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.72)] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rr-accent)]">
              Club
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <StatChip label="Temporada" value="2026/27" />
              <StatChip label="Equipos" value="12" />
              <StatChip label="Academia" value="Activa" />
            </div>
          </div>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <SectionHeader
            eyebrow="La arena de batalla"
            title="Proximo partido del Primer Equipo"
            description="La home resume el punto mas relevante del fin de semana y manda al resto del calendario a su ruta propia."
            action={
              <Link
                href="/partidos"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rr-accent)]"
              >
                Ver calendario
                <ChevronRight className="h-4 w-4" />
              </Link>
            }
          />

          {featuredMatch ? <MatchCard match={featuredMatch} variant="featured" /> : null}

          <div className="grid gap-4 lg:grid-cols-3">
            {recentResults.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <StandingsTable rows={getStandings("primer-equipo")} compact title="Clasificacion" />

          <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface-card)] p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rr-accent)]">
              Acceso destacado
            </p>
            <h3 className="mt-3 font-display text-4xl uppercase text-white">{firstTeam.name}</h3>
            <p className="mt-3 text-base leading-7 text-[var(--rr-text-muted)]">
              Pagina propia con plantilla, noticias, estadisticas avanzadas y piezas premium.
            </p>
            <div className="mt-5 flex flex-col gap-3">
              <CTAButton href="/primer-equipo">
                Entrar al Primer Equipo
                <ArrowRight className="h-4 w-4" />
              </CTAButton>
              <CTAButton href="/clasificaciones" variant="ghost">
                Ver clasificaciones
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
          <SectionHeader
            eyebrow="Actualidad"
            title="Noticias recientes"
            description="Las noticias se resumen aqui, pero el listado y el detalle ya viven en rutas separadas."
            action={
              <Link
                href="/noticias"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rr-accent)]"
              >
                Todas las noticias
                <ChevronRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="space-y-4">
            {recentNews.map((item) => (
              <NewsCard key={item.slug} item={item} />
            ))}
          </div>
        </div>

        <div className="rounded-[24px] border border-[var(--rr-border)] bg-[linear-gradient(145deg,rgba(29,46,72,0.94),rgba(10,18,30,0.98))] p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rr-accent)]">
            Comunidad y club
          </p>
          <h3 className="mt-3 font-display text-5xl uppercase text-white">Centro de alto rendimiento</h3>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-[var(--rr-text-muted)]">
            La nueva home mantiene el tono premium, pero ordena la informacion para que cada pantalla tenga una funcion clara.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <StatChip label="Campos" value="4" />
            <StatChip label="Equipos" value="12" />
            <StatChip label="Atletas" value="300+" />
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Estructura deportiva"
          title="Equipos y cantera"
          description="La home solo presenta accesos. El desarrollo completo de cada equipo vive en su propia pagina."
          action={
            <Link
              href="/equipos"
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rr-accent)]"
            >
              Ir al listado
              <ChevronRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {publicTeams.map((team) => (
            <TeamCard key={team.slug} team={team} />
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-[var(--rr-border)] bg-[var(--rr-surface-card)] px-5 py-6 sm:px-8 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--rr-accent)]">
              Tienda oficial
            </p>
            <h2 className="font-display text-4xl uppercase text-white sm:text-5xl">
              Comercio fuera de esta aplicacion
            </h2>
            <p className="max-w-2xl text-lg leading-7 text-[var(--rr-text-muted)]">
              La tienda sigue en WooCommerce y se enlaza desde la web deportiva sin mezclar responsabilidades.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
            <CTAButton href="https://tienda.risingraimon.es" external>
              <ShoppingBag className="h-4 w-4" />
              Ir a la tienda
            </CTAButton>
            <CTAButton href="/noticias" variant="ghost">
              Ver actualidad
            </CTAButton>
          </div>
        </div>
      </section>
    </div>
  );
}
