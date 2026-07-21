import { UserRole } from "@prisma/client";

export type AdminRole = "ADMIN";

export const adminRoleLabels: Record<string, string> = {
  ADMIN: "Administrador",
};

export const OWNER_ADMIN_ROLE: AdminRole = "ADMIN";

export function toAdminRole(_role: UserRole): AdminRole {
  void _role;

  return OWNER_ADMIN_ROLE;
}
