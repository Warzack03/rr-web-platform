import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PublicEmptyState } from "@/components/public/public-empty-state";

export default function NotFound() {
  return (
    <PublicSiteLayout>
      <PublicEmptyState
        eyebrow="404"
        title="Pagina no encontrada"
        description="La pagina no existe o ya no esta disponible."
      />
    </PublicSiteLayout>
  );
}
