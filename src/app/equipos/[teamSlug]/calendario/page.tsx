import { notFound } from "next/navigation";
import { TeamRoutePlaceholder } from "@/components/public/team-route-placeholder";
import { getPublicAcademyTeamPageContent } from "@/lib/public/team-page-content";

type TeamPlaceholderPageProps = {
  params: Promise<{
    teamSlug: string;
  }>;
};

export default async function TeamCalendarPlaceholderPage({
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
      title="Calendario"
      description="Placeholder minimo. El calendario completo del equipo queda fuera de esta tarea."
    />
  );
}
