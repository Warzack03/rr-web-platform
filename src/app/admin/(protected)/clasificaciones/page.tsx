import { UserRole } from "@prisma/client";
import { PencilLine, Trophy } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { StandingsTable } from "@/src/components/public/standings-table";
import { AdminActionCard } from "@/src/components/admin/admin-action-card";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminPanel } from "@/src/components/admin/admin-panel";
import { getScopedStandings } from "@/src/lib/admin-demo";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminStandingsPage() {
  const user = await requireAdminSectionAccess("standings");
  const standings = getScopedStandings(user.role);
  const primaryStanding = standings[0];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge="Clasificaciones"
        title="Clasificaciones manuales"
        description="Vista preparada para revisar la tabla por equipo y validar rapidamente la posicion propia."
        action={<CTAButton href="/admin/clasificaciones">Guardar cambios</CTAButton>}
      />

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <AdminPanel title="Selector de contexto">
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            {[
              ["Equipo", primaryStanding?.teamName ?? "Sin equipo"],
              ["Temporada", primaryStanding?.season ?? "2026/27"],
              ["Competicion", primaryStanding?.competition ?? "Sin competicion"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] px-4 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-text-soft)]">
                  {label}
                </p>
                <p className="mt-2 font-display text-3xl text-white">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3">
            <AdminActionCard
              href="/admin/partidos"
              title="Cruzar con resultados"
              description="Comprobar jornadas jugadas antes de actualizar la tabla."
            />
            {user.role === UserRole.COACH ? (
              <AdminActionCard
                href="/admin/estadisticas"
                title="Registrar contexto"
                description="Completar goles y asistencias del equipo asignado."
              />
            ) : null}
          </div>
        </AdminPanel>

        <AdminPanel title="Estado del modulo">
          <div className="grid gap-3">
            {[
              "Posicion del equipo propio destacada",
              "Tabla lista para futura edicion inline",
              "Bloque preparado para cambiar de equipo y temporada",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] px-4 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white"
              >
                <Trophy className="h-4 w-4 text-[var(--rr-accent)]" />
                {item}
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>

      <div className="grid gap-6">
        {standings.map((standing) => (
          <AdminPanel key={standing.teamSlug} title={standing.teamName}>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                  {standing.competition}
                </p>
                <p className="text-sm text-[var(--rr-text-soft)]">{standing.season}</p>
              </div>
              <CTAButton href="/admin/clasificaciones" size="sm" variant="ghost">
                <PencilLine className="h-4 w-4" />
                Editar tabla
              </CTAButton>
            </div>
            <StandingsTable rows={standing.rows} />
          </AdminPanel>
        ))}
      </div>
    </div>
  );
}
