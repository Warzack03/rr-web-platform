import { CalendarClock, FileWarning, Newspaper, ShieldAlert, Users } from "lucide-react";
import { roleLabels } from "@/server/auth/permissions";
import { requireAdminSectionAccess } from "@/server/auth/session";
import { getAdminDashboardData } from "@/server/services/admin-dashboard";

function formatDate(date: Date | null) {
  if (!date) {
    return "Sin fecha";
  }

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Madrid",
  }).format(date);
}

export default async function AdminDashboardPage() {
  const user = await requireAdminSectionAccess("dashboard");
  const data = await getAdminDashboardData(user);

  const cards = [
    {
      title: "Temporada activa",
      value: data.activeSeasonName ?? "Sin definir",
      helper: roleLabels[user.role],
      icon: CalendarClock,
    },
    {
      title: user.role === "COACH" ? "Equipos asignados" : "Equipos visibles",
      value: String(data.teamCount),
      helper:
        user.role === "COACH"
          ? data.assignedTeams.join(", ") || "Sin equipos"
          : "Temporada actual",
      icon: Users,
    },
    {
      title: "Partidos pendientes",
      value: String(data.pendingResultsCount),
      helper: "Seguimiento",
      icon: FileWarning,
    },
    {
      title: user.role === "COACH" ? "Alcance del rol" : "Noticias en borrador",
      value: user.role === "COACH" ? "Limitado" : String(data.draftNewsCount ?? 0),
      helper:
        user.role === "COACH"
          ? "Tus equipos"
          : "Pendientes",
      icon: Newspaper,
    },
  ];

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300/90">
          Dashboard
        </p>
        <div className="space-y-3">
          <h1 className="max-w-4xl text-4xl font-semibold text-white xl:text-[3.2rem]">
            Panel interno
          </h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 xl:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">{card.title}</p>
                  <p className="mt-3 text-3xl font-semibold text-white">{card.value}</p>
                </div>
                <div className="rounded-2xl bg-amber-400/10 p-3 text-amber-200">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{card.helper}</p>
            </article>
          );
        })}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 xl:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-white">Proximos partidos</h2>
            </div>
          </div>

          {data.upcomingMatches.length > 0 ? (
            <div className="space-y-3">
              {data.upcomingMatches.map((match) => (
                <article
                  key={match.id}
                  className="rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-5"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-base font-semibold text-white">{match.teamName}</p>
                      <p className="mt-1 text-sm text-slate-400">vs {match.opponentName}</p>
                    </div>
                    <div className="text-sm text-slate-300">{formatDate(match.dateTime)}</div>
                  </div>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.22em] text-amber-200/90">
                    {match.status}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/45 p-5 text-sm text-slate-400">
              No hay partidos proximos dentro del alcance actual del usuario.
            </div>
          )}
        </section>

        <section className="space-y-6">
          <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 xl:p-7">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-400/10 p-3 text-amber-200">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Estado de acceso</h2>
                <p className="mt-1 text-sm text-slate-400">Protegido</p>
              </div>
            </div>
          </article>

          {data.lastImportLabel ? (
            <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 xl:p-7">
              <p className="text-sm font-semibold text-white">Ultima importacion</p>
              <p className="mt-3 text-sm leading-7 text-slate-400">{data.lastImportLabel}</p>
            </article>
          ) : null}
        </section>
      </div>
    </section>
  );
}
