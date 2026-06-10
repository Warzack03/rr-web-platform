import { AdminStatusBadge } from "@/components/admin/admin-status-badge";

type TeamVisibilityBadgeProps = {
  publicVisible: boolean;
};

export function TeamVisibilityBadge({ publicVisible }: TeamVisibilityBadgeProps) {
  return (
    <AdminStatusBadge
      label={publicVisible ? "Publico" : "Privado"}
      tone={publicVisible ? "gold" : "slate"}
    />
  );
}
