import { TeamCrest } from "@/components/public/team-crest";

type SquadPageTitleProps = {
  title: string;
  teamName: string;
  teamLogoUrl?: string;
  teamLogoAlt?: string;
};

export function SquadPageTitle({ title, teamName, teamLogoUrl, teamLogoAlt }: SquadPageTitleProps) {
  return (
    <header className="mx-auto max-w-[64rem] text-center">
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <TeamCrest
          name={teamName}
          logoUrl={teamLogoUrl}
          logoAlt={teamLogoAlt}
          isClub
          className="h-16 w-16 sm:h-20 sm:w-20"
          initialsClassName="text-[1.8rem] sm:text-[2.2rem]"
        />
        <h1 className="rr-display text-[3.8rem] leading-[0.9] text-[color:var(--rr-gold)] sm:text-[5.4rem] lg:text-[7rem]">
          {title}
        </h1>
      </div>
      <div className="rr-bolt-divider mt-8" />
    </header>
  );
}
