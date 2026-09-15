export function normalizeOpponentName(value: string) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es");
}

export function buildOpponentSlug(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "rival";
}
