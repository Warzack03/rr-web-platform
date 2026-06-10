import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import type { StandingPublicationStatus } from "@/lib/admin/standings-management-mocks";

type StandingStatusBadgeProps = {
  status: StandingPublicationStatus;
};

const statusConfig: Record<
  StandingPublicationStatus,
  {
    label: string;
    tone: "gold" | "blue" | "slate" | "danger" | "success";
  }
> = {
  draft: {
    label: "Borrador",
    tone: "slate",
  },
  published: {
    label: "Publicada",
    tone: "success",
  },
  review: {
    label: "Pendiente de revision",
    tone: "gold",
  },
};

export function StandingStatusBadge({
  status,
}: StandingStatusBadgeProps) {
  const config = statusConfig[status];

  return <AdminStatusBadge label={config.label} tone={config.tone} />;
}
