import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import type { StandingPublicationStatus } from "@/lib/admin/standings-management";

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
    label: "Sin guardar",
    tone: "slate",
  },
  published: {
    label: "Guardada",
    tone: "success",
  },
  review: {
    label: "Revisar",
    tone: "gold",
  },
};

export function StandingStatusBadge({
  status,
}: StandingStatusBadgeProps) {
  const config = statusConfig[status];

  return <AdminStatusBadge label={config.label} tone={config.tone} />;
}
