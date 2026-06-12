import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  LayoutTemplate,
} from "lucide-react";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import { AdminStatusBadge } from "@/components/admin/admin-status-badge";
import type { AdminRole } from "@/lib/admin/roles";
import { getSectionOverview } from "@/lib/admin/mock-data";

type AdminSectionOverviewProps = {
  section: string;
  role: AdminRole;
};

type SectionMeta = {
  status: "preview" | "active";
  supportCopy: string;
  recommendations: Array<{ href: string; label: string }>;
};

const sectionMetaMap: Record<string, SectionMeta> = {
  temporadas: {
    status: "preview",
    supportCopy:
      "Este modulo aun funciona como vista previa de alcance. Sirve para validar estructura, tono y prioridades antes de implementar el flujo completo.",
    recommendations: [
      { href: "/admin/equipos", label: "Seguir con equipos" },
      { href: "/admin/partidos", label: "Ir a partidos" },
    ],
  },
  jugadores: {
    status: "preview",
    supportCopy:
      "La base de informacion ya esta definida, pero la operativa completa de jugadores todavia no esta construida en esta ruta.",
    recommendations: [
      { href: "/admin/equipos", label: "Ver equipos" },
      { href: "/admin/estadisticas", label: "Ir a estadisticas" },
    ],
  },
  asignaciones: {
    status: "preview",
    supportCopy:
      "Esta pantalla resume el alcance del modulo, pero aun no debe interpretarse como flujo cerrado de trabajo.",
    recommendations: [
      { href: "/admin/equipos", label: "Ver equipos" },
      { href: "/admin/clasificaciones", label: "Ir a clasificaciones" },
    ],
  },
  noticias: {
    status: "preview",
    supportCopy:
      "Noticias sigue visible por relevancia de producto, pero la ruta todavia es una vista previa y no un editor final.",
    recommendations: [
      { href: "/admin", label: "Volver al dashboard" },
      { href: "/admin/media", label: "Revisar media" },
    ],
  },
  media: {
    status: "preview",
    supportCopy:
      "Media aun no tiene biblioteca operativa completa. Usa esta pantalla solo como referencia de alcance y prioridades.",
    recommendations: [
      { href: "/admin/noticias", label: "Ver noticias" },
      { href: "/admin/equipos", label: "Ver equipos" },
    ],
  },
  importaciones: {
    status: "preview",
    supportCopy:
      "Importaciones muestra el proceso esperado, pero todavia no es un flujo listo para operacion real desde esta UI.",
    recommendations: [
      { href: "/admin", label: "Volver al dashboard" },
      { href: "/admin/usuarios", label: "Ver usuarios" },
    ],
  },
  usuarios: {
    status: "preview",
    supportCopy:
      "Usuarios se mantiene visible para fijar el alcance del rol superadmin, pero sigue en modo vista previa.",
    recommendations: [
      { href: "/admin", label: "Volver al dashboard" },
      { href: "/admin/equipos", label: "Ver equipos" },
    ],
  },
};

function getSectionMeta(section: string): SectionMeta {
  return (
    sectionMetaMap[section] ?? {
      status: "active",
      supportCopy:
        "Modulo operativo dentro del flujo principal del backoffice.",
      recommendations: [{ href: "/admin", label: "Volver al dashboard" }],
    }
  );
}

export function AdminSectionOverview({
  section,
  role,
}: AdminSectionOverviewProps) {
  const overview = getSectionOverview(section, role);
  const sectionMeta = getSectionMeta(section);
  const isPreview = sectionMeta.status === "preview";

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow={isPreview ? "Vista previa" : overview.eyebrow}
        title={overview.title}
        description={
          isPreview
            ? `${overview.description} Esta ruta aun no forma parte del flujo operativo principal.`
            : overview.description
        }
        actions={
          <Link
            href="/admin"
            className="rr-button rr-button-secondary text-[0.84rem]"
          >
            Volver al dashboard
          </Link>
        }
      />

      {isPreview ? (
        <AdminPanel className="border-[rgba(253,203,88,0.24)] p-5 sm:p-6">
          <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <AdminStatusBadge label="Preview" tone="gold" />
                <p className="rr-kicker text-[color:var(--rr-gold)]">
                  Modulo no operativo todavia
                </p>
              </div>
              <h2 className="text-[1.3rem] font-semibold text-white">
                Esta ruta existe para validar alcance, no para operar el dia a dia
              </h2>
              <p className="text-[0.95rem] leading-6 text-[color:var(--rr-muted)]">
                {sectionMeta.supportCopy}
              </p>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4">
                <div className="flex items-center gap-3">
                  <LayoutTemplate className="h-4.5 w-4.5 text-[color:var(--rr-gold)]" />
                  <p className="text-[0.95rem] font-semibold text-white">
                    Lo que si puedes hacer aqui
                  </p>
                </div>
                <p className="mt-2 text-[0.9rem] leading-6 text-[color:var(--rr-muted)]">
                  Revisar estructura, nombres, campos clave y prioridades antes de construir el flujo final.
                </p>
              </div>
              <div className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4.5 w-4.5 text-[color:var(--rr-gold)]" />
                  <p className="text-[0.95rem] font-semibold text-white">
                    Lo que no deberia parecer
                  </p>
                </div>
                <p className="mt-2 text-[0.9rem] leading-6 text-[color:var(--rr-muted)]">
                  Un CRUD terminado o un modulo listo para operacion diaria.
                </p>
              </div>
            </div>
          </div>
        </AdminPanel>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        {overview.metrics.map((metric) => (
          <AdminMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            tone={metric.tone}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        {overview.highlights.map((group, index) => (
          <AdminPanel key={group.title} className="p-5 sm:p-6">
            <div className="space-y-4">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">
                  {index === 0 ? "Alcance definido" : "Puntos a construir"}
                </p>
                <h2 className="mt-2 text-[1.28rem] font-semibold text-white">
                  {group.title}
                </h2>
              </div>
              <div className="grid gap-3">
                {group.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4 text-[0.94rem] leading-6 text-[color:var(--rr-muted)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </AdminPanel>
        ))}

        <AdminPanel className="p-5 sm:p-6">
          <div className="space-y-4">
            <div>
              <p className="rr-kicker text-[color:var(--rr-gold)]">
                Siguiente destino
              </p>
              <h2 className="mt-2 text-[1.28rem] font-semibold text-white">
                Vuelve a un modulo operativo
              </h2>
              <p className="mt-2 text-[0.92rem] leading-6 text-[color:var(--rr-muted)]">
                Para mantener foco y confianza, salta desde aqui a una ruta ya operativa del backoffice.
              </p>
            </div>

            <div className="grid gap-3">
              {sectionMeta.recommendations.map((recommendation) => (
                <Link
                  key={recommendation.href}
                  href={recommendation.href}
                  className="flex min-h-12 items-center justify-between rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-3 text-[0.94rem] text-white transition hover:border-[rgba(253,203,88,0.24)] hover:bg-[rgba(255,255,255,0.06)]"
                >
                  <span>{recommendation.label}</span>
                  <ArrowRight className="h-4 w-4 text-[color:var(--rr-gold)]" />
                </Link>
              ))}
            </div>

            <div className="rounded-[10px] border border-white/10 bg-white/4 px-4 py-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4.5 w-4.5 text-[color:var(--rr-gold)]" />
                <p className="text-[0.95rem] font-semibold text-white">
                  Criterio de confianza
                </p>
              </div>
              <p className="mt-2 text-[0.9rem] leading-6 text-[color:var(--rr-muted)]">
                Las rutas preview siguen visibles por alcance de producto, pero ya no se presentan como pantallas cerradas.
              </p>
            </div>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
