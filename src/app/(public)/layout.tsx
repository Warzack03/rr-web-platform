import type { ReactNode } from "react";
import { PublicSiteLayout } from "@/src/components/layout/public-site-layout";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return <PublicSiteLayout>{children}</PublicSiteLayout>;
}
