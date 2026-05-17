import Link from "next/link";
import { ArrowRight, CalendarDays, Gem, Shield, Sparkles, Trophy } from "lucide-react";
import { CTAButton } from "@/components/public/cta-button";
import { cn } from "@/lib/utils";
import type {
  AcademyPromoContent,
  AcademyTeamCardContent,
  FeaturedFirstTeamContent,
  TeamsPageHeroContent,
} from "@/lib/public/teams-directory-content";

export function TeamsPageHeader({ chip, title, description }: TeamsPageHeroContent) {
  return (
    <section className="relative isolate overflow-hidden border-b border-[color:var(--rr-border)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(77,114,164,0.22),transparent_32%),linear-gradient(180deg,rgba(10,22,39,0.86)_0%,rgba(12,20,30,0.96)_100%)]" />
      <div className="absolute inset-x-[16%] top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(253,203,88,0.45),transparent)]" />

      <div className="relative mx-auto flex w-full max-w-[1280px] justify-center px-5 py-16 text-center md:px-8 md:py-24 xl:px-16">
        <div className="max-w-3xl">
          <span className="rr-chip text-[color:var(--rr-gold)]">{chip}</span>
          <h1 className="rr-display mt-6 text-[3.6rem] leading-[0.9] text-white sm:text-[4.8rem] lg:text-[5.9rem]">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[1.08rem] leading-7 text-[color:var(--rr-muted)] md:text-[1.2rem]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}

export function FeaturedFirstTeamPanel({
  sectionTitle,
  eyebrow,
  name,
  description,
  primaryCta,
  secondaryCta,
}: FeaturedFirstTeamContent) {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 py-12 md:px-8 md:py-16 xl:px-16">
      <SectionHeading title={sectionTitle} accent="gold" />

      <article className="mt-7 overflow-hidden rounded-[0.5rem] border border-[color:var(--rr-border)] bg-[linear-gradient(180deg,rgba(33,50,78,0.98),rgba(24,37,58,0.98))] shadow-[var(--rr-shadow)]">
        <div className="grid lg:grid-cols-[1.55fr_1fr]">
          <FeaturedVisual />

          <div className="flex flex-col gap-6 p-6 md:p-8 lg:p-10">
            <div>
              <p className="rr-kicker text-[color:var(--rr-gold)]">{eyebrow}</p>
              <h2 className="rr-display mt-4 text-[3.4rem] leading-[0.9] text-white md:text-[4.3rem]">
                {name}
              </h2>
              <p className="mt-5 max-w-md text-[1.04rem] leading-7 text-[color:var(--rr-muted)] md:text-[1.12rem]">
                {description}
              </p>
            </div>

            <div className="mt-auto flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <CTAButton href={primaryCta.href} className="w-full sm:w-auto">
                <Trophy className="h-4 w-4" strokeWidth={1.9} />
                {primaryCta.label}
              </CTAButton>
              <CTAButton href={secondaryCta.href} variant="secondary" className="w-full sm:w-auto">
                <CalendarDays className="h-4 w-4" strokeWidth={1.9} />
                {secondaryCta.label}
              </CTAButton>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export function AcademyTeamsGrid({
  title,
  chip,
  teams,
  promo,
}: {
  title: string;
  chip: string;
  teams: AcademyTeamCardContent[];
  promo: AcademyPromoContent;
}) {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 pb-16 md:px-8 md:pb-20 xl:px-16">
      <div className="flex flex-wrap items-center gap-3">
        <SectionHeading title={title} accent="light" className="mb-0" />
        <span className="rr-chip min-h-0 bg-[rgba(255,255,255,0.06)] px-3 py-2 text-[0.78rem] text-[color:var(--rr-muted)]">
          {chip}
        </span>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {teams.map((team) => (
          <AcademyVisualCard key={team.slug} team={team} />
        ))}
        <AcademyPromoCard promo={promo} />
      </div>
    </section>
  );
}

function AcademyVisualCard({ team }: { team: AcademyTeamCardContent }) {
  return (
    <Link
      href={`/equipos/${team.slug}`}
      className="group overflow-hidden rounded-[0.5rem] border border-[color:var(--rr-border)] bg-[linear-gradient(180deg,rgba(27,46,74,0.98),rgba(23,39,63,0.98))] shadow-[var(--rr-shadow)] transition duration-200 hover:-translate-y-1 hover:border-[color:var(--rr-border-strong)]"
    >
      <div className="relative h-[15.5rem] overflow-hidden border-b border-[color:var(--rr-border)]">
        <ClubLineupVisual figureCount={4} showPitchGlow compact className="h-full" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,20,36,0.18),rgba(10,20,36,0.1)_42%,rgba(12,23,39,0.92)_100%)]" />
      </div>

      <div className="flex min-h-[15rem] flex-col p-5 md:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="rr-kicker text-[color:var(--rr-gold)]">{team.category}</p>
            <h3 className="rr-display mt-3 text-[2.5rem] leading-[0.9] text-white">{team.name}</h3>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-[0.5rem] border border-[color:var(--rr-gold)] bg-[rgba(7,22,41,0.88)] text-[color:var(--rr-gold)]">
            <Shield className="h-4 w-4" strokeWidth={1.9} />
          </span>
        </div>

        <p className="mt-2 text-[0.92rem] uppercase tracking-[0.16em] text-[color:var(--rr-muted)]/80">
          {team.competition}
        </p>
        <p className="mt-5 flex-1 text-[1rem] leading-7 text-[color:var(--rr-muted)]">
          {team.description}
        </p>

        <div className="mt-6 flex items-center justify-between border-t border-[color:var(--rr-border)] pt-5">
          <span className="rr-kicker text-white transition group-hover:text-[color:var(--rr-gold)]">
            {team.ctaLabel}
          </span>
          <ArrowRight className="h-5 w-5 text-white transition group-hover:translate-x-1 group-hover:text-[color:var(--rr-gold)]" />
        </div>
      </div>
    </Link>
  );
}

function AcademyPromoCard({ promo }: { promo: AcademyPromoContent }) {
  return (
    <article className="flex min-h-[17.5rem] flex-col items-center justify-center rounded-[0.5rem] border border-[color:var(--rr-border)] bg-[linear-gradient(180deg,rgba(12,31,58,0.96),rgba(9,24,45,0.98))] px-6 py-8 text-center shadow-[var(--rr-shadow)]">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[color:var(--rr-gold)]/55 bg-[rgba(253,203,88,0.08)] text-[color:var(--rr-gold)]">
        <Gem className="h-6 w-6" strokeWidth={1.8} />
      </span>
      <p className="rr-kicker mt-5 text-[color:var(--rr-gold)]">{promo.eyebrow}</p>
      <h3 className="rr-display mt-4 text-[2.8rem] leading-[0.9] text-white">{promo.title}</h3>
      <p className="mt-4 max-w-[18rem] text-[1rem] leading-7 text-[color:var(--rr-muted)]">
        {promo.description}
      </p>
      <Link
        href={promo.href}
        className="rr-kicker mt-6 inline-flex items-center gap-2 text-[color:var(--rr-gold)] underline decoration-[color:var(--rr-gold)]/45 underline-offset-4 transition hover:text-white"
      >
        <Sparkles className="h-4 w-4" strokeWidth={1.9} />
        {promo.ctaLabel}
      </Link>
    </article>
  );
}

function SectionHeading({
  title,
  accent,
  className,
}: {
  title: string;
  accent: "gold" | "light";
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <span className="h-11 w-1 shrink-0 rounded-full bg-[color:var(--rr-gold)]" />
      <h2
        className={cn(
          "rr-display text-[2.6rem] leading-none md:text-[3.1rem]",
          accent === "gold" ? "text-[color:var(--rr-gold)]" : "text-white",
        )}
      >
        {title}
      </h2>
    </div>
  );
}

function FeaturedVisual() {
  return (
    <div className="relative min-h-[20rem] overflow-hidden border-b border-[color:var(--rr-border)] lg:min-h-[24rem] lg:border-b-0 lg:border-r">
      <ClubLineupVisual figureCount={5} showPitchGlow className="h-full" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,37,67,0.3)_0%,rgba(16,37,67,0)_32%,rgba(16,37,67,0.08)_62%,rgba(16,37,67,0.42)_100%),linear-gradient(180deg,rgba(10,20,36,0.08)_0%,rgba(10,20,36,0)_32%,rgba(10,20,36,0.82)_100%)]" />
    </div>
  );
}

function ClubLineupVisual({
  figureCount,
  className,
  compact = false,
  showPitchGlow = false,
}: {
  figureCount: number;
  className?: string;
  compact?: boolean;
  showPitchGlow?: boolean;
}) {
  const figures = Array.from({ length: figureCount });

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-[radial-gradient(circle_at_top,rgba(146,177,219,0.28),transparent_28%),linear-gradient(180deg,rgba(15,30,50,0.94),rgba(8,18,34,0.98))]",
        className,
      )}
    >
      <div className="absolute inset-0">
        <div className="absolute left-[8%] top-[14%] h-20 w-20 rounded-full bg-white/16 blur-3xl" />
        <div className="absolute right-[10%] top-[12%] h-24 w-24 rounded-full bg-white/16 blur-3xl" />
        <div className="absolute inset-x-[8%] top-[24%] h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)]" />
        <div className="absolute inset-x-[14%] top-[30%] h-[11rem] rounded-t-[100%] border-t border-white/10 opacity-60" />
        <div className="absolute inset-x-[8%] bottom-[18%] h-[16rem] rounded-t-[100%] border-t border-white/8 opacity-45" />
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-28 bg-[linear-gradient(180deg,rgba(24,63,41,0),rgba(18,61,40,0.72))]",
            !showPitchGlow && "opacity-55",
          )}
        />
      </div>

      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex items-end justify-center px-6 pb-0",
          compact ? "gap-3" : "gap-3 md:gap-4",
        )}
      >
        {figures.map((_, index) => {
          const isEdge = index === 0 || index === figures.length - 1;
          const isCenter = index === Math.floor(figures.length / 2);

          return (
            <PlayerFigure
              key={`${figureCount}-${index}`}
              className={cn(
                compact ? "h-[8.5rem] w-12 md:h-40 md:w-[3.25rem]" : "h-40 w-12 md:h-48 md:w-14",
                isCenter &&
                  (compact ? "h-40 w-[3.25rem] md:h-[11.5rem] md:w-14" : "h-52 w-14 md:h-60 md:w-16"),
                !isCenter &&
                  !isEdge &&
                  (compact ? "h-[9.5rem] w-[3.25rem] md:h-44 md:w-14" : "h-48 w-14 md:h-56 md:w-16"),
                isEdge && "opacity-72",
              )}
            />
          );
        })}
      </div>
    </div>
  );
}

function PlayerFigure({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex flex-col items-center justify-end", className)}>
      <span className="absolute top-[10%] h-6 w-6 rounded-full bg-[rgba(194,214,245,0.3)] shadow-[0_0_18px_rgba(194,214,245,0.18)]" />
      <span className="h-[74%] w-full rounded-t-[999px] bg-[linear-gradient(180deg,rgba(44,72,110,0.94),rgba(24,45,74,0.98))] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
      <span className="absolute bottom-[28%] h-1 w-[62%] rounded-full bg-[rgba(253,203,88,0.55)]" />
    </div>
  );
}
