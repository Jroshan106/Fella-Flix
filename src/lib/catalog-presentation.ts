const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Colombo", year: "numeric", month: "2-digit", day: "2-digit",
});

export function todayInColombo(now = new Date()): string {
  const parts = dateFormatter.formatToParts(now);
  return ["year", "month", "day"].map(type => parts.find(part => part.type === type)!.value).join("-");
}

export function isUpcoming(releaseDate: string, today = todayInColombo()): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(releaseDate)) return false;
  const timestamp = Date.parse(`${releaseDate}T00:00:00Z`);
  return Number.isFinite(timestamp) && new Date(timestamp).toISOString().slice(0, 10) === releaseDate && releaseDate > today;
}

export function parseGenreIds(value: unknown): string[] {
  return typeof value === "string" && /^\d+(,\d+)*$/.test(value) && value.length <= 200
    ? [...new Set(value.split(","))] : [];
}
