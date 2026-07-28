"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  BarChart3,
  ChevronDown,
  ChevronLeft,
  RotateCcw,
  Search,
  TableProperties,
} from "lucide-react";
import { TeamSectionNavigation } from "@/components/public/team-section-navigation";
import type { PublicPlayerProfile, PublicPlayerType } from "@/lib/contracts/public";
import {
  buildTeamStatisticsUrl,
  normalizeTeamStatisticsState,
  parseTeamStatisticsInitialState,
  TEAM_STATISTICS_ACTIONS,
  TEAM_STATISTICS_PARAM_NAMES,
  type TeamStatisticsInitialState,
} from "@/lib/public/team-statistics-url-state";
import {
  formatStatValue,
  getMobileSummaryStats,
  getPlayerDetailHref,
  getPlayerLabel,
  getQuickSortOptions,
  getStatMetricValue,
  getStatsColumns,
  sortPlayers,
  type SortDirection,
  type StatSortKey,
  type StatsColumn,
  type TeamStatisticsPageContent,
} from "@/lib/public/team-statistics-utils";
import { cn } from "@/lib/utils";

type TeamStatisticsPageProps = {
  content: TeamStatisticsPageContent;
  initialState: TeamStatisticsInitialState;
};

type PressableButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

function PressableButton({
  children,
  className,
  disabled = false,
  type = "button",
  ...props
}: PressableButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={cn(
        "touch-manipulation select-none",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className,
      )}
    >
      {children}
    </button>
  );
}

function TeamStatisticsStateFields({
  state,
}: {
  state: TeamStatisticsInitialState;
}) {
  return (
    <>
      <button type="submit" tabIndex={-1} aria-hidden="true" className="sr-only">
        Aplicar
      </button>
      <input
        type="hidden"
        name={TEAM_STATISTICS_PARAM_NAMES.section}
        value={state.activeSection}
      />
      <input
        type="hidden"
        name={TEAM_STATISTICS_PARAM_NAMES.sortKey}
        value={state.sortKey ?? ""}
      />
      <input
        type="hidden"
        name={TEAM_STATISTICS_PARAM_NAMES.sortDirection}
        value={state.sortDirection}
      />
      <input
        type="hidden"
        name={TEAM_STATISTICS_PARAM_NAMES.showMobileTable}
        value={state.showMobileTable ? "1" : "0"}
      />
    </>
  );
}

export function TeamStatisticsPage({
  content,
  initialState,
}: TeamStatisticsPageProps) {
  const pagePath =
    content.teamType === "first-team"
      ? "/primer-equipo/estadisticas"
      : `/equipos/${content.teamSlug}/estadisticas`;
  const [statsState, setStatsState] = useState(() =>
    normalizeTeamStatisticsState(initialState, content.teamType),
  );
  const deferredSearch = useDeferredValue(statsState.searchValue);

  const players =
    statsState.activeSection === "field" ? content.fieldPlayers : content.goalkeepers;
  const columns = useMemo(
    () => getStatsColumns(content.teamType, statsState.activeSection),
    [content.teamType, statsState.activeSection],
  );
  const activeSortKey =
    statsState.sortKey && columns.some((column) => column.key === statsState.sortKey)
      ? statsState.sortKey
      : null;

  const filteredPlayers = useMemo(() => {
    const normalizedQuery = deferredSearch.trim().toLowerCase();

    if (!normalizedQuery) {
      return players;
    }

    return players.filter((player) =>
      getPlayerLabel(player).toLowerCase().includes(normalizedQuery),
    );
  }, [deferredSearch, players]);

  const sortedPlayers = useMemo(
    () => sortPlayers(filteredPlayers, activeSortKey, statsState.sortDirection),
    [activeSortKey, filteredPlayers, statsState.sortDirection],
  );

  const quickSortOptions = useMemo(
    () => getQuickSortOptions(content.teamType, statsState.activeSection),
    [content.teamType, statsState.activeSection],
  );

  useEffect(() => {
    const nextUrl = buildTeamStatisticsUrl(pagePath, statsState, content.teamType);
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (currentUrl !== nextUrl) {
      window.history.replaceState(
        window.history.state,
        "",
        `${nextUrl}${window.location.hash}`,
      );
    }
  }, [content.teamType, pagePath, statsState]);

  const handleSearchChange = (value: string) => {
    setStatsState((currentState) =>
      normalizeTeamStatisticsState(
        {
          ...currentState,
          searchValue: value,
        },
        content.teamType,
      ),
    );
  };

  const handleStatsControlsSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.currentTarget);
      const nativeSubmitEvent = event.nativeEvent as SubmitEvent;
      const submitter = nativeSubmitEvent.submitter;

      if (submitter instanceof HTMLButtonElement && submitter.name) {
        formData.set(submitter.name, submitter.value);
      }

      const nextState = parseTeamStatisticsInitialState(
        formDataToSearchParams(formData),
        content.teamType,
      );

      setStatsState(nextState);
    } catch (error) {
      console.error("Failed to handle statistics form submit", error);
    }
  };

  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-80 bg-[radial-gradient(circle_at_top,rgba(253,203,88,0.14),transparent_56%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-24 z-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(52,112,200,0.08),transparent_28%)]"
      />

      <section className="relative z-10 mx-auto w-full max-w-[1280px] px-5 py-16 md:px-8 md:py-20 xl:px-16">
        <TeamStatsHeader content={content} />

        <form
          method="get"
          action={pagePath}
          onSubmit={handleStatsControlsSubmit}
        >
          <TeamStatisticsStateFields state={statsState} />

          <TeamStatsControls
            searchValue={statsState.searchValue}
            activeSection={statsState.activeSection}
            sortKey={activeSortKey}
            sortDirection={statsState.sortDirection}
            quickSortOptions={quickSortOptions}
            resultCount={sortedPlayers.length}
            showMobileTable={statsState.showMobileTable}
            onSearchChange={handleSearchChange}
          />

          {sortedPlayers.length > 0 ? (
            <>
              <PlayerStatsMobileCards
                className="mt-8 lg:hidden"
                players={sortedPlayers}
                teamType={content.teamType}
                playerType={statsState.activeSection}
                columns={columns}
              />

              <div
                className={cn(
                  "mt-6 lg:hidden",
                  statsState.showMobileTable ? "block" : "hidden",
                )}
              >
                <PlayerStatsTable
                  players={sortedPlayers}
                  columns={columns}
                  sortKey={activeSortKey}
                  sortDirection={statsState.sortDirection}
                  caption={`${content.teamName}: estadisticas en tabla movil`}
                  compact
                />
              </div>

              <PlayerStatsTable
                className="mt-8 hidden lg:block"
                players={sortedPlayers}
                columns={columns}
                sortKey={activeSortKey}
                sortDirection={statsState.sortDirection}
                caption={`${content.teamName}: estadisticas de jugadores`}
              />
            </>
          ) : (
            <StatisticsEmptyState
              className="mt-8"
              title={
                statsState.searchValue
                  ? "Sin resultados"
                  : statsState.activeSection === "field"
                    ? "Jugadores pendientes"
                    : "Porteros pendientes"
              }
              description={
                statsState.searchValue
                  ? "Prueba con otro nombre o posicion para encontrar al jugador."
                  : statsState.activeSection === "field"
                    ? "Todavia no hay estadisticas publicadas para los jugadores de campo."
                    : "Todavia no hay estadisticas publicadas para los porteros."
              }
            />
          )}
        </form>
      </section>
    </div>
  );
}

export function TeamStatsHeader({ content }: { content: TeamStatisticsPageContent }) {
  return (
    <header className="max-w-[58rem]">
      <Link
        href={content.backHref}
        className="rr-kicker inline-flex items-center gap-2 text-[0.82rem] text-[color:var(--rr-muted)] transition hover:text-[color:var(--rr-gold)]"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.9} />
        <span>{content.backLabel}</span>
      </Link>

      <p className="rr-kicker mt-6 text-[0.82rem] text-[color:var(--rr-gold)]">
        Estadisticas
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {content.category ? (
          <span className="rr-chip border-[color:var(--rr-border-strong)] text-[color:var(--rr-gold)]">
            {content.category}
          </span>
        ) : null}
        <span className="rr-chip border-[color:var(--rr-border-strong)] text-[color:var(--rr-gold)]">
          {content.competition}
        </span>
        <span className="rr-chip text-[color:var(--rr-muted)]">{content.season}</span>
      </div>

      <h1 className="rr-display mt-6 text-[4rem] leading-[0.9] text-white sm:text-[5rem] lg:text-[6.1rem]">
        {content.title}
      </h1>
      <p className="mt-4 max-w-[42rem] text-[1.16rem] text-[color:var(--rr-muted)] md:text-[1.3rem]">
        {content.subtitle}
      </p>
      <div className="rr-bolt-divider mt-7 max-w-[20rem]" />

      <TeamSectionNavigation
        links={content.navLinks}
        activeKey="statistics"
        className="mt-8"
      />
    </header>
  );
}

type TeamStatsControlsProps = {
  searchValue: string;
  activeSection: PublicPlayerType;
  sortKey: StatSortKey | null;
  sortDirection: SortDirection;
  quickSortOptions: Array<{ key: StatSortKey; label: string }>;
  resultCount: number;
  showMobileTable: boolean;
  onSearchChange: (value: string) => void;
};

export function TeamStatsControls({
  searchValue,
  activeSection,
  sortKey,
  sortDirection,
  quickSortOptions,
  resultCount,
  showMobileTable,
  onSearchChange,
}: TeamStatsControlsProps) {
  return (
    <section className="rr-panel mt-10 px-5 py-5 md:px-6 md:py-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] xl:items-end">
        <div className="space-y-5">
          <label className="block">
            <span className="rr-kicker mb-2.5 block text-[0.74rem] text-[color:var(--rr-muted)]">
              Buscar jugador
            </span>
            <span className="relative flex items-center">
              <Search className="pointer-events-none absolute left-4 h-4 w-4 text-[color:var(--rr-muted)]" />
              <input
                type="search"
                name={TEAM_STATISTICS_PARAM_NAMES.search}
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Nombre del jugador"
                className="h-12 w-full border border-[color:var(--rr-border)] bg-[rgba(7,22,41,0.58)] pl-11 pr-4 text-[1rem] text-white outline-none transition placeholder:text-[color:var(--rr-muted)] focus:border-[color:var(--rr-border-strong)]"
              />
            </span>
          </label>

          <PlayerStatsTabs activeSection={activeSection} />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="rr-kicker text-[0.74rem] text-[color:var(--rr-gold)]">
                Orden rapido
              </p>
              <p className="mt-1 text-[1rem] text-[color:var(--rr-muted)]">
                {resultCount} {resultCount === 1 ? "resultado" : "resultados"}
              </p>
            </div>
            {sortKey ? (
              <p className="text-right text-[0.95rem] text-[color:var(--rr-muted)]">
                Orden actual:{" "}
                <span className="text-white">
                  {quickSortOptions.find((option) => option.key === sortKey)?.label ?? "Tabla"}
                </span>
              </p>
            ) : (
              <p className="text-right text-[0.95rem] text-[color:var(--rr-muted)]">
                Sin orden manual
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {quickSortOptions.map((option) => {
              const isActive = sortKey === option.key;

              return (
                <PressableButton
                  key={option.key}
                  type="submit"
                  name={TEAM_STATISTICS_PARAM_NAMES.action}
                  value={TEAM_STATISTICS_ACTIONS.sort(option.key)}
                  className={cn(
                    "inline-flex min-h-11 items-center justify-between gap-3 border px-4 py-3 text-left transition",
                    isActive
                      ? "border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.1)] text-white"
                      : "border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] text-white hover:border-[color:var(--rr-border-strong)] hover:bg-[rgba(255,255,255,0.05)]",
                  )}
                >
                  <span
                    className={cn(
                      "rr-kicker text-[0.74rem]",
                      isActive ? "text-[color:var(--rr-gold)]" : "text-[color:var(--rr-muted)]",
                    )}
                  >
                    {option.label}
                  </span>
                  {isActive ? (
                    sortDirection === "asc" ? (
                      <ArrowUp
                        className="h-4 w-4 text-[color:var(--rr-gold)]"
                        strokeWidth={1.9}
                      />
                    ) : (
                      <ArrowDown
                        className="h-4 w-4 text-[color:var(--rr-gold)]"
                        strokeWidth={1.9}
                      />
                    )
                  ) : (
                    <ArrowUpDown
                      className="h-4 w-4 text-[color:var(--rr-muted)]"
                      strokeWidth={1.9}
                    />
                  )}
                </PressableButton>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <PressableButton
              type="submit"
              name={TEAM_STATISTICS_PARAM_NAMES.action}
              value={TEAM_STATISTICS_ACTIONS.toggleSortDirection}
              disabled={!sortKey}
              className={cn(
                "inline-flex h-12 items-center justify-center gap-2 border px-4 text-white transition",
                sortKey
                  ? "border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] hover:border-[color:var(--rr-border-strong)] hover:bg-[rgba(255,255,255,0.05)]"
                  : "border-white/8 bg-[rgba(255,255,255,0.02)] text-[color:var(--rr-muted)]/60",
              )}
            >
              {sortDirection === "asc" ? (
                <ArrowUp className="h-4 w-4 text-[color:var(--rr-gold)]" strokeWidth={1.9} />
              ) : (
                <ArrowDown
                  className="h-4 w-4 text-[color:var(--rr-gold)]"
                  strokeWidth={1.9}
                />
              )}
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                {sortDirection === "asc" ? "Asc" : "Desc"}
              </span>
            </PressableButton>

            <PressableButton
              type="submit"
              name={TEAM_STATISTICS_PARAM_NAMES.action}
              value={TEAM_STATISTICS_ACTIONS.clearSort}
              disabled={!sortKey}
              className={cn(
                "inline-flex h-12 items-center justify-center gap-2 border px-4 text-white transition",
                sortKey
                  ? "border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] hover:border-[color:var(--rr-border-strong)] hover:bg-[rgba(255,255,255,0.05)]"
                  : "border-white/8 bg-[rgba(255,255,255,0.02)] text-[color:var(--rr-muted)]/60",
              )}
            >
              <RotateCcw
                className="h-4 w-4 text-[color:var(--rr-gold)]"
                strokeWidth={1.9}
              />
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                Limpiar orden
              </span>
            </PressableButton>

            <PressableButton
              type="submit"
              name={TEAM_STATISTICS_PARAM_NAMES.action}
              value={TEAM_STATISTICS_ACTIONS.toggleMobileTable}
              className="inline-flex h-12 items-center justify-center gap-2 border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] px-4 text-white transition hover:border-[color:var(--rr-border-strong)] hover:bg-[rgba(255,255,255,0.05)] lg:hidden"
            >
              <TableProperties
                className="h-4 w-4 text-[color:var(--rr-gold)]"
                strokeWidth={1.9}
              />
              <span className="rr-kicker text-[0.74rem] text-[color:var(--rr-muted)]">
                {showMobileTable ? "Ocultar tabla" : "Ver tabla completa"}
              </span>
            </PressableButton>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PlayerStatsTabs({
  activeSection,
}: {
  activeSection: PublicPlayerType;
}) {
  const items = [
    { value: "field" as const, label: "Jugadores" },
    { value: "goalkeeper" as const, label: "Porteros" },
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {items.map((item) => {
        const isActive = item.value === activeSection;

        return (
          <PressableButton
            key={item.value}
            type="submit"
            name={TEAM_STATISTICS_PARAM_NAMES.action}
            value={TEAM_STATISTICS_ACTIONS.section(item.value)}
            className={cn(
              "inline-flex min-h-11 items-center gap-2 border px-4 py-3 transition",
              isActive
                ? "border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.1)] text-white"
                : "border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] text-white hover:border-[color:var(--rr-border-strong)] hover:bg-[rgba(255,255,255,0.05)]",
            )}
          >
            <span
              className={cn(
                "rr-kicker text-[0.78rem]",
                isActive ? "text-[color:var(--rr-gold)]" : "text-[color:var(--rr-muted)]",
              )}
            >
              {item.label}
            </span>
          </PressableButton>
        );
      })}
    </div>
  );
}

type PlayerStatsTableProps = {
  players: PublicPlayerProfile[];
  columns: StatsColumn[];
  sortKey: StatSortKey | null;
  sortDirection: SortDirection;
  compact?: boolean;
  caption?: string;
  className?: string;
};

export function PlayerStatsTable({
  players,
  columns,
  sortKey,
  sortDirection,
  compact = false,
  caption = "Estadisticas de jugadores",
  className,
}: PlayerStatsTableProps) {
  const topStatValues = getTopStatValues(players, columns);

  return (
    <section
      className={cn(
        "rr-panel overflow-hidden border-white/15 bg-[rgba(12,35,65,0.82)] shadow-[0_18px_56px_rgba(0,0,0,0.22)]",
        className,
      )}
    >
      <div className="overflow-x-auto">
        <table className={cn("w-full min-w-[52rem] border-collapse", compact && "min-w-[48rem]")}>
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.025))]">
              {columns.map((column, index) => (
                <SortableStatHeader
                  key={column.key}
                  column={column}
                  isActive={sortKey === column.key}
                  sortDirection={sortDirection}
                  sticky={index === 0}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player, playerIndex) => (
              <tr
                key={player.id}
                className={cn(
                  "border-t border-white/8 transition hover:bg-[rgba(255,255,255,0.035)]",
                  playerIndex === 0 &&
                    sortKey &&
                    sortKey !== "player" &&
                    "bg-[rgba(253,203,88,0.055)] shadow-[inset_4px_0_0_rgba(253,203,88,0.58)]",
                )}
              >
                {columns.map((column, index) =>
                  index === 0 ? (
                    <PlayerIdentityCell
                      key={column.key}
                      player={player}
                      sticky
                      highlighted={playerIndex === 0 && Boolean(sortKey && sortKey !== "player")}
                    />
                  ) : (
                    <StatValue
                      key={column.key}
                      player={player}
                      statKey={column.key}
                      active={sortKey === column.key}
                      topValue={topStatValues.get(column.key)}
                    />
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

type SortableStatHeaderProps = {
  column: StatsColumn;
  isActive: boolean;
  sortDirection: SortDirection;
  sticky?: boolean;
};

export function SortableStatHeader({
  column,
  isActive,
  sortDirection,
  sticky = false,
}: SortableStatHeaderProps) {
  const Icon = isActive ? (sortDirection === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <th
      scope="col"
      className={cn(
        "px-3 py-4 text-center text-[0.8rem] md:px-4",
        sticky && "sticky left-0 z-20 bg-[rgba(20,34,54,0.98)] text-left",
        isActive && !sticky && "bg-[rgba(253,203,88,0.055)]",
      )}
    >
      <PressableButton
        type="submit"
        name={TEAM_STATISTICS_PARAM_NAMES.action}
        value={TEAM_STATISTICS_ACTIONS.sort(column.key)}
        className={cn(
          "inline-flex items-center justify-center gap-2 text-center text-[color:var(--rr-muted)] transition hover:text-white",
          sticky && "justify-start text-left",
          isActive && "text-white",
        )}
      >
        <span className="rr-kicker whitespace-nowrap">{column.label}</span>
        <Icon
          className={cn(
            "h-4 w-4",
            isActive ? "text-[color:var(--rr-gold)]" : "text-[color:var(--rr-muted)]",
          )}
          strokeWidth={1.9}
        />
      </PressableButton>
    </th>
  );
}

export function StatValue({
  player,
  statKey,
  active = false,
  topValue,
}: {
  player: PublicPlayerProfile;
  statKey: StatSortKey;
  active?: boolean;
  topValue?: number;
}) {
  const metricValue = getStatMetricValue(player, statKey);
  const isTopValue = typeof topValue === "number" && metricValue === topValue;

  return (
    <td
      className={cn(
        "px-3 py-4 text-center text-[1.05rem] font-semibold tabular-nums text-[color:var(--rr-muted)] md:px-4",
        active && "bg-[rgba(253,203,88,0.045)] text-white",
      )}
    >
      <span
        className={cn(
          "inline-flex min-w-9 justify-center",
          active && "text-[1.12rem] font-bold text-white",
          isTopValue && "font-bold text-[color:var(--rr-gold)]",
        )}
      >
        {formatStatValue(player, statKey)}
      </span>
    </td>
  );
}

export function PlayerIdentityCell({
  player,
  sticky = false,
  highlighted = false,
}: {
  player: PublicPlayerProfile;
  sticky?: boolean;
  highlighted?: boolean;
}) {
  const href = getPlayerDetailHref(player);

  return (
    <td
      className={cn(
        "min-w-[15rem] px-3 py-4 md:px-4",
        sticky && "sticky left-0 z-10 bg-[rgba(17,29,46,0.98)]",
        highlighted && sticky && "bg-[rgba(34,38,45,0.98)]",
      )}
    >
      <Link href={href} className="group flex items-center gap-3">
        <div
          className={cn(
            "relative flex h-14 w-12 shrink-0 items-center justify-center overflow-hidden border bg-[rgba(255,255,255,0.03)]",
            highlighted
              ? "border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.1)] shadow-[inset_0_0_18px_rgba(253,203,88,0.08)]"
              : "border-white/10",
          )}
        >
          {player.imageUrl ? (
            <Image
              src={player.imageUrl}
              alt={player.name}
              fill
              sizes="48px"
              className="object-cover object-top"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[rgba(255,255,255,0.02)]">
              <span className="rr-display text-[1.8rem] leading-none text-[color:var(--rr-gold)]">
                {getPlayerInitials(player)}
              </span>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <p className="truncate text-[1.04rem] font-semibold text-white transition group-hover:text-[color:var(--rr-gold)]">
            {getPlayerLabel(player)}
          </p>
          <p className="mt-1 text-[0.95rem] text-[color:var(--rr-muted)]">
            {player.playerType === "goalkeeper" ? "Portero" : player.position}
          </p>
        </div>
      </Link>
    </td>
  );
}

type PlayerStatsMobileCardsProps = {
  players: PublicPlayerProfile[];
  teamType: TeamStatisticsPageContent["teamType"];
  playerType: PublicPlayerType;
  columns: StatsColumn[];
  className?: string;
};

export function PlayerStatsMobileCards({
  players,
  teamType,
  playerType,
  columns,
  className,
}: PlayerStatsMobileCardsProps) {
  const topStatValues = getTopStatValues(players, columns);

  return (
    <div className={cn("grid gap-4", className)}>
      {players.map((player) => (
        <PlayerStatsCard
          key={player.id}
          player={player}
          teamType={teamType}
          playerType={playerType}
          columns={columns}
          topStatValues={topStatValues}
        />
      ))}
    </div>
  );
}

type PlayerStatsCardProps = {
  player: PublicPlayerProfile;
  teamType: TeamStatisticsPageContent["teamType"];
  playerType: PublicPlayerType;
  columns: StatsColumn[];
  topStatValues: Map<StatSortKey, number>;
};

export function PlayerStatsCard({
  player,
  teamType,
  playerType,
  columns,
  topStatValues,
}: PlayerStatsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const href = getPlayerDetailHref(player);
  const summaryStats = getMobileSummaryStats(player, teamType, playerType);
  const expandedStats = getExpandedStats(
    player,
    columns,
    summaryStats.map((item) => item.key),
  );

  return (
    <article className="rr-panel overflow-hidden border-white/15 bg-[rgba(12,35,65,0.82)] px-4 py-4 shadow-[0_18px_56px_rgba(0,0,0,0.18)]">
      <div className="flex items-start gap-4">
        <Link
          href={href}
          className="relative flex h-24 w-20 shrink-0 items-center justify-center overflow-hidden border border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.08)] shadow-[inset_0_0_22px_rgba(253,203,88,0.08)]"
        >
          {player.imageUrl ? (
            <Image
              src={player.imageUrl}
              alt={player.name}
              fill
              sizes="80px"
              className="object-cover object-top"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[rgba(255,255,255,0.025)]">
              <span className="rr-display text-[2.6rem] leading-none text-[color:var(--rr-gold)]">
                {getPlayerInitials(player)}
              </span>
            </div>
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link href={href} className="block">
                <h3 className="rr-display text-[2.2rem] leading-[0.9] text-white">
                  {getPlayerLabel(player)}
                </h3>
              </Link>
              <p className="mt-1 text-[0.98rem] text-[color:var(--rr-muted)]">
                {player.playerType === "goalkeeper" ? "Portero" : player.position} ·{" "}
                {player.stats.matchesPlayed} PJ
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {summaryStats.map((item) => (
              <div
                key={item.key}
                className="border border-white/8 bg-[rgba(255,255,255,0.035)] px-3 py-3 text-center"
              >
                <p className="rr-kicker text-[0.68rem] text-[color:var(--rr-muted)]">
                  {item.label}
                </p>
                <p
                  className={cn(
                    "mt-2 text-[1.28rem] font-bold tabular-nums text-white",
                    isTopStatValue(player, item.key, topStatValues) && "text-[color:var(--rr-gold)]",
                  )}
                >
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <PressableButton
              onClick={() => setExpanded((currentValue) => !currentValue)}
              className="inline-flex min-h-10 items-center gap-2 border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] px-4 text-white transition hover:border-[color:var(--rr-border-strong)] hover:bg-[rgba(255,255,255,0.05)]"
            >
              <span className="rr-kicker text-[0.72rem] text-[color:var(--rr-muted)]">
                {expanded ? "Ocultar estadisticas" : "Ver mas estadisticas"}
              </span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-[color:var(--rr-gold)] transition",
                  expanded && "rotate-180",
                )}
                strokeWidth={1.9}
              />
            </PressableButton>

            <Link
              href={href}
              className="inline-flex min-h-10 items-center gap-2 border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] px-4 text-white transition hover:border-[color:var(--rr-border-strong)] hover:bg-[rgba(255,255,255,0.05)]"
            >
              <span className="rr-kicker text-[0.72rem] text-[color:var(--rr-muted)]">
                Ver ficha
              </span>
            </Link>
          </div>
        </div>
      </div>

      {expanded && expandedStats.length ? (
        <PlayerStatsExpandedDetails
          className="mt-4"
          items={expandedStats}
          player={player}
          topStatValues={topStatValues}
        />
      ) : null}
    </article>
  );
}

export function PlayerStatsExpandedDetails({
  items,
  player,
  topStatValues,
  className,
}: {
  items: Array<{ key: StatSortKey; label: string; value: string }>;
  player: PublicPlayerProfile;
  topStatValues: Map<StatSortKey, number>;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3 border-t border-white/8 pt-4 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <div key={item.key} className="border border-white/8 bg-[rgba(255,255,255,0.02)] px-3 py-3 text-center">
          <p className="rr-kicker text-[0.66rem] text-[color:var(--rr-muted)]">
            {item.label}
          </p>
          <p
            className={cn(
              "mt-2 text-[1.05rem] font-semibold tabular-nums text-white",
              isTopStatValue(player, item.key, topStatValues) && "font-bold text-[color:var(--rr-gold)]",
            )}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

const TOP_STAT_EXCLUDED_KEYS = new Set<StatSortKey>([
  "player",
  "yellowCards",
  "redCards",
  "ownGoals",
]);

function getTopStatValues(players: PublicPlayerProfile[], columns: StatsColumn[]) {
  const topValues = new Map<StatSortKey, number>();

  for (const column of columns) {
    if (TOP_STAT_EXCLUDED_KEYS.has(column.key)) {
      continue;
    }

    const values = players
      .map((player) => getStatMetricValue(player, column.key))
      .filter((value): value is number => typeof value === "number");

    if (values.length === 0) {
      continue;
    }

    const maxValue = Math.max(...values);

    if (maxValue > 0) {
      topValues.set(column.key, maxValue);
    }
  }

  return topValues;
}

function isTopStatValue(
  player: PublicPlayerProfile,
  statKey: StatSortKey,
  topStatValues: Map<StatSortKey, number>,
) {
  const topValue = topStatValues.get(statKey);

  return typeof topValue === "number" && getStatMetricValue(player, statKey) === topValue;
}

function getPlayerInitials(player: PublicPlayerProfile) {
  return getPlayerLabel(player)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function StatisticsEmptyState({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <section className={cn("rr-panel max-w-[36rem] p-8", className)}>
      <div className="inline-flex h-12 w-12 items-center justify-center border border-[color:var(--rr-border-strong)] bg-[rgba(253,203,88,0.08)]">
        <BarChart3 className="h-5 w-5 text-[color:var(--rr-gold)]" strokeWidth={1.8} />
      </div>
      <h2 className="rr-display mt-5 text-[2.7rem] leading-none text-white">{title}</h2>
      <p className="mt-3 text-[1.05rem] text-[color:var(--rr-muted)]">{description}</p>
    </section>
  );
}

function getExpandedStats(
  player: PublicPlayerProfile,
  columns: StatsColumn[],
  excludedKeys: StatSortKey[],
) {
  return columns
    .filter(
      (column) =>
        column.key !== "player" &&
        column.key !== "matchesPlayed" &&
        !excludedKeys.includes(column.key),
    )
    .map((column) => ({
      key: column.key,
      label: column.label,
      value: formatStatValue(player, column.key),
    }));
}

function formDataToSearchParams(formData: FormData) {
  const params = new URLSearchParams();

  formData.forEach((value, key) => {
    if (typeof value === "string") {
      params.append(key, value);
    }
  });

  return params;
}
