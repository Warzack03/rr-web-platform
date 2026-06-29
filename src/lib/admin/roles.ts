export type AdminRole = "SUPERADMIN" | "MANAGER" | "COACH";

export const adminRoleLabels: Record<AdminRole, string> = {
  SUPERADMIN: "Administrador",
  MANAGER: "Administrador",
  COACH: "Administrador",
};

export const OWNER_ADMIN_ROLE: AdminRole = "SUPERADMIN";

export function isAdminRole(value: string | undefined): value is AdminRole {
  return value === "SUPERADMIN" || value === "MANAGER" || value === "COACH";
}

export function getPreviewRole(value: string | undefined, fallbackRole: AdminRole): AdminRole {
  return isAdminRole(value) ? value : fallbackRole;
}
