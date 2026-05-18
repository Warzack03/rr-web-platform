import type { FirstTeamSquadPlayer } from "@/lib/public/first-team-squad-content";

type PlayerIdentityBlockProps = {
  player: FirstTeamSquadPlayer;
};

export function PlayerIdentityBlock({ player }: PlayerIdentityBlockProps) {
  return (
    <div className="relative z-10 flex max-w-[30rem] flex-col gap-6">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <span className="rr-display inline-flex min-w-[3.25rem] items-center justify-center border border-[color:var(--rr-gold)] bg-[rgba(253,203,88,0.08)] px-3 py-2 text-[2rem] leading-none text-[color:var(--rr-gold)]">
          {player.number}
        </span>
        <span className="hidden h-8 w-px bg-white/16 sm:block" />
        <span className="rr-kicker text-[0.98rem] text-white">{player.position}</span>
        <span className="hidden h-5 w-px bg-white/12 sm:block" />
        <span className="rr-kicker text-[0.98rem] text-[color:var(--rr-muted)]">
          {player.countryFlag} {player.country}
        </span>
      </div>

      <div>
        <h1 className="rr-display text-[4.2rem] leading-[0.88] text-white sm:text-[5.5rem] xl:text-[6.3rem]">
          <span className="block">{player.firstName}</span>
          <span className="block text-[color:var(--rr-gold)]">{player.lastName}</span>
        </h1>
      </div>

      <div className="flex flex-wrap gap-3">
        <span className="rr-kicker inline-flex items-center border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-[0.78rem] text-[color:var(--rr-muted)]">
          {player.teamLabel}
        </span>
        <span className="rr-kicker inline-flex items-center border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-[0.78rem] text-[color:var(--rr-muted)]">
          {player.seasonLabel}
        </span>
      </div>
    </div>
  );
}
