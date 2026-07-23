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

export type TeamsDirectorySectionContent = {
  title: string;
  chip: string;
  teams: AcademyTeamCardContent[];
  promo?: AcademyPromoContent;
};

export type TeamsDirectoryContent = {
  hero: TeamsPageHeroContent;
  featuredFirstTeam: FeaturedFirstTeamContent;
  academy: TeamsDirectorySectionContent;
  catalunya?: TeamsDirectorySectionContent;
};
