import type { ReactNode } from "react";
import { PublicDataSourceIndicator } from "@/components/layout/public-data-source-indicator";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import type { PublicDataSourceInfo } from "@/lib/public/data-source";

type PublicSiteLayoutProps = {
  children: ReactNode;
  activeNav?: "home" | "primer-equipo" | "equipos" | "noticias";
  debugDataSource?: PublicDataSourceInfo;
};

export function PublicSiteLayout({
  children,
  activeNav,
  debugDataSource,
}: PublicSiteLayoutProps) {
  return (
    <div className="rr-shell flex min-h-screen flex-col">
      <PublicHeader activeKey={activeNav} />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      {debugDataSource ? (
        <PublicDataSourceIndicator dataSource={debugDataSource} />
      ) : null}
    </div>
  );
}
