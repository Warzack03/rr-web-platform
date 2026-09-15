const MADRID_TIME_ZONE = "Europe/Madrid";

function getMadridParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: MADRID_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = new Map(parts.map((part) => [part.type, part.value]));

  return {
    year: Number(values.get("year")),
    month: Number(values.get("month")),
    day: Number(values.get("day")),
    hour: Number(values.get("hour")),
    minute: Number(values.get("minute")),
    second: Number(values.get("second")),
  };
}

export function formatMadridDateInput(date: Date | null) {
  if (!date) return "";
  const parts = getMadridParts(date);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

export function formatMadridTimeInput(date: Date | null) {
  if (!date) return "";
  const parts = getMadridParts(date);
  return `${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}`;
}

export function buildMadridDateTime(date: string, time = "12:00") {
  if (!date) return null;

  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = (time || "12:00").split(":").map(Number);
  const wallClockUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  let utcTimestamp = wallClockUtc;

  for (let iteration = 0; iteration < 2; iteration += 1) {
    const madrid = getMadridParts(new Date(utcTimestamp));
    const renderedAsUtc = Date.UTC(
      madrid.year,
      madrid.month - 1,
      madrid.day,
      madrid.hour,
      madrid.minute,
      madrid.second,
    );
    utcTimestamp -= renderedAsUtc - wallClockUtc;
  }

  return new Date(utcTimestamp);
}
