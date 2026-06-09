export type AdminRole = "SUPERADMIN" | "MANAGER" | "COACH";

export const adminRoleLabels: Record<AdminRole, string> = {
  SUPERADMIN: "Superadmin",
  MANAGER: "Manager",
  COACH: "Entrenador",
};

export const adminPreviewRoleOptions: AdminRole[] = ["SUPERADMIN", "MANAGER", "COACH"];

export function isAdminRole(value: string | undefined): value is AdminRole {
  return value === "SUPERADMIN" || value === "MANAGER" || value === "COACH";
}

export function getPreviewRole(value: string | undefined, fallbackRole: AdminRole): AdminRole {
  return isAdminRole(value) ? value : fallbackRole;
}
