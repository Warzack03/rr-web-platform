export function getCountryFlagEmoji(countryCode?: string | null): string | null {
  if (!countryCode) {
    return null;
  }

  const normalizedCode = countryCode.trim().toUpperCase();

  if (!/^[A-Z]{2}$/.test(normalizedCode)) {
    return null;
  }

  return String.fromCodePoint(
    ...Array.from(normalizedCode, (letter) => 127397 + letter.charCodeAt(0)),
  );
}
