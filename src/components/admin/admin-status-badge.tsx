import { cn } from "@/lib/utils";

type AdminStatusBadgeProps = {
  label: string;
  tone?: "gold" | "blue" | "slate" | "danger" | "success";
  pulse?: boolean;
};

const toneClasses: Record<NonNullable<AdminStatusBadgeProps["tone"]>, string> = {
  gold: "border-[rgba(243,203,69,0.34)] bg-[rgba(243,203,69,0.12)] text-[color:var(--rr-gold)]",
  blue: "border-[rgba(107,159,255,0.34)] bg-[rgba(107,159,255,0.12)] text-[#b8d3ff]",
  slate: "border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] text-[color:var(--rr-muted)]",
  danger: "border-[rgba(221,108,112,0.34)] bg-[rgba(221,108,112,0.14)] text-[#ffc1c4]",
  success: "border-[rgba(70,185,123,0.32)] bg-[rgba(70,185,123,0.16)] text-[#b8ffd8]",
};

export function AdminStatusBadge({
  label,
  tone = "slate",
  pulse = false,
}: AdminStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 whitespace-nowrap items-center gap-2 rounded-full border px-3 py-1.5 text-[0.76rem] font-semibold",
        toneClasses[tone],
      )}
    >
      {pulse ? (
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-current opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-current" />
        </span>
      ) : null}
      {label}
    </span>
  );
}
