"use client";

import { PublicSiteLayout } from "@/components/layout/public-site-layout";
import { PublicErrorState } from "@/components/public/public-error-state";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <PublicSiteLayout>
      <PublicErrorState onRetry={reset} />
    </PublicSiteLayout>
  );
}
