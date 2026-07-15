export type PublicDataSource = "db" | "mock" | "mixed";

export type PublicDataSourceInfo = {
  source: PublicDataSource;
  note?: string;
};

export function resolveMixedSource(sources: PublicDataSource[]): PublicDataSource {
  const uniqueSources = new Set(sources);

  if (uniqueSources.has("mixed")) {
    return "mixed";
  }

  if (uniqueSources.size === 1) {
    return sources[0] ?? "mock";
  }

  return "mixed";
}
