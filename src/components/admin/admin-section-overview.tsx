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
  status: "mock" | "active";
  supportCopy: string;
  recommendations: Array<{ href: string; label: string }>;
};

const sectionMetaMap: Record<string, SectionMeta> = {
  temporadas: {
    status: "mock",
    supportCopy:
      "Mock de alcance para validar temporada activa, historico y calendario antes de conectar datos reales.",
    recommendations: [
      { href: "/admin/equipos", label: "Seguir con equipos" },
      { href: "/admin/partidos", label: "Ir a partidos" },
    ],
  },
  jugadores: {
    status: "mock",
    supportCopy:
      "Aqui se define lo que necesitas para perfiles y cromos: foto, dorsal, nombre publico, posicion, pais, pie, visibilidad y stats visibles.",
    recommendations: [
      { href: "/admin/equipos", label: "Ver equipos" },
      { href: "/admin/estadisticas", label: "Ir a estadisticas" },
    ],
  },
  asignaciones: {
    status: "mock",
    supportCopy:
      "Mock para ordenar jugadores por equipo y temporada sin mover historicos ni estadisticas ya registradas.",
    recommendations: [
      { href: "/admin/equipos", label: "Ver equipos" },
      { href: "/admin/clasificaciones", label: "Ir a clasificaciones" },
    ],
  },
  noticias: {
    status: "mock",
    supportCopy:
      "Mock del editor de actualidad para portada, equipo relacionado, cover, extracto y video externo cuando proceda.",
    recommendations: [
      { href: "/admin", label: "Volver al dashboard" },
      { href: "/admin/media", label: "Revisar media" },
    ],
  },
  media: {
    status: "mock",
    supportCopy:
      "Mock de biblioteca visual para fotos de jugador, logos, banners, covers y placeholders.",
    recommendations: [
      { href: "/admin/noticias", label: "Ver noticias" },
      { href: "/admin/equipos", label: "Ver equipos" },
    ],
  },
  importaciones: {
    status: "mock",
    supportCopy:
      "Mock del futuro flujo de importacion con validacion, diff y merge seguro desde rr-management.",
    recommendations: [
      { href: "/admin", label: "Volver al dashboard" },
      { href: "/admin/usuarios", label: "Ver usuarios" },
    ],
  },
  usuarios: {
    status: "mock",
    supportCopy:
      "Este modulo queda fuera del nuevo enfoque de administrador unico y no debe aparecer como trabajo principal.",
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
  const isMock = sectionMeta.status === "mock";

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow={isMock ? "Mock de alcance" : overview.eyebrow}
        title={overview.title}
        description={
          isMock
            ? `${overview.description} Esta ruta todavia usa mocks para cerrar campos y prioridades.`
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

      {isMock ? (
        <AdminPanel className="border-[rgba(253,203,88,0.24)] p-5 sm:p-6">
          <div className="grid gap-5 xl:grid-cols-[1.12fr_0.88fr]">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <AdminStatusBadge label="Mock" tone="gold" />
                <p className="rr-kicker text-[color:var(--rr-gold)]">
                  Mock antes de datos reales
                </p>
              </div>
              <h2 className="text-[1.3rem] font-semibold text-white">
                Esta ruta existe para decidir que controlar y como editarlo
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
                  Revisar estructura, campos clave, prioridades y como se reflejara despues en la web publica.
                </p>
              </div>
              <div className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-4.5 w-4.5 text-[color:var(--rr-gold)]" />
                  <p className="text-[0.95rem] font-semibold text-white">
                    Lo que no toca todavia
                  </p>
                </div>
                <p className="mt-2 text-[0.9rem] leading-6 text-[color:var(--rr-muted)]">
                  Guardado real, subida final de archivos o integracion definitiva con base de datos.
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
                Siguiente modulo recomendado
              </h2>
              <p className="mt-2 text-[0.92rem] leading-6 text-[color:var(--rr-muted)]">
                Sigue el flujo natural del administrador unico sin depender de roles.
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
                Mientras sigamos con mocks, la pantalla debe servir para validar el modelo de datos y el flujo de uso.
              </p>
            </div>
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}
