import { SectionPlaceholder } from "@/components/admin/section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminMatchesPage() {
  await requireAdminSectionAccess("matches");

  return (
    <SectionPlaceholder
      eyebrow="Partidos"
      title="Gestion de partidos y resultados"
      description="La ruta queda disponible para `superadmin`, `manager` y entrenadores autorizados, lista para implementar la edicion de proximo partido, resultados y estado."
    />
  );
}
