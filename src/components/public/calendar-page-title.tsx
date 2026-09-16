import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TeamCrest } from "@/components/public/team-crest";

type CalendarPageTitleProps = {
  title: string;
  subtitle: string;
  teamName: string;
  teamLogoUrl?: string;
  teamLogoAlt?: string;
  backHref?: string;
  backLabel?: string;
};

export function CalendarPageTitle({
  title,
  subtitle,
  teamName,
  teamLogoUrl,
  teamLogoAlt,
  backHref,
  backLabel,
}: CalendarPageTitleProps) {
  return (
    <header className="max-w-[44rem]">
      {backHref && backLabel ? (
        <Link
          href={backHref}
          className="rr-kicker inline-flex items-center gap-2 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-[color:var(--rr-gold)]"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.9} />
          <span>{backLabel}</span>
        </Link>
      ) : null}
      <div className="flex items-center gap-4">
        <TeamCrest
          name={teamName}
          logoUrl={teamLogoUrl}
          logoAlt={teamLogoAlt}
          isClub
          className="h-16 w-16 sm:h-20 sm:w-20"
          initialsClassName="text-[1.8rem] sm:text-[2.2rem]"
        />
        <h1 className="rr-display text-[3.5rem] leading-[0.9] text-white sm:text-[4.5rem] lg:text-[5.4rem]">
          {title}
        </h1>
      </div>
      <p className="mt-4 text-[1.15rem] text-[color:var(--rr-muted)] md:text-[1.3rem]">
        {subtitle}
      </p>
      <div className="rr-bolt-divider mt-7 max-w-[20rem]" />
    </header>
  );
}
