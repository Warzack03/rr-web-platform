import { SectionPlaceholder } from "@/components/admin/section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminPlayersPage() {
  await requireAdminSectionAccess("players");

  return (
    <SectionPlaceholder
      eyebrow="Jugadores"
      title="Gestion de jugadores publicables"
      description="La base de autenticacion deja esta ruta lista para el futuro CRUD de jugadores y sus campos publicos, sin exponer datos privados."
    />
  );
}
