import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rising Raimon",
    template: "%s | Rising Raimon",
  },
  description: "Plataforma web publica y backoffice deportivo de Rising Raimon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
