"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Camera,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  Search,
  ShieldCheck,
} from "lucide-react";
import { AdminEmptyState } from "@/components/admin/admin-empty-state";
import { AdminFeedbackBanner } from "@/components/admin/admin-feedback-banner";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import { savePlayerProfileAction } from "@/app/admin/(panel)/jugadores/actions";
import { MediaPickerDialog } from "@/components/admin/media-picker-dialog";
import { PremiumPlayerCard } from "@/components/public/premium-player-card";
import type { AdminMediaPickerItem } from "@/lib/admin/media-management";
import {
  adminPlayerPositionOptions,
  type AdminPlayer,
} from "@/lib/admin/mock-data";
import type { AdminManagedPlayer } from "@/lib/admin/player-management";
import { slugifyPlayerName } from "@/lib/admin/player-management";
import type {
  DominantFoot,
  PublicPlayerType,
} from "@/lib/public/player-profile-content";
import type { AdminRole } from "@/lib/admin/roles";
import { cn } from "@/lib/utils";

type PlayerVisibilityFilter = "all" | "visible" | "hidden";
type PlayerPositionFilter = "all" | AdminPlayer["position"];

type AdminPlayersWorkspaceProps = {
  role: AdminRole;
  initialPlayers: AdminManagedPlayer[];
  initialTeams: Array<{ slug: string; name: string }>;
  countryOptions: Array<{ value: string; label: string }>;
  mediaOptions: AdminMediaPickerItem[];
  initialSelectedPlayerId?: string;
  initialTeamFilter?: string;
};

function mapFootToDominantFoot(foot: AdminManagedPlayer["foot"]): DominantFoot {
  if (foot === "Izquierda") {
    return "left";
  }

  if (foot === "Ambas") {
    return "both";
  }

  return "right";
}

function mapPositionLabel(position: AdminManagedPlayer["position"]) {
  return (
    adminPlayerPositionOptions.find((option) => option.value === position)?.label ??
    position
  );
}

function getPlayerType(player: AdminManagedPlayer): PublicPlayerType {
  return player.position === "POR" ? "goalkeeper" : "field";
}

function getGoalParticipation(player: AdminManagedPlayer) {
  return player.goals + player.assists;
}

function getCardReadiness(player: AdminManagedPlayer) {
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

export function AdminPlayersWorkspace({
  role,
  initialPlayers,
  initialTeams,
  countryOptions,
  mediaOptions,
  initialSelectedPlayerId,
  initialTeamFilter = "all",
}: AdminPlayersWorkspaceProps) {
  const [players, setPlayers] = useState(initialPlayers);
  const [savedPlayers, setSavedPlayers] = useState(initialPlayers);
  const [selectedPlayerId, setSelectedPlayerId] = useState(
    initialSelectedPlayerId ?? initialPlayers[0]?.id ?? "",
  );
  const [search, setSearch] = useState("");
  const [teamFilter, setTeamFilter] = useState(initialTeamFilter);
  const [positionFilter, setPositionFilter] = useState<PlayerPositionFilter>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<PlayerVisibilityFilter>("all");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [photoPickerOpen, setPhotoPickerOpen] = useState(false);

  const canManageProfiles = role !== "COACH";
  const hasUnsavedChanges = JSON.stringify(players) !== JSON.stringify(savedPlayers);

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

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timer = window.setTimeout(() => setFeedback(null), 2400);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const selectedPlayer =
    players.find((player) => player.id === selectedPlayerId) ??
    filteredPlayers[0] ??
    players[0];

  function updateSelectedPlayer(
    updater: (player: AdminManagedPlayer) => AdminManagedPlayer,
  ) {
    if (!selectedPlayer || !canManageProfiles) {
      return;
    }

    setPlayers((currentPlayers) =>
      currentPlayers.map((player) =>
        player.id === selectedPlayer.id ? updater(player) : player,
      ),
    );
  }

  async function handleSave() {
    if (!selectedPlayer || !canManageProfiles || !hasUnsavedChanges) {
      return;
    }

    setIsSaving(true);
    const result = await savePlayerProfileAction({
      playerId: selectedPlayer.id,
      publicName: selectedPlayer.publicName,
      slug: selectedPlayer.slug,
      country: selectedPlayer.country,
      foot: selectedPlayer.foot,
      visible: selectedPlayer.visible,
      active: selectedPlayer.active,
      photoMediaId: selectedPlayer.photoMediaId ?? "",
      photoUrl: selectedPlayer.photoUrl ?? "",
    });
    setIsSaving(false);

    if (!result.ok) {
      setFeedback(result.message);
      return;
    }

    setPlayers(result.data.players);
    setSavedPlayers(result.data.players);
    setSelectedPlayerId(result.selectedPlayerId ?? selectedPlayer.id);
    setFeedback(result.message);
  }

  if (!selectedPlayer) {
    return (
      <AdminEmptyState
        title="Sin jugadores"
        description="Cuando haya jugadores en la temporada activa, aqui veras sus fichas publicas y el preview del cromo."
      />
    );
  }

  const cardReadiness = getCardReadiness(selectedPlayer);
  const selectedCountryLabel =
    countryOptions.find((option) => option.value === selectedPlayer.country)?.label ??
    selectedPlayer.country;

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow={canManageProfiles ? "Fichas y cromos" : "Solo consulta"}
        title={canManageProfiles ? "Ficha publica del jugador" : "Fichas publicas"}
        description={
          canManageProfiles
            ? "Aqui se remata el perfil final que alimenta la ficha publica y el cromo."
            : "Consulta la presentacion publica actual del jugador sin editar identidad ni estructura."
        }
        actions={
          canManageProfiles ? (
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
                disabled={!hasUnsavedChanges || isSaving}
                className="rr-button rr-button-primary text-[0.84rem] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isSaving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          ) : undefined
        }
      />

      {feedback ? <AdminFeedbackBanner message={feedback} /> : null}

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
              <ShieldCheck className="h-5 w-5 text-[color:var(--rr-gold)]" />
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
                  {initialTeams.map((team) => (
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
                          {player.teamName} - {mapPositionLabel(player.position)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!player.active ? (
                          <AdminStatusBadge label="Inactivo" tone="danger" />
                        ) : null}
                        {player.visible ? (
                          <Eye className="h-4 w-4 text-[color:var(--rr-gold)]" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-[color:var(--rr-muted)]" />
                        )}
                      </div>
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
                  <p className="rr-kicker text-[color:var(--rr-gold)]">Ficha editable</p>
                  <h2 className="mt-2 text-[1.35rem] font-semibold text-white">
                    {selectedPlayer.publicName}
                  </h2>
                  <p className="mt-1 text-[0.92rem] text-[color:var(--rr-muted)]">
                    {selectedPlayer.teamName} - {selectedPlayer.slug}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <AdminStatusBadge
                    label={selectedPlayer.visible ? "Visible" : "Oculto"}
                    tone={selectedPlayer.visible ? "gold" : "slate"}
                  />
                  <AdminStatusBadge
                    label={selectedPlayer.active ? "Activo" : "Inactivo"}
                    tone={selectedPlayer.active ? "success" : "danger"}
                  />
                  <AdminStatusBadge
                    label={selectedPlayer.teamType === "first-team" ? "Premium" : "Cantera"}
                    tone={selectedPlayer.teamType === "first-team" ? "blue" : "slate"}
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
                        slug: slugifyPlayerName(publicName),
                      }));
                    }}
                    disabled={!canManageProfiles || isSaving}
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
                        slug: slugifyPlayerName(event.target.value),
                      }))
                    }
                    disabled={!canManageProfiles || isSaving}
                    className={inputClassName()}
                  />
                </label>

                <div className="grid gap-2">
                  <span className={labelClassName()}>Equipo</span>
                  <div className="flex min-h-11 items-center rounded-[8px] border border-white/10 bg-white/4 px-3 text-white">
                    {selectedPlayer.teamName}
                  </div>
                </div>

                <div className="grid gap-2">
                  <span className={labelClassName()}>Dorsal</span>
                  <div className="flex min-h-11 items-center rounded-[8px] border border-white/10 bg-white/4 px-3 text-white">
                    #{selectedPlayer.number}
                  </div>
                </div>

                <div className="grid gap-2">
                  <span className={labelClassName()}>Posicion</span>
                  <div className="flex min-h-11 items-center rounded-[8px] border border-white/10 bg-white/4 px-3 text-white">
                    {mapPositionLabel(selectedPlayer.position)}
                  </div>
                </div>

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
                    disabled={!canManageProfiles || isSaving}
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
                        foot: event.target.value as AdminManagedPlayer["foot"],
                      }))
                    }
                    disabled={!canManageProfiles || isSaving}
                    className={inputClassName()}
                  >
                    <option value="Derecha">Derecha</option>
                    <option value="Izquierda">Izquierda</option>
                    <option value="Ambas">Ambas</option>
                  </select>
                </label>

                <label className="grid gap-2 lg:col-span-2">
                  <span className={labelClassName()}>Foto/base</span>
                  <div className="grid gap-3 rounded-[10px] border border-white/10 bg-white/4 p-3 sm:grid-cols-[7rem_minmax(0,1fr)]">
                    <div className="overflow-hidden rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)]">
                      {selectedPlayer.photoUrl ? (
                        <img
                          src={selectedPlayer.photoUrl}
                          alt={selectedPlayer.publicName}
                          className="h-28 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-28 items-center justify-center text-[color:var(--rr-muted)]">
                          <ImagePlus className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-[8px] border border-white/10 bg-[rgba(7,19,34,0.92)] px-3 py-3 text-[0.9rem] text-white">
                        {selectedPlayer.photoUrl
                          ? "Recurso conectado desde biblioteca"
                          : "Sin foto asignada"}
                      </div>

                      {canManageProfiles ? (
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => setPhotoPickerOpen(true)}
                            disabled={isSaving}
                            className="rr-button rr-button-secondary text-[0.8rem]"
                          >
                            Elegir de media
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateSelectedPlayer((player) => ({
                                ...player,
                                photoMediaId: undefined,
                                photoUrl: undefined,
                              }))
                            }
                            disabled={isSaving || !selectedPlayer.photoUrl}
                            className="rr-button rr-button-secondary text-[0.8rem] disabled:cursor-not-allowed disabled:opacity-45"
                          >
                            Quitar foto
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </label>
              </div>

              {canManageProfiles ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateSelectedPlayer((player) => ({
                        ...player,
                        visible: !player.visible,
                      }))
                    }
                    disabled={isSaving}
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
                        active: !player.active,
                      }))
                    }
                    disabled={isSaving}
                    className="flex min-h-12 items-center justify-between rounded-[10px] border border-white/10 bg-white/5 px-4 text-left text-[0.92rem] text-white transition hover:border-[rgba(253,203,88,0.26)]"
                  >
                    <span>Perfil activo</span>
                    <ShieldCheck className="h-4 w-4 text-[color:var(--rr-gold)]" />
                  </button>
                </div>
              ) : null}

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
                    country={selectedCountryLabel}
                    countryFlag={selectedPlayer.country}
                    position={mapPositionLabel(selectedPlayer.position)}
                    dominantFoot={mapFootToDominantFoot(selectedPlayer.foot)}
                    imageUrl={selectedPlayer.photoUrl}
                    playerType={getPlayerType(selectedPlayer)}
                    teamType={selectedPlayer.teamType}
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
                      tone={
                        cardReadiness.readyCount === cardReadiness.checks.length
                          ? "success"
                          : "gold"
                      }
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

      <MediaPickerDialog
        open={photoPickerOpen}
        title="Elegir foto de jugador"
        description="Selecciona una imagen ya subida en la biblioteca real."
        items={mediaOptions}
        allowedUsages={["PLAYER_PHOTO"]}
        selectedMediaId={selectedPlayer.photoMediaId}
        onClose={() => setPhotoPickerOpen(false)}
        onSelect={(item) => {
          updateSelectedPlayer((player) => ({
            ...player,
            photoMediaId: item.id,
            photoUrl: item.publicUrl,
          }));
          setPhotoPickerOpen(false);
        }}
      />
    </div>
  );
}
