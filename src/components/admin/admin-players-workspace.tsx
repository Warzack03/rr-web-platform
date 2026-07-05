"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Camera,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Search,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { PremiumPlayerCard } from "@/components/public/premium-player-card";
import {
  adminPlayerPositionOptions,
  adminMockPlayers,
  adminMockTeams,
  type AdminPlayer,
} from "@/lib/admin/mock-data";
import type {
  DominantFoot,
  PublicPlayerType,
  PublicTeamType,
} from "@/lib/public/player-profile-content";
import { cn } from "@/lib/utils";

type PlayerVisibilityFilter = "all" | "visible" | "hidden";
type PlayerPositionFilter = "all" | AdminPlayer["position"];

type EditableAdminPlayer = AdminPlayer & {
  publicName: string;
  slug: string;
  visible: boolean;
  active: boolean;
  photoUrl?: string;
  cardVariant: PublicTeamType;
};

const countryOptions = [
  { value: "ES", label: "Espana" },
  { value: "PT", label: "Portugal" },
  { value: "AR", label: "Argentina" },
  { value: "BR", label: "Brasil" },
  { value: "MA", label: "Marruecos" },
];

const photoOptions = [
  { value: "", label: "Sin foto" },
  { value: "/images/mock/first-team/teo-ibarra.svg", label: "Retrato azul" },
  { value: "/images/mock/first-team/noah-carden.svg", label: "Retrato campo" },
  { value: "/images/mock/first-team/leo-serrano.svg", label: "Retrato dorado" },
  { value: "/images/mock/first-team/dario-kestrel.svg", label: "Retrato oscuro" },
];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function createEditablePlayers(): EditableAdminPlayer[] {
  return adminMockPlayers.map((player, index) => {
    const team = adminMockTeams.find((candidate) => candidate.slug === player.teamSlug);
    const isFirstTeam = Boolean(team?.firstTeam);

    return {
      ...player,
      publicName: player.name,
      slug: slugify(player.name),
      visible: index !== adminMockPlayers.length - 1,
      active: true,
      photoUrl: index < 4 ? photoOptions[index + 1]?.value : undefined,
      cardVariant: isFirstTeam ? "first-team" : "academy",
    };
  });
}

function mapFootToDominantFoot(foot: EditableAdminPlayer["foot"]): DominantFoot {
  if (foot === "Izquierda") {
    return "left";
  }

  if (foot === "Ambas") {
    return "both";
  }

  return "right";
}

function mapPositionLabel(position: EditableAdminPlayer["position"]) {
  return (
    adminPlayerPositionOptions.find((option) => option.value === position)?.label ??
    position
  );
}

function getTeamLabel(teamSlug: string) {
  return adminMockTeams.find((team) => team.slug === teamSlug)?.name ?? teamSlug;
}

function getPlayerType(player: EditableAdminPlayer): PublicPlayerType {
  return player.position === "POR" ? "goalkeeper" : "field";
}

function getGoalParticipation(player: EditableAdminPlayer) {
  return player.goals + player.assists;
}

function getCardReadiness(player: EditableAdminPlayer) {
  const checks = [
    { label: "Nombre", ready: player.publicName.trim().length > 0 },
    { label: "Dorsal", ready: player.number > 0 },
    { label: "Posicion", ready: Boolean(player.position) },
    { label: "Pais", ready: Boolean(player.country) },
    { label: "Pie", ready: Boolean(player.foot) },
    { label: "Foto", ready: Boolean(player.photoUrl) },
  ];

  return {
    checks,
    readyCount: checks.filter((check) => check.ready).length,
  };
}

function inputClassName(className?: string) {
  return cn(
    "min-h-11 rounded-[8px] border border-white/10 bg-[rgba(7,19,34,0.92)] px-3 text-[0.94rem] text-white outline-none transition focus:border-[rgba(253,203,88,0.45)]",
    className,
  );
}

function labelClassName() {
  return "rr-kicker text-[0.7rem] text-[color:var(--rr-muted)]";
}

type AdminPlayersWorkspaceInnerProps = {
  initialPlayerId?: string;
  initialTeamFilter: string;
};

function AdminPlayersWorkspaceInner({
  initialPlayerId,
  initialTeamFilter,
}: AdminPlayersWorkspaceInnerProps) {
  const [players, setPlayers] = useState<EditableAdminPlayer[]>(() =>
    createEditablePlayers(),
  );
  const [savedPlayers, setSavedPlayers] = useState<EditableAdminPlayer[]>(() =>
    createEditablePlayers(),
  );
  const [selectedPlayerId, setSelectedPlayerId] = useState(initialPlayerId ?? players[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState(initialTeamFilter);
  const [positionFilter, setPositionFilter] = useState<PlayerPositionFilter>("all");
  const [visibilityFilter, setVisibilityFilter] =
    useState<PlayerVisibilityFilter>("all");
  const [feedback, setFeedback] = useState<string | null>(null);
  const hasUnsavedChanges = JSON.stringify(players) !== JSON.stringify(savedPlayers);

  const selectedPlayer =
    players.find((player) => player.id === selectedPlayerId) ?? players[0];

  const filteredPlayers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return players.filter((player) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        player.publicName.toLowerCase().includes(normalizedSearch) ||
        player.slug.toLowerCase().includes(normalizedSearch);
      const matchesTeam = teamFilter === "all" || player.teamSlug === teamFilter;
      const matchesPosition =
        positionFilter === "all" || player.position === positionFilter;
      const matchesVisibility =
        visibilityFilter === "all" ||
        (visibilityFilter === "visible" ? player.visible : !player.visible);

      return matchesSearch && matchesTeam && matchesPosition && matchesVisibility;
    });
  }, [players, positionFilter, search, teamFilter, visibilityFilter]);

  function updateSelectedPlayer(
    updater: (player: EditableAdminPlayer) => EditableAdminPlayer,
  ) {
    if (!selectedPlayer) {
      return;
    }

    setPlayers((currentPlayers) =>
      currentPlayers.map((player) =>
        player.id === selectedPlayer.id ? updater(player) : player,
      ),
    );
  }

  function handleSave() {
    if (!hasUnsavedChanges) {
      return;
    }

    setSavedPlayers(players.map((player) => ({ ...player })));
    setFeedback("Jugador actualizado. Guardado local de prueba.");
    window.setTimeout(() => setFeedback(null), 2400);
  }

  if (!selectedPlayer) {
    return (
      <AdminEmptyState
        title="Sin jugadores"
        description="Carga jugadores mock o importa una plantilla para empezar a preparar cromos."
      />
    );
  }

  const cardReadiness = getCardReadiness(selectedPlayer);

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow="Fichas y cromos"
        title="Ficha publica del jugador"
        description="Aqui se remata el perfil final que alimenta la ficha publica y el cromo."
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/admin/asignaciones?team=${selectedPlayer.teamSlug}`}
              className="rr-button rr-button-secondary text-[0.84rem]"
            >
              Ver plantilla
            </Link>
            <button
              type="button"
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className="rr-button rr-button-primary text-[0.84rem] disabled:cursor-not-allowed disabled:opacity-45"
            >
              Guardar cambios
            </button>
          </div>
        }
      />

      {feedback ? (
        <div className="rounded-[10px] border border-[rgba(253,203,88,0.26)] bg-[rgba(253,203,88,0.1)] px-4 py-3 text-[0.94rem] text-[color:var(--rr-gold)]">
          {feedback}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[25rem_minmax(0,1fr)]">
        <AdminPanel className="p-4 sm:p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">Jugadores del club</p>
                <h2 className="mt-1 text-[1.18rem] font-semibold text-white">
                  {filteredPlayers.length} perfiles
                </h2>
              </div>
              <UserRoundCog className="h-5 w-5 text-[color:var(--rr-gold)]" />
            </div>

            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--rr-muted)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar jugador"
                className={inputClassName("w-full pl-9")}
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <label className="grid gap-2">
                <span className={labelClassName()}>Equipo</span>
                <select
                  value={teamFilter}
                  onChange={(event) => setTeamFilter(event.target.value)}
                  className={inputClassName()}
                >
                  <option value="all">Todos</option>
                  {adminMockTeams.map((team) => (
                    <option key={team.slug} value={team.slug}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className={labelClassName()}>Posicion</span>
                <select
                  value={positionFilter}
                  onChange={(event) =>
                    setPositionFilter(event.target.value as PlayerPositionFilter)
                  }
                  className={inputClassName()}
                >
                  <option value="all">Todas</option>
                  {adminPlayerPositionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded-[12px] border border-white/10 bg-white/4 p-1">
              {(["all", "visible", "hidden"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setVisibilityFilter(value)}
                  className={cn(
                    "min-h-9 rounded-[9px] px-2 text-[0.78rem] font-medium transition",
                    visibilityFilter === value
                      ? "bg-[rgba(253,203,88,0.14)] text-[color:var(--rr-gold)]"
                      : "text-[color:var(--rr-muted)]",
                  )}
                >
                  {value === "all" ? "Todos" : value === "visible" ? "Visible" : "Oculto"}
                </button>
              ))}
            </div>

            <div className="grid max-h-[44rem] gap-2 overflow-y-auto pr-1">
              {filteredPlayers.map((player) => {
                const active = player.id === selectedPlayer.id;

                return (
                  <button
                    key={player.id}
                    type="button"
                    onClick={() => setSelectedPlayerId(player.id)}
                    className={cn(
                      "rounded-[10px] border px-3 py-3 text-left transition",
                      active
                        ? "border-[rgba(253,203,88,0.34)] bg-[rgba(253,203,88,0.1)]"
                        : "border-white/10 bg-[rgba(255,255,255,0.04)] hover:border-white/20",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">
                          #{player.number} {player.publicName}
                        </p>
                        <p className="mt-1 text-[0.84rem] text-[color:var(--rr-muted)]">
                          {getTeamLabel(player.teamSlug)} - {mapPositionLabel(player.position)}
                        </p>
                      </div>
                      {player.visible ? (
                        <Eye className="h-4 w-4 text-[color:var(--rr-gold)]" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-[color:var(--rr-muted)]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </AdminPanel>

        <div className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_30rem]">
          <AdminPanel className="p-5 sm:p-6">
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="rr-kicker text-[color:var(--rr-gold)]">
                    Ficha editable
                  </p>
                  <h2 className="mt-2 text-[1.35rem] font-semibold text-white">
                    {selectedPlayer.publicName}
                  </h2>
                  <p className="mt-1 text-[0.92rem] text-[color:var(--rr-muted)]">
                    {getTeamLabel(selectedPlayer.teamSlug)} - {selectedPlayer.slug}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminStatusBadge
                    label={selectedPlayer.visible ? "Visible" : "Oculto"}
                    tone={selectedPlayer.visible ? "gold" : "slate"}
                  />
                  <AdminStatusBadge
                    label={selectedPlayer.cardVariant === "first-team" ? "Premium" : "Cantera"}
                    tone={selectedPlayer.cardVariant === "first-team" ? "blue" : "slate"}
                  />
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <label className="grid gap-2">
                  <span className={labelClassName()}>Nombre publico</span>
                  <input
                    value={selectedPlayer.publicName}
                    onChange={(event) => {
                      const publicName = event.target.value;
                      updateSelectedPlayer((player) => ({
                        ...player,
                        publicName,
                        slug: slugify(publicName),
                      }));
                    }}
                    className={inputClassName()}
                  />
                </label>

                <label className="grid gap-2">
                  <span className={labelClassName()}>Slug</span>
                  <input
                    value={selectedPlayer.slug}
                    onChange={(event) =>
                      updateSelectedPlayer((player) => ({
                        ...player,
                        slug: slugify(event.target.value),
                      }))
                    }
                    className={inputClassName()}
                  />
                </label>

                <label className="grid gap-2">
                  <span className={labelClassName()}>Equipo</span>
                  <select
                    value={selectedPlayer.teamSlug}
                    onChange={(event) => {
                      const teamSlug = event.target.value;
                      const team = adminMockTeams.find((candidate) => candidate.slug === teamSlug);

                      updateSelectedPlayer((player) => ({
                        ...player,
                        teamSlug,
                        cardVariant: team?.firstTeam ? "first-team" : "academy",
                      }));
                    }}
                    className={inputClassName()}
                  >
                    {adminMockTeams.map((team) => (
                      <option key={team.slug} value={team.slug}>
                        {team.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className={labelClassName()}>Dorsal</span>
                  <input
                    type="number"
                    min={0}
                    value={selectedPlayer.number}
                    onChange={(event) =>
                      updateSelectedPlayer((player) => ({
                        ...player,
                        number: Math.max(0, Number(event.target.value)),
                      }))
                    }
                    className={inputClassName()}
                  />
                </label>

                <label className="grid gap-2">
                  <span className={labelClassName()}>Posicion</span>
                  <select
                    value={selectedPlayer.position}
                    onChange={(event) =>
                      updateSelectedPlayer((player) => ({
                        ...player,
                        position: event.target.value as AdminPlayer["position"],
                      }))
                    }
                    className={inputClassName()}
                  >
                    {adminPlayerPositionOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className={labelClassName()}>Pais</span>
                  <select
                    value={selectedPlayer.country}
                    onChange={(event) =>
                      updateSelectedPlayer((player) => ({
                        ...player,
                        country: event.target.value,
                      }))
                    }
                    className={inputClassName()}
                  >
                    {countryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className={labelClassName()}>Pie dominante</span>
                  <select
                    value={selectedPlayer.foot}
                    onChange={(event) =>
                      updateSelectedPlayer((player) => ({
                        ...player,
                        foot: event.target.value as EditableAdminPlayer["foot"],
                      }))
                    }
                    className={inputClassName()}
                  >
                    <option value="Derecha">Derecha</option>
                    <option value="Izquierda">Izquierda</option>
                    <option value="Ambas">Ambas</option>
                  </select>
                </label>

                <label className="grid gap-2">
                  <span className={labelClassName()}>Foto/base</span>
                  <select
                    value={selectedPlayer.photoUrl ?? ""}
                    onChange={(event) =>
                      updateSelectedPlayer((player) => ({
                        ...player,
                        photoUrl: event.target.value || undefined,
                      }))
                    }
                    className={inputClassName()}
                  >
                    {photoOptions.map((option) => (
                      <option key={option.value || "empty"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    updateSelectedPlayer((player) => ({
                      ...player,
                      visible: !player.visible,
                    }))
                  }
                  className="flex min-h-12 items-center justify-between rounded-[10px] border border-white/10 bg-white/5 px-4 text-left text-[0.92rem] text-white transition hover:border-[rgba(253,203,88,0.26)]"
                >
                  <span>Visible en web</span>
                  {selectedPlayer.visible ? (
                    <Check className="h-4 w-4 text-[color:var(--rr-gold)]" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-[color:var(--rr-muted)]" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    updateSelectedPlayer((player) => ({
                      ...player,
                      cardVariant:
                        player.cardVariant === "first-team" ? "academy" : "first-team",
                    }))
                  }
                  className="flex min-h-12 items-center justify-between rounded-[10px] border border-white/10 bg-white/5 px-4 text-left text-[0.92rem] text-white transition hover:border-[rgba(253,203,88,0.26)]"
                >
                  <span>Variante de cromo</span>
                  <ShieldCheck className="h-4 w-4 text-[color:var(--rr-gold)]" />
                </button>
              </div>

              <div className="grid gap-3 rounded-[12px] border border-white/10 bg-white/4 px-4 py-4 sm:grid-cols-3">
                <div>
                  <p className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">
                    Goles + asist.
                  </p>
                  <p className="mt-2 text-[1.25rem] font-semibold text-white">
                    {getGoalParticipation(selectedPlayer)}
                  </p>
                </div>
                <div>
                  <p className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">
                    Partidos
                  </p>
                  <p className="mt-2 text-[1.25rem] font-semibold text-white">
                    {selectedPlayer.matchesPlayed}
                  </p>
                </div>
                <div>
                  <p className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">
                    MVP
                  </p>
                  <p className="mt-2 text-[1.25rem] font-semibold text-white">
                    {selectedPlayer.mvp}
                  </p>
                </div>
              </div>
            </div>
          </AdminPanel>

          <div className="space-y-4 2xl:sticky 2xl:top-[7.5rem] 2xl:self-start">
            <AdminPanel className="overflow-hidden border-[rgba(253,203,88,0.22)]">
              <div className="border-b border-white/10 bg-[rgba(253,203,88,0.06)] px-5 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="rr-kicker text-[color:var(--rr-gold)]">Preview principal</p>
                    <h2 className="mt-1 text-[1.18rem] font-semibold text-white">
                      Cromo generado
                    </h2>
                  </div>
                  <Camera className="h-5 w-5 text-[color:var(--rr-gold)]" />
                </div>
              </div>

              <div className="space-y-5 p-5">
                <div className="rounded-[14px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.12),transparent_38%),rgba(255,255,255,0.04)] px-3 py-5">
                  <PremiumPlayerCard
                    name={selectedPlayer.publicName}
                    number={selectedPlayer.number}
                    country={countryOptions.find((option) => option.value === selectedPlayer.country)?.label}
                    countryFlag={selectedPlayer.country}
                    position={mapPositionLabel(selectedPlayer.position)}
                    dominantFoot={mapFootToDominantFoot(selectedPlayer.foot)}
                    imageUrl={selectedPlayer.photoUrl}
                    playerType={getPlayerType(selectedPlayer)}
                    teamType={selectedPlayer.cardVariant}
                    stats={{
                      matchesPlayed: selectedPlayer.matchesPlayed,
                      goals: selectedPlayer.goals,
                      assists: selectedPlayer.assists,
                      goalsAgainst: selectedPlayer.goalsConceded,
                      yellowCards: selectedPlayer.yellowCards,
                      redCards: selectedPlayer.redCards,
                      ownGoals: selectedPlayer.ownGoals,
                      mvps: selectedPlayer.mvp,
                      recoveries: selectedPlayer.recoveries,
                      shots: selectedPlayer.shots,
                      shotsOnTarget: selectedPlayer.shotsOnTarget,
                      cleanSheets: selectedPlayer.cleanSheets,
                      saves: selectedPlayer.saves,
                    }}
                    className="mx-auto w-full max-w-[24rem]"
                  />
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center justify-between gap-3 rounded-[10px] border border-white/10 bg-white/4 px-4 py-3">
                    <span className="text-[0.92rem] text-[color:var(--rr-muted)]">
                      Preparacion del cromo
                    </span>
                    <AdminStatusBadge
                      label={`${cardReadiness.readyCount}/${cardReadiness.checks.length}`}
                      tone={cardReadiness.readyCount === cardReadiness.checks.length ? "success" : "gold"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {cardReadiness.checks.map((check) => (
                      <div
                        key={check.label}
                        className={cn(
                          "flex min-h-10 items-center justify-between rounded-[9px] border px-3 text-[0.82rem]",
                          check.ready
                            ? "border-[rgba(151,255,199,0.2)] bg-[rgba(31,98,64,0.18)] text-[#b8ffd8]"
                            : "border-white/10 bg-white/4 text-[color:var(--rr-muted)]",
                        )}
                      >
                        {check.label}
                        {check.ready ? <Check className="h-3.5 w-3.5" /> : null}
                      </div>
                    ))}
                  </div>

                  {!selectedPlayer.photoUrl ? (
                    <div className="rounded-[10px] border border-[rgba(253,203,88,0.22)] bg-[rgba(253,203,88,0.08)] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ImagePlus className="h-4.5 w-4.5 text-[color:var(--rr-gold)]" />
                        <p className="text-[0.9rem] font-semibold text-white">
                          Falta foto/base
                        </p>
                      </div>
                      <p className="mt-2 text-[0.84rem] leading-5 text-[color:var(--rr-muted)]">
                        El cromo funciona con placeholder, pero la foto es lo que mas sube el nivel visual.
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </AdminPanel>

          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminPlayersWorkspace() {
  const searchParams = useSearchParams();
  const requestedPlayerId = searchParams.get("player");
  const requestedTeamSlug = searchParams.get("team");
  const initialTeamFilter =
    requestedTeamSlug && adminMockTeams.some((team) => team.slug === requestedTeamSlug)
      ? requestedTeamSlug
      : "all";
  const initialPlayerId =
    requestedPlayerId && adminMockPlayers.some((player) => player.id === requestedPlayerId)
      ? requestedPlayerId
      : undefined;

  return (
    <AdminPlayersWorkspaceInner
      key={searchParams.toString()}
      initialPlayerId={initialPlayerId}
      initialTeamFilter={initialTeamFilter}
    />
  );
}

