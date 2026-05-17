import { notFound } from "next/navigation";
import { TeamRoutePlaceholder } from "@/components/public/team-route-placeholder";
import { getPublicAcademyTeamPageContent } from "@/lib/public/team-page-content";

type TeamPlaceholderPageProps = {
  params: Promise<{
    teamSlug: string;
  }>;
};

export default async function TeamSquadPlaceholderPage({
  params,
}: TeamPlaceholderPageProps) {
  const { teamSlug } = await params;
  const teamSummary = await getPublicAcademyTeamPageContent(teamSlug);

  if (!teamSummary) {
    notFound();
  }

  return (
    <TeamRoutePlaceholder
      eyebrow={teamSummary.name}
      title="Plantilla"
      description="Placeholder minimo. La plantilla completa de equipos de cantera se implementara en una iteracion posterior."
    />
  );
}
