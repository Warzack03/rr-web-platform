import type { ReactNode } from "react";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";

type PublicSiteLayoutProps = {
  children: ReactNode;
  activeNav?: "home" | "primer-equipo" | "equipos" | "noticias";
};

export function PublicSiteLayout({
  children,
  activeNav,
}: PublicSiteLayoutProps) {
  return (
    <div className="rr-shell flex min-h-screen flex-col">
      <PublicHeader activeKey={activeNav} />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}
