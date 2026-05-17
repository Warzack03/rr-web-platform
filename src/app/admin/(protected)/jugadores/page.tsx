import { UserRole } from "@prisma/client";
import { Search, UserRoundPlus } from "lucide-react";
import { CTAButton } from "@/src/components/shared/cta-button";
import { PlayerRosterCard } from "@/src/components/public/player-roster-card";
import { AdminDataTable } from "@/src/components/admin/admin-data-table";
import { AdminPageHeader } from "@/src/components/admin/admin-page-header";
import { AdminPanel } from "@/src/components/admin/admin-panel";
import { getScopedPlayerRows } from "@/src/lib/admin-demo";
import { getTeamBySlug, publicPlayers } from "@/src/lib/demo-data";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminPlayersPage() {
  const user = await requireAdminSectionAccess("players");
  const rows = getScopedPlayerRows(user.role);
  const visiblePlayers =
    user.role === UserRole.COACH
      ? publicPlayers.filter((player) => player.teamSlug === "raimon-b")
      : publicPlayers;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        badge="Jugadores"
        title="Gestion de jugadores"
        description="Busqueda, filtros basicos y lectura rapida de rendimiento por equipo."
        action={
          user.role === UserRole.COACH ? null : (
            <CTAButton href="/admin/jugadores">
              <UserRoundPlus className="h-4 w-4" />
              Nuevo jugador
            </CTAButton>
          )
        }
      />

      <AdminPanel>
        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr_1fr]">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-text-soft)]">
              Busqueda
            </p>
            <div className="flex items-center gap-3 rounded-[16px] border border-[var(--rr-border)] bg-[rgba(30,32,32,0.64)] px-4 py-4 text-[var(--rr-text-soft)]">
              <Search className="h-4 w-4" />
              <span>Nombre, dorsal o equipo</span>
            </div>
          </div>
          {[
            ["Equipo", user.role === UserRole.COACH ? "Raimon B" : "Todos"],
            ["Posicion", "Todas"],
          ].map(([label, value]) => (
            <div key={label} className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-text-soft)]">
                {label}
              </p>
              <div className="rounded-[16px] border border-[var(--rr-border)] bg-[rgba(30,32,32,0.64)] px-4 py-4 text-base text-white">
                {value}
              </div>
            </div>
          ))}
        </div>
      </AdminPanel>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <AdminPanel title="Listado base">
          <AdminDataTable
            columns={[
              { key: "player", label: "Jugador" },
              { key: "team", label: "Equipo" },
              { key: "position", label: "Posicion" },
              { key: "dorsal", label: "Dorsal" },
              { key: "goles", label: "Goles" },
              { key: "asistencias", label: "Asist." },
              { key: "participaciones", label: "Gol+" },
              { key: "estado", label: "Estado" },
            ]}
            rows={rows}
          />
        </AdminPanel>

        <AdminPanel title="Jugadores destacados">
          <div className="space-y-4">
            {visiblePlayers.slice(0, 2).map((player) => (
              <PlayerRosterCard key={player.slug} player={player} premium={player.premium} />
            ))}
          </div>
        </AdminPanel>
      </div>

      <AdminPanel title="Bloques de plantilla">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {["Delanteros", "Centrocampistas", "Defensas", "Porteros"].map((group) => {
            const items = visiblePlayers.filter((player) =>
              group === "Porteros"
                ? player.position === "Portero"
                : group === "Defensas"
                  ? player.position === "Defensa"
                  : group === "Centrocampistas"
                    ? player.position === "Centrocampista" || player.position === "Mediapunta"
                    : player.position === "Delantero" || player.position === "Extremo",
            );

            return (
              <div
                key={group}
                className="rounded-[20px] border border-[var(--rr-border)] bg-[rgba(8,20,38,0.52)] p-4"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--rr-accent)]">
                  {group}
                </p>
                <p className="mt-3 font-display text-5xl text-white">{items.length}</p>
                <p className="mt-2 text-sm text-[var(--rr-text-muted)]">
                  {items
                    .slice(0, 2)
                    .map((player) => `${player.name} · ${getTeamBySlug(player.teamSlug)?.name ?? player.teamSlug}`)
                    .join(" / ") || "Sin registros"}
                </p>
              </div>
            );
          })}
        </div>
      </AdminPanel>
    </div>
  );
}
