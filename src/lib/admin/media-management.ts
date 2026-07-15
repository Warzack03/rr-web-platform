export const adminMediaUsageValues = [
  "PLAYER_PHOTO",
  "PLAYER_CARD",
  "TEAM_LOGO",
  "TEAM_BANNER",
  "NEWS_COVER",
  "OPPONENT_LOGO",
  "OTHER",
] as const;

export type AdminMediaUsage = (typeof adminMediaUsageValues)[number];
export type AdminMediaSource = "local" | "external";

export type AdminMediaPickerItem = {
  id: string;
  label: string;
  usage: AdminMediaUsage;
  usageLabel: string;
  publicUrl: string;
  altText: string;
  mimeType?: string;
  sizeBytes?: number;
  width?: number;
  height?: number;
};

export type AdminMediaItem = AdminMediaPickerItem & {
  createdAtIso: string;
  createdAtLabel: string;
  uploadedByName: string;
  storagePath?: string;
  source: AdminMediaSource;
  referenceCount: number;
  referenceSummary: string[];
  canDelete: boolean;
};

export function isAdminMediaUsage(value: string): value is AdminMediaUsage {
  return adminMediaUsageValues.includes(value as AdminMediaUsage);
}

export function getAdminMediaUsageLabel(usage: AdminMediaUsage) {
  switch (usage) {
    case "PLAYER_PHOTO":
      return "Foto jugador";
    case "PLAYER_CARD":
      return "Cromo";
    case "TEAM_LOGO":
      return "Logo equipo";
    case "TEAM_BANNER":
      return "Banner equipo";
    case "NEWS_COVER":
      return "Portada noticia";
    case "OPPONENT_LOGO":
      return "Logo rival";
    case "OTHER":
      return "General";
  }
}

export function getAdminMediaUsageNote(usage: AdminMediaUsage) {
  switch (usage) {
    case "PLAYER_PHOTO":
      return "Base visual para ficha publica y cromo.";
    case "PLAYER_CARD":
      return "Recursos premium o composiciones de cromo.";
    case "TEAM_LOGO":
      return "Escudos y marcas de equipo.";
    case "TEAM_BANNER":
      return "Cabeceras y bloques principales de equipo.";
    case "NEWS_COVER":
      return "Imagen principal de noticias.";
    case "OPPONENT_LOGO":
      return "Escudos de rivales para partidos.";
    case "OTHER":
      return "Imagen publica general sin categoria cerrada.";
  }
}

export function getAdminMediaUsageFolder(usage: AdminMediaUsage) {
  switch (usage) {
    case "PLAYER_PHOTO":
      return "players/photos";
    case "PLAYER_CARD":
      return "players/cards";
    case "TEAM_LOGO":
      return "teams/logos";
    case "TEAM_BANNER":
      return "teams/banners";
    case "NEWS_COVER":
      return "news/covers";
    case "OPPONENT_LOGO":
      return "matches/opponents";
    case "OTHER":
      return "general";
  }
}

export function deriveMediaLabelFromPath(pathOrUrl: string) {
  const cleanedPath = pathOrUrl.split("?")[0] ?? pathOrUrl;
  const fileName = cleanedPath.split("/").pop() ?? cleanedPath;
  const label = fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim();

  if (!label) {
    return "Recurso sin nombre";
  }

  return label.replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatMediaBytes(value: number | null | undefined) {
  if (!value || value <= 0) {
    return "Sin dato";
  }

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}
