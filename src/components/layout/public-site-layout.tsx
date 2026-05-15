import type { ReactNode } from "react";
import { PublicFooter } from "@/src/components/layout/public-footer";
import { PublicHeader } from "@/src/components/layout/public-header";

export function PublicSiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="rr-page-shell min-h-screen">
      <PublicHeader />
      <main className="mx-auto w-full max-w-[var(--rr-container)] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
