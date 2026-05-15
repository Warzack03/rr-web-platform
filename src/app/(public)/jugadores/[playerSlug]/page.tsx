import { notFound } from "next/navigation";
import { PageHero } from "@/src/components/public/page-hero";
import { SectionHeader } from "@/src/components/shared/section-header";
import { CTAButton } from "@/src/components/shared/cta-button";
import { getPlayerBySlug } from "@/src/lib/demo-data";

export default async function PlayerDetailPage({
  params,
}: {
  params: Promise<{ playerSlug: string }>;
}) {
  const { playerSlug } = await params;
  const player = getPlayerBySlug(playerSlug);

  if (!player) {
    notFound();
  }

  return (
    <div className="space-y-10 pb-20">
      <PageHero
        title={player.name}
        description={player.summary}
        meta={
          <>
            <span className="rounded-full border border-[var(--rr-border)] bg-black/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
              {player.number}
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-text-muted)]">
              {player.position}
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-text-muted)]">
              {player.country}
            </span>
          </>
        }
        stadium
        rightPanel={
          <div className="flex w-full max-w-[460px] justify-end">
            <div className="flex aspect-[4/5] w-full items-end justify-end rounded-[24px] border border-[var(--rr-border)] bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.18),transparent_24%),linear-gradient(180deg,rgba(7,19,34,0.86),rgba(6,10,18,0.95))] p-6">
              <span className="font-display text-[9rem] leading-none text-[rgba(255,255,255,0.06)]">
                {player.number}
              </span>
            </div>
          </div>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1fr_1.35fr]">
        <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface-card)] p-6">
          <SectionHeader
            eyebrow="Rendimiento tecnico"
            title={player.isGoalkeeper ? "Perfil tactico" : "Rendimiento tecnico"}
            description="Se mantiene la estructura premium de la ficha, pero con datos demo seguros."
          />
          <div className="mt-8 flex min-h-[280px] items-center justify-center rounded-[20px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.48)]">
            <div className="h-40 w-40 rounded-[18px] border border-[var(--rr-border-strong)] bg-[rgba(253,203,88,0.06)]" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {player.headlineStats.map((stat) => (
              <div key={stat.label} className="rounded-[20px] border border-[var(--rr-border)] bg-[var(--rr-surface)] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-text-soft)]">
                  {stat.label}
                </p>
                <p className="mt-3 font-display text-4xl text-white">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface-card)] p-6">
            <SectionHeader
              eyebrow="Ficha publica"
              title={player.premium ? "Cromo premium" : "Representacion visual"}
              description="La ficha muestra dorsal, posicion, equipo, pais, pie dominante y resumen estadistico."
            />
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <CTAButton
                href={player.teamSlug === "primer-equipo" ? "/primer-equipo" : `/equipos/${player.teamSlug}`}
                variant="secondary"
              >
                Ver equipo
              </CTAButton>
              <CTAButton href="/partidos" variant="ghost">
                Ver partidos
              </CTAButton>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
