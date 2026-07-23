import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PublicLoadingState } from "@/components/public/public-loading-state";

export default function Loading() {
  return (
    <PublicSiteLayout>
      <PublicLoadingState />
    </PublicSiteLayout>
  );
}
