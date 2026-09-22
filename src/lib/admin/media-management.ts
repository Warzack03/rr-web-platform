export const adminMediaUsageValues = [
  "PLAYER_PHOTO",
  "PLAYER_CARD",
  "PLAYER_STATS",
  "TEAM_LOGO",
  "TEAM_LISTING",
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
      return "Cromo jugador";
    case "PLAYER_STATS":
      return "Jugador estadística";
    case "TEAM_LOGO":
      return "Logo equipo";
    case "TEAM_LISTING":
      return "Imagen listado equipo";
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
      return "Imagen principal del detalle publico del jugador.";
    case "PLAYER_CARD":
      return "Imagen del jugador usada solo en su cromo.";
    case "PLAYER_STATS":
      return "Retrato de cara y pecho para las tablas de estadisticas.";
    case "TEAM_LOGO":
      return "Escudos y marcas de equipo.";
    case "TEAM_LISTING":
      return "Portada 3:2 para la tarjeta del listado de equipos.";
    case "TEAM_BANNER":
      return "Cabecera panoramica del detalle del equipo.";
    case "NEWS_COVER":
      return "Imagen principal de noticias.";
    case "OPPONENT_LOGO":
      return "Escudos de rivales para partidos y clasificaciones.";
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
    case "PLAYER_STATS":
      return "players/stats";
    case "TEAM_LOGO":
      return "teams/logos";
    case "TEAM_LISTING":
      return "teams/listing";
    case "TEAM_BANNER":
      return "teams/banners";
    case "NEWS_COVER":
      return "news/covers";
    case "OPPONENT_LOGO":
      return "opponents/logos";
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
