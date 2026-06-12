import { AdminStatusBadge } from "@/components/admin/admin-status-badge";

type TeamVisibilityBadgeProps = {
  publicVisible: boolean;
};

export function TeamVisibilityBadge({ publicVisible }: TeamVisibilityBadgeProps) {
  return (
    <AdminStatusBadge
      label={publicVisible ? "Visible web" : "Oculto web"}
      tone={publicVisible ? "gold" : "danger"}
    />
  );
}
