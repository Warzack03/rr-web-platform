import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { CTAButton } from "@/components/public/cta-button";
import type { PublicHomePageContent } from "@/lib/public/home-content";

type HomeAcademySummaryProps = {
  content: PublicHomePageContent["academy"];
};

export function HomeAcademySummary({ content }: HomeAcademySummaryProps) {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 py-12 md:px-8 md:py-16 xl:px-16">
      <div className="rr-panel overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="relative overflow-hidden border-b border-[color:var(--rr-border)] p-6 md:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(210,231,255,0.12),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]" />
            <div className="relative">
              <div className="inline-flex h-12 w-12 items-center justify-center border border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.08)] text-[color:var(--rr-gold)]">
                <Sparkles className="h-5 w-5" strokeWidth={1.8} />
              </div>

              <p className="rr-kicker mt-5 text-[color:var(--rr-gold)]">{content.eyebrow}</p>
              <h2 className="rr-display mt-4 text-[3.2rem] leading-[0.9] text-white md:text-[4rem]">
                {content.title}
              </h2>
              <p className="mt-4 max-w-[34rem] text-[1.04rem] leading-7 text-[color:var(--rr-muted)]">
                {content.description}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                {content.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-4"
                  >
                    <div className="rr-display text-[2.6rem] leading-none text-white">{metric.value}</div>
                    <div className="rr-kicker mt-2 text-[0.78rem] text-[color:var(--rr-muted)]">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7">
                <CTAButton href={content.href} className="w-full sm:w-auto">
                  <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
                  Ver equipos
                </CTAButton>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 lg:p-10">
            <div className="flex items-center justify-between gap-4">
              <h3 className="rr-kicker text-[0.92rem] text-[color:var(--rr-muted)]">Equipos destacados</h3>
              <div className="rr-bolt-divider w-14" />
            </div>

            <div className="mt-5 space-y-3">
              {content.teams.map((team) => (
                <Link
                  key={team.slug}
                  href={`/equipos/${team.slug}`}
                  className="group flex items-center justify-between gap-4 border border-white/10 bg-[rgba(255,255,255,0.03)] px-4 py-4 transition hover:-translate-y-0.5 hover:border-[color:var(--rr-border-strong)] hover:bg-[rgba(255,255,255,0.05)]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {team.logoUrl?.startsWith("/") ? (
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center">
                        <Image
                          src={team.logoUrl}
                          alt={team.logoAlt ?? `Escudo ${team.name}`}
                          width={48}
                          height={48}
                          className="h-12 w-12 object-contain"
                        />
                      </span>
                    ) : null}
                    <div className="min-w-0">
                      <p className="rr-display text-[2rem] leading-none text-white">{team.name}</p>
                      <p className="mt-1 truncate text-[0.94rem] uppercase tracking-[0.14em] text-[color:var(--rr-muted)]/82">
                        {team.category} - {team.competition}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="h-4 w-4 shrink-0 text-[color:var(--rr-gold)] transition group-hover:translate-x-1" strokeWidth={2} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
