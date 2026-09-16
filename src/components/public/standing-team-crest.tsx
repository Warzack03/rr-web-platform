import { TeamCrest } from "@/components/public/team-crest";

type StandingTeamCrestProps = {
  teamName: string;
  logoUrl?: string;
  logoAlt?: string;
  isClub?: boolean;
  className?: string;
  imageClassName?: string;
  initialsClassName?: string;
};

export function StandingTeamCrest({
  teamName,
  logoUrl,
  logoAlt,
  isClub,
  className,
  imageClassName,
  initialsClassName,
}: StandingTeamCrestProps) {
  return (
    <TeamCrest
      name={teamName}
      logoUrl={logoUrl}
      logoAlt={logoAlt}
      isClub={isClub}
      className={className}
      imageClassName={imageClassName}
      initialsClassName={initialsClassName ?? "text-[1rem]"}
    />
  );
}
