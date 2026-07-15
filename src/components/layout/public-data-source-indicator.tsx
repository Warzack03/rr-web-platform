import type { PublicDataSourceInfo } from "@/lib/public/data-source";
import { cn } from "@/lib/utils";

type PublicDataSourceIndicatorProps = {
  dataSource: PublicDataSourceInfo;
};

const SOURCE_CONFIG = {
  db: {
    label: "DB",
    className:
      "border-emerald-400/35 bg-emerald-500/10 text-emerald-100",
  },
  mock: {
    label: "MOCK",
    className:
      "border-amber-400/35 bg-amber-500/10 text-amber-100",
  },
  mixed: {
    label: "MIXED",
    className:
      "border-sky-400/35 bg-sky-500/10 text-sky-100",
  },
} as const;

export function PublicDataSourceIndicator({
  dataSource,
}: PublicDataSourceIndicatorProps) {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  const config = SOURCE_CONFIG[dataSource.source];

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[70]">
      <div
        className={cn(
          "flex items-center gap-2 border px-3 py-2 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur",
          config.className,
        )}
      >
        <span className="rr-kicker text-[0.68rem] tracking-[0.18em] text-current/80">
          DEV
        </span>
        <span className="rr-kicker text-[0.72rem] text-current">
          {config.label}
        </span>
        {dataSource.note ? (
          <span className="text-[0.8rem] text-current/80">{dataSource.note}</span>
        ) : null}
      </div>
    </div>
  );
}
