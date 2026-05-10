import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin | Rising Raimon",
    template: "%s | Admin | Rising Raimon",
  },
};

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
