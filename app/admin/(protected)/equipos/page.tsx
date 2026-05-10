import { SectionPlaceholder } from "@/components/admin/section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminTeamsPage() {
  await requireAdminSectionAccess("teams");

  return (
    <SectionPlaceholder
      eyebrow="Equipos"
      title="Gestion de equipos"
      description="La creacion y edicion de equipos todavia no se implementa, pero la ruta y el layout ya respetan que solo `superadmin` y `manager` puedan acceder aqui."
    />
  );
}
