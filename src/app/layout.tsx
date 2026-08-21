import type { Metadata, Viewport } from "next";
import {
  DEFAULT_SITE_DESCRIPTION,
  SITE_NAME,
  getAbsoluteUrl,
  getMetadataBase,
} from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: `${SITE_NAME} | Home`,
    template: `${SITE_NAME} | %s`,
  },
  description: DEFAULT_SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${SITE_NAME} | Home`,
    description: DEFAULT_SITE_DESCRIPTION,
    url: getAbsoluteUrl("/"),
    siteName: SITE_NAME,
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: getAbsoluteUrl("/images/rr-og-card.svg"),
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Home`,
    description: DEFAULT_SITE_DESCRIPTION,
    images: [getAbsoluteUrl("/images/rr-og-card.svg")],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
