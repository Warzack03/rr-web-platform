export type TeamsPageHeroContent = {
  chip: string;
  title: string;
  description: string;
};

export type FeaturedFirstTeamContent = {
  sectionTitle: string;
  eyebrow: string;
  name: string;
  description: string;
  primaryCta: {
    href: string;
    label: string;
  };
  secondaryCta: {
    href: string;
    label: string;
  };
};

export type AcademyTeamCardContent = {
  slug: string;
  category: string;
  name: string;
  competition: string;
  description: string;
  ctaLabel: string;
  featured?: boolean;
  accent?: "blue" | "slate";
};

export type AcademyPromoContent = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  href: string;
};

export type TeamsDirectoryContent = {
  hero: TeamsPageHeroContent;
  featuredFirstTeam: FeaturedFirstTeamContent;
  academy: {
    title: string;
    chip: string;
    teams: AcademyTeamCardContent[];
    promo: AcademyPromoContent;
  };
};

const TEAMS_DIRECTORY_CONTENT: TeamsDirectoryContent = {
  hero: {
    chip: "Estructura deportiva",
    title: "Nuestros Equipos",
    description:
      "Del primer equipo a la base, una estructura pensada para competir, formar y dar continuidad al estilo Rising Raimon.",
  },
  featuredFirstTeam: {
    sectionTitle: "Primer Equipo",
    eyebrow: "Plantilla profesional",
    name: "Rising Raimon",
    description:
      "El bloque que marca el ritmo del club. Maxima exigencia, identidad competitiva y una plantilla preparada para sostener el nivel cada jornada.",
    primaryCta: {
      href: "/primer-equipo/plantilla",
      label: "Ver plantilla completa",
    },
    secondaryCta: {
      href: "/primer-equipo/calendario",
      label: "Calendario",
    },
  },
  academy: {
    title: "Cantera",
    chip: "Academia de alto rendimiento",
    teams: [
      {
        slug: "raimon-b",
        category: "Filial",
        name: "Raimon B",
        competition: "Entorno competitivo senior",
        description:
          "El paso previo al profesionalismo para acelerar el crecimiento de nuestras mejores promesas.",
        ctaLabel: "Ver plantilla",
        featured: true,
        accent: "blue",
      },
      {
        slug: "juvenil-a",
        category: "Sub-19 nacional",
        name: "Juvenil A",
        competition: "Division de Honor",
        description:
          "Maximo nivel juvenil para consolidar automatismos, ritmo de partido y competitividad.",
        ctaLabel: "Ver plantilla",
        accent: "slate",
      },
      {
        slug: "juvenil-b",
        category: "Sub-18 regional",
        name: "Juvenil B",
        competition: "Liga Nacional Juvenil",
        description:
          "Grupo orientado a sostener volumen de juego, intensidad tactica y progresion sostenida.",
        ctaLabel: "Ver plantilla",
        accent: "slate",
      },
      {
        slug: "cadete-a",
        category: "Sub-16",
        name: "Cadete A",
        competition: "Division Autonomica",
        description: "Base competitiva para crecer con orden, lectura de juego y personalidad.",
        ctaLabel: "Explorar equipo",
        accent: "slate",
      },
      {
        slug: "infantil-a",
        category: "Sub-14",
        name: "Infantil A",
        competition: "Division Autonomica",
        description:
          "Primeras grandes exigencias del modelo formativo, con foco en tecnica y toma de decision.",
        ctaLabel: "Explorar equipo",
        accent: "slate",
      },
    ],
    promo: {
      eyebrow: "Metodologia",
      title: "Futuro Raimon",
      description:
        "Una cantera conectada por principios comunes para que cada categoria impulse la siguiente.",
      ctaLabel: "Ver infantil A",
      href: "/equipos/infantil-a",
    },
  },
};

export function getTeamsDirectoryContent(): TeamsDirectoryContent {
  return TEAMS_DIRECTORY_CONTENT;
}
