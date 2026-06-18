import type { LucideIcon } from "lucide-react";
import { BarChart3, CalendarDays, ChartNoAxesColumn, UserRound, Users } from "lucide-react";
import { CTAButton } from "@/components/public/cta-button";

type HeroChip = {
  label: string;
  tone?: "accent" | "muted";
};

type HeroAction = {
  href: string;
  label: string;
  icon: LucideIcon;
  variant?: "primary" | "secondary";
};

type PageHeroProps = {
  chips: HeroChip[];
  title: string;
  coaches: string[];
  actions: HeroAction[];
  backgroundImageUrl?: string;
  backgroundPosition?: string;
  variant?: "first-team" | "academy";
};

export function PageHero({
  chips,
  title,
  coaches,
  actions,
  backgroundImageUrl,
  backgroundPosition = "center center",
  variant = "first-team",
}: PageHeroProps) {
  const coachLabel = coaches.length > 1 ? "Entrenadores" : "Entrenador";
  const hasFourActions = actions.length >= 4;
  const titleClassName =
    variant === "academy"
      ? "text-[3.8rem] leading-[0.92] sm:text-[4.8rem] lg:text-[5.7rem]"
      : "text-[4rem] leading-[0.9] sm:text-[5rem] lg:text-[6.5rem]";
  const heightClassName = variant === "academy" ? "lg:min-h-[34rem]" : "lg:min-h-[39rem]";

  return (
    <section className="relative isolate overflow-hidden border-b border-[color:var(--rr-border)] bg-[linear-gradient(180deg,#102746_0%,#0a1730_100%)]">
      <div className="absolute inset-0 opacity-95">
        {backgroundImageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-42"
            style={{
              backgroundImage: `url(${backgroundImageUrl})`,
              backgroundPosition,
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(197,228,255,0.42),transparent_28%),radial-gradient(circle_at_top_right,rgba(197,228,255,0.42),transparent_28%),linear-gradient(180deg,rgba(8,20,38,0.25),rgba(7,22,41,0.94))]" />
        <div className="absolute left-[-18%] top-[-38%] h-[24rem] w-[68%] rounded-[100%] border border-white/10 opacity-45 blur-[1px] md:h-[34rem]" />
        <div className="absolute right-[-18%] top-[-38%] h-[24rem] w-[68%] rounded-[100%] border border-white/10 opacity-45 blur-[1px] md:h-[34rem]" />
        <div className="absolute left-[13%] top-[18%] h-28 w-28 rounded-full bg-white/50 blur-[72px] md:h-40 md:w-40" />
        <div className="absolute right-[13%] top-[18%] h-28 w-28 rounded-full bg-white/50 blur-[72px] md:h-40 md:w-40" />
        <div className="absolute left-[18%] top-[40%] h-2 w-[16%] rounded-full bg-white/45 blur-sm" />
        <div className="absolute right-[18%] top-[40%] h-2 w-[16%] rounded-full bg-white/45 blur-sm" />
        <div className="absolute inset-x-[4%] bottom-[18%] h-[17rem] rounded-t-[100%] border-t border-white/8 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06),transparent_62%)] opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,22,41,0.12)_0%,rgba(7,22,41,0.22)_52%,rgba(7,22,41,0.92)_100%)]" />
      </div>

      <div
        className={`relative mx-auto flex min-h-[32rem] w-full max-w-[1280px] items-end px-5 pb-14 pt-24 md:px-8 md:pb-16 ${heightClassName} xl:px-16`}
      >
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[38rem]">
            <div className="mb-5 flex flex-wrap gap-2">
              {chips.map((chip, index) => (
                <span
                  key={`${chip.label}-${index}`}
                  className={`rr-chip ${chip.tone === "accent" ? "text-[color:var(--rr-gold)]" : "text-[color:var(--rr-muted)]"}`}
                >
                  {chip.label}
                </span>
              ))}
            </div>
            <h1 className={`rr-display text-white ${titleClassName}`}>{title}</h1>
            <div className="mt-4 flex items-center gap-3 text-[1.35rem] text-[color:var(--rr-text)]/94">
              <UserRound className="h-5 w-5 text-[color:var(--rr-gold)]" strokeWidth={1.9} />
              <span>
                {coachLabel}: <span className="text-[color:var(--rr-muted)]">{coaches.join(", ")}</span>
              </span>
            </div>
          </div>

          <div
            className={
              hasFourActions
                ? "grid w-full gap-3 sm:grid-cols-2 lg:max-w-[31rem] xl:flex xl:w-auto xl:max-w-none xl:flex-row xl:flex-nowrap xl:justify-end"
                : "flex w-full flex-col gap-3 sm:flex-row lg:w-auto lg:flex-wrap lg:justify-end"
            }
          >
            {actions.map((action) => {
              const Icon = action.icon;

              return (
                <CTAButton
                  key={action.href}
                  href={action.href}
                  variant={action.variant ?? "primary"}
                  className={hasFourActions ? "w-full xl:w-auto" : undefined}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.9} />
                  {action.label}
                </CTAButton>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export const PageHeroIcons = {
  squad: Users,
  calendar: CalendarDays,
  standing: ChartNoAxesColumn,
  statistics: BarChart3,
};
