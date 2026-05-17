import { UserRole } from "@prisma/client";
import { CalendarDays, ClipboardCheck, PlayCircle } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { MatchCard } from "@/src/components/shared/match-card";
import { AdminActionCard } from "@/src/components/admin/admin-action-card";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminPanel } from "@/src/components/admin/admin-panel";
import { getScopedMatchRows } from "@/src/lib/admin-demo";
import { publicMatches } from "@/src/lib/demo-data";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminMatchesPage() {
  const user = await requireAdminSectionAccess("matches");
  const rows = getScopedMatchRows(user.role);
  const visibleMatches =
    user.role === UserRole.COACH
      ? publicMatches.filter((match) => match.teamSlug === "raimon-b")
      : publicMatches;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge="Partidos"
        title="Partidos y resultados"
        description="Panel operativo para editar estado, resultado y video externo sin perder contexto deportivo."
        action={<CTAButton href="/admin/partidos">Nueva jornada</CTAButton>}
      />

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <AdminPanel title={user.role === UserRole.COACH ? "Proximo partido" : "Partidos destacados"}>
          <div className="space-y-4">
            {visibleMatches.slice(0, 2).map((match, index) => (
              <MatchCard key={match.id} match={match} variant={index === 0 ? "featured" : "default"} />
            ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Acciones rapidas">
          <div className="grid gap-3">
            <AdminActionCard
              href="/admin/partidos"
              title="Actualizar proximo partido"
              description="Fecha, hora, sede y estado competitivo."
            />
            <AdminActionCard
              href="/admin/partidos"
              title="Cargar resultado"
              description="Marcador, estado jugado y video externo si existe."
            />
            <AdminActionCard
              href="/admin/estadisticas"
              title="Registrar rendimiento"
              description="Goles, asistencias y notas de partido."
            />
          </div>
        </AdminPanel>
      </div>

      <AdminPanel title="Listado de partidos">
        <AdminDataTable
          columns={[
            { key: "team", label: "Equipo" },
            { key: "opponent", label: "Rival" },
            { key: "competition", label: "Competicion" },
            { key: "date", label: "Fecha" },
            { key: "status", label: "Estado" },
            { key: "score", label: "Resultado" },
            { key: "video", label: "Video" },
          ]}
          rows={rows}
        />
      </AdminPanel>

      <div className="grid gap-6 lg:grid-cols-3">
        <AdminPanel title="Pendientes">
          <div className="space-y-3 text-sm text-[var(--rr-text-muted)]">
            {rows
              .filter((row) => row.status === "Pendiente" || row.status === "Aplazado")
              .slice(0, 3)
              .map((row) => (
                <div key={row.id} className="rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] p-4">
                  <p className="font-semibold uppercase tracking-[0.14em] text-white">
                    {row.team} vs {row.opponent}
                  </p>
                  <p className="mt-2">{row.date}</p>
                </div>
              ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Jugados">
          <div className="space-y-3 text-sm text-[var(--rr-text-muted)]">
            {rows
              .filter((row) => row.status === "Jugado")
              .slice(0, 3)
              .map((row) => (
                <div key={row.id} className="rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] p-4">
                  <p className="font-semibold uppercase tracking-[0.14em] text-white">
                    {row.team} vs {row.opponent}
                  </p>
                  <p className="mt-2">{row.score}</p>
                </div>
              ))}
          </div>
        </AdminPanel>

        <AdminPanel title="Estado del modulo">
          <div className="grid gap-3">
            {[
              { label: "Calendario", icon: CalendarDays },
              { label: "Resultado", icon: ClipboardCheck },
              { label: "Video", icon: PlayCircle },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] px-4 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white"
                >
                  <Icon className="h-4 w-4 text-[var(--rr-accent)]" />
                  {item.label} preparado con mocks
                </div>
              );
            })}
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
