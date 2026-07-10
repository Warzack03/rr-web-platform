export type EditablePlayerFoot = "Derecha" | "Izquierda" | "Ambas";

export type AdminManagedPlayer = {
  id: string;
  publicName: string;
  slug: string;
  visible: boolean;
  active: boolean;
  photoUrl?: string;
  teamSlug: string;
  teamName: string;
  teamType: "first-team" | "academy";
  season: string;
  number: number;
  position: "POR" | "DEF" | "MED" | "DEL" | "BAN";
  foot: EditablePlayerFoot;
  country: string;
  matchesPlayed: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  mvp: number;
  goalsConceded: number;
  saves: number;
  cleanSheets: number;
  recoveries: number;
  shots: number;
  shotsOnTarget: number;
  ownGoals: number;
};

export function slugifyPlayerName(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeEditableFoot(value: string | null | undefined): EditablePlayerFoot {
  const normalizedValue = value?.trim().toUpperCase() ?? "";

  if (normalizedValue === "LEFT" || normalizedValue === "IZQUIERDA") {
    return "Izquierda";
  }

  if (normalizedValue === "BOTH" || normalizedValue === "AMBAS") {
    return "Ambas";
  }

  return "Derecha";
}

export function normalizeAdminPlayerPosition(value: string | null | undefined) {
  const normalizedValue = value?.trim().toUpperCase() ?? "";

  switch (normalizedValue) {
    case "GOALKEEPER":
    case "POR":
    case "PORTERO":
      return "POR" as const;
    case "DEFENDER":
    case "DEF":
    case "DEFENSA":
    case "DFC":
    case "LATERAL":
      return "DEF" as const;
    case "FORWARD":
    case "DEL":
    case "DELANTERO":
    case "DC":
      return "DEL" as const;
    case "BANDA":
    case "BAN":
    case "EXTREMO":
      return "BAN" as const;
    default:
      return "MED" as const;
  }
}
