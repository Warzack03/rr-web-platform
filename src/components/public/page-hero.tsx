import { CalendarDays, UserRound, Users } from "lucide-react";
import { CTAButton } from "@/components/public/cta-button";

type PageHeroProps = {
  competition: string;
  season: string;
  title: string;
  coach: string;
  backgroundImageUrl?: string;
  backgroundPosition?: string;
};

export function PageHero({
  competition,
  season,
  title,
  coach,
  backgroundImageUrl,
  backgroundPosition = "center center",
}: PageHeroProps) {
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

      <div className="relative mx-auto flex min-h-[34rem] w-full max-w-[1280px] items-end px-5 pb-14 pt-24 md:px-8 md:pb-16 lg:min-h-[39rem] xl:px-16">
        <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[38rem]">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rr-chip text-[color:var(--rr-gold)]">{competition}</span>
              <span className="rr-chip text-[color:var(--rr-muted)]">{season}</span>
            </div>
            <h1 className="rr-display text-[4rem] leading-[0.9] text-white sm:text-[5rem] lg:text-[6.5rem]">
              {title}
            </h1>
            <div className="mt-4 flex items-center gap-3 text-[1.35rem] text-[color:var(--rr-text)]/94">
              <UserRound className="h-5 w-5 text-[color:var(--rr-gold)]" strokeWidth={1.9} />
              <span>
                Entrenador: <span className="text-[color:var(--rr-muted)]">{coach}</span>
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <CTAButton href="/primer-equipo/plantilla">
              <Users className="h-4 w-4" strokeWidth={1.9} />
              Ver plantilla
            </CTAButton>
            <CTAButton href="/primer-equipo/calendario" variant="secondary">
              <CalendarDays className="h-4 w-4" strokeWidth={1.9} />
              Calendario
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
