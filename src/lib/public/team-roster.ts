import type {
  PublicPlayerGroup,
  PublicRosterPlayerCard,
  PublicTeamType,
} from "@/lib/contracts/public";
import type { TeamSectionNavLink } from "@/lib/public/team-section-links";
import { getTeamSectionLinks } from "@/lib/public/team-section-links";

export type PublicRosterFieldGroup = {
  key: PublicPlayerGroup;
  title: string;
  players: PublicRosterPlayerCard[];
};

export const publicRosterFieldGroupLabels: Record<PublicPlayerGroup, string> = {
  defensas: "Defensas",
  mediocentros: "Mediocentros",
  banda: "Bandas",
  delanteros: "Delanteros",
};

export function groupPublicRosterFieldPlayers(
  players: PublicRosterPlayerCard[],
): PublicRosterFieldGroup[] {
  return (Object.keys(publicRosterFieldGroupLabels) as PublicPlayerGroup[])
    .map((key) => ({
      key,
      title: publicRosterFieldGroupLabels[key],
      players: players.filter((player) => player.group === key),
    }))
    .filter((group) => group.players.length > 0);
}

export function getPublicRosterNavLinks(input: {
  teamType: PublicTeamType;
  teamSlug: string;
}): TeamSectionNavLink[] {
  return input.teamType === "first-team"
    ? getTeamSectionLinks({ teamType: "first-team" })
    : getTeamSectionLinks({ teamType: "academy", teamSlug: input.teamSlug });
}
