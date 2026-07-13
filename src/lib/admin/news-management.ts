export const adminNewsStatusValues = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export const ADMIN_NEWS_GENERAL_TEAM_ID = "__general__";
export const ADMIN_NEWS_GENERAL_TEAM_LABEL = "General";

export type AdminNewsStatus = (typeof adminNewsStatusValues)[number];

export type AdminNewsTeamOption = {
  id: string;
  slug: string;
  name: string;
  season: string;
  isFirstTeam: boolean;
};

export type AdminManagedNewsPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  bodyMarkdown: string;
  externalVideoUrl?: string;
  coverMediaId?: string;
  coverUrl?: string;
  coverAltText?: string;
  status: AdminNewsStatus;
  featured: boolean;
  publishedAt?: string;
  publishedAtLabel: string;
  updatedAtLabel: string;
  authorName: string;
  relatedTeamIds: string[];
  relatedTeamLabels: string[];
};

export function slugifyNewsTitle(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getAdminNewsStatusLabel(status: AdminNewsStatus) {
  switch (status) {
    case "DRAFT":
      return "Borrador";
    case "PUBLISHED":
      return "Publicada";
    case "ARCHIVED":
      return "Archivada";
  }
}

export function toDateTimeLocalValue(date: Date | null | undefined) {
  if (!date) {
    return "";
  }

  const offsetMs = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 16);
}
