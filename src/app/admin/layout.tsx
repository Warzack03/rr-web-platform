import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

type AdminRootLayoutProps = {
  children: ReactNode;
};

export default function AdminRootLayout({ children }: AdminRootLayoutProps) {
  return children;
}
