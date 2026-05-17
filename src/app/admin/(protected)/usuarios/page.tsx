import { ShieldPlus } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminPanel } from "@/src/components/admin/admin-panel";
import { getScopedUserRows } from "@/src/lib/admin-demo";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminUsersPage() {
  const user = await requireAdminSectionAccess("users");
  const rows = getScopedUserRows(user.role);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge="Usuarios"
        title="Usuarios y permisos"
        description="Gestor de cuentas internas, roles y visibilidad de entrenadores asociados a equipos."
        action={
          <CTAButton href="/admin/usuarios">
            <ShieldPlus className="h-4 w-4" />
            Nuevo usuario
          </CTAButton>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminPanel title="Cuentas internas">
          <AdminDataTable
            columns={[
              { key: "displayName", label: "Usuario" },
              { key: "email", label: "Email" },
              { key: "role", label: "Rol" },
              { key: "access", label: "Acceso" },
              { key: "teams", label: "Equipos" },
              { key: "lastAccess", label: "Ultimo acceso" },
            ]}
            rows={rows}
          />
        </AdminPanel>

        <AdminPanel title="Politica actual">
          <div className="space-y-3">
            {[
              "Superadmin gestiona usuarios, roles e importaciones",
              "Manager no puede crear usuarios ni lanzar imports",
              "Entrenador solo actua sobre equipos asignados",
              "Puede existir coach visible sin cuenta interna",
            ].map((rule) => (
              <div
                key={rule}
                className="rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] px-4 py-4 text-sm leading-6 text-[var(--rr-text-muted)]"
              >
                {rule}
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
