export type FooterLink = {
  href: string;
  label: string;
};

export type FooterSocialLink = FooterLink & {
  kind: "instagram" | "tiktok" | "youtube";
};

export type FooterSponsor = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const publicFooterLegalLinks: FooterLink[] = [
  {
    href: "/politica-de-privacidad",
    label: "Politica de privacidad",
  },
  {
    href: "/politica-de-cookies",
    label: "Politica de cookies",
  },
];

export const publicFooterSocialLinks: FooterSocialLink[] = [
  {
    href: "https://www.instagram.com/risingraimon/",
    label: "Instagram",
    kind: "instagram",
  },
  {
    href: "https://www.tiktok.com/@risingraimon",
    label: "TikTok",
    kind: "tiktok",
  },
  {
    href: "https://www.youtube.com/@RisingRaimon",
    label: "YouTube",
    kind: "youtube",
  },
];

export const publicFooterSponsors: FooterSponsor[] = [
  {
    src: "/media/sponsors/charly.png",
    alt: "Logo de Charly",
    width: 112,
    height: 112,
  },
  {
    src: "/media/sponsors/manitu.png",
    alt: "Logo de Manitu",
    width: 180,
    height: 102,
  },
  {
    src: "/media/sponsors/manex.png",
    alt: "Logo de Manex",
    width: 160,
    height: 62,
  },
  {
    src: "/media/sponsors/juanma.png",
    alt: "Logo de Juanma",
    width: 108,
    height: 108,
  },
  {
    src: "/media/sponsors/laflame.png",
    alt: "Logo de La Flame",
    width: 150,
    height: 84,
  },
  {
    src: "/media/sponsors/maggie.png",
    alt: "Logo de Maggie",
    width: 150,
    height: 84,
  },
];

export const publicFooterCopyright =
  "(c) 2026 Rising Raimon. Todos los derechos reservados.";
