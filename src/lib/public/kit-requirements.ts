const SECOND_KIT_AWAY_OPPONENTS = new Set([
  "senior-c",
  "seniorc",
  "uranus-fc",
  "uranus-f-c",
  "uranus-futbol-club",
  "latan",
]);

function normalizeTeamName(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function requiresSecondKitForAwayMatch(input: {
  isOwnTeamHome: boolean;
  opponentName: string;
}) {
  return (
    !input.isOwnTeamHome &&
    SECOND_KIT_AWAY_OPPONENTS.has(normalizeTeamName(input.opponentName))
  );
}
