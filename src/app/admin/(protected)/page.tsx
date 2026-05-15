import { UserRole } from "@prisma/client";
import { CTAButton } from "@/src/components/shared/cta-button";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminPanel } from "@/src/components/admin/admin-panel";
import { AdminSummaryCard } from "@/src/components/admin/admin-summary-card";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import { getDashboardMock, publicMatches, publicNews } from "@/src/lib/demo-data";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminDashboardPage() {
  const user = await requireAdminSectionAccess("dashboard");
  const dashboard = getDashboardMock(user.role);

  const matchRows =
    user.role === UserRole.COACH
      ? publicMatches
          .filter((match) => match.teamSlug === "raimon-b")
          .slice(0, 3)
          .map((match) => ({
            id: match.id,
            fecha: match.dateLabel,
            encuentro: `${match.teamName} vs ${match.opponentName}`,
            competicion: match.competition,
            estado: match.status,
          }))
      : publicMatches.slice(0, 4).map((match) => ({
          id: match.id,
          fecha: match.dateLabel,
          encuentro: `${match.teamName} vs ${match.opponentName}`,
          competicion: match.competition,
          estado: match.status,
        }));

  const importRows = [
    { id: "i1", archivo: "Players_U18_04.csv", origen: "rr-management", estado: "Validado", volumen: "120 registros" },
    { id: "i2", archivo: "Match_Stats_W12.json", origen: "scouting", estado: "Aplicado", volumen: "45 metricas" },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge={user.role === UserRole.COACH ? "Coach portal" : "Dashboard"}
        title={dashboard.title}
        description={dashboard.subtitle}
        action={
          <CTAButton href={user.role === UserRole.COACH ? "/admin/partidos" : "/admin/equipos"}>
            {user.role === UserRole.COACH ? "Generar informe" : "Reporte global"}
          </CTAButton>
        }
      />

      <div className={`grid gap-4 ${dashboard.metrics.length === 3 ? "xl:grid-cols-3" : "xl:grid-cols-4"}`}>
        {dashboard.metrics.map((metric, index) => (
          <AdminSummaryCard
            key={metric.label}
            title={metric.label}
            value={metric.value}
            helper={metric.helper}
            accent={index === dashboard.metrics.length - 1 ? "light" : "gold"}
          />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <AdminPanel title={user.role === UserRole.COACH ? "Proximos partidos y resultados" : "Proximos partidos"}>
          <AdminDataTable
            columns={[
              { key: "fecha", label: "Fecha/Hora" },
              { key: "encuentro", label: "Encuentro" },
              { key: "competicion", label: "Competicion" },
              { key: "estado", label: "Estado" },
            ]}
            rows={matchRows}
          />
        </AdminPanel>

        <AdminPanel title={user.role === UserRole.COACH ? "Accesos rapidos" : "Noticias"}>
          <div className="space-y-4">
            {(user.role === UserRole.COACH ? dashboard.quickActions : publicNews.slice(0, 3).map((item) => item.title)).map(
              (item) => (
                <div
                  key={item}
                  className="rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] px-4 py-4 text-base leading-7 text-[var(--rr-text-muted)]"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </AdminPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <AdminPanel title={user.role === UserRole.COACH ? "Resumen del equipo" : "Ultimas importaciones"}>
          {user.role === UserRole.COACH ? (
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Equipo", "Raimon B"],
                ["Posicion", "4o lugar"],
                ["Puntos", "28 pts"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] px-4 py-5">
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">{label}</p>
                  <p className="mt-2 font-display text-4xl text-white">{value}</p>
                </div>
              ))}
            </div>
          ) : (
            <AdminDataTable
              columns={[
                { key: "archivo", label: "Archivo" },
                { key: "origen", label: "Origen" },
                { key: "estado", label: "Estado" },
                { key: "volumen", label: "Volumen" },
              ]}
              rows={importRows}
            />
          )}
        </AdminPanel>

        <AdminPanel title={user.role === UserRole.COACH ? "Proxima accion" : "Accesos rapidos"}>
          <div className="grid gap-4 sm:grid-cols-2">
            {dashboard.quickActions.map((item) => (
              <div
                key={item}
                className="rounded-[18px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.5)] px-4 py-5 text-base font-semibold uppercase tracking-[0.14em] text-white"
              >
                {item}
              </div>
            ))}
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
