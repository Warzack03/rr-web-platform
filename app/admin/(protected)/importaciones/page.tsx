import { SectionPlaceholder } from "@/components/admin/section-placeholder";
import { requireAdminSectionAccess } from "@/server/auth/session";

export default async function AdminImportsPage() {
  await requireAdminSectionAccess("imports");

  return (
    <SectionPlaceholder
      eyebrow="Importaciones"
      title="Importacion desde rr-management"
      description="Solo `superadmin` puede entrar aqui. El flujo de subida, validacion, diff y aplicacion se construira en un paso posterior sobre esta ruta ya protegida."
    />
  );
}
