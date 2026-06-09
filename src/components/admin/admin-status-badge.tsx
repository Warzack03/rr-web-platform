import { cn } from "@/lib/utils";

type AdminStatusBadgeProps = {
  label: string;
  tone?: "gold" | "blue" | "slate" | "danger" | "success";
  pulse?: boolean;
};

const toneClasses: Record<NonNullable<AdminStatusBadgeProps["tone"]>, string> = {
  gold: "border-[rgba(253,203,88,0.32)] bg-[rgba(253,203,88,0.12)] text-[color:var(--rr-gold)]",
  blue: "border-[rgba(52,112,200,0.34)] bg-[rgba(52,112,200,0.12)] text-[#9fc4ff]",
  slate: "border-[rgba(255,255,255,0.14)] bg-[rgba(255,255,255,0.06)] text-[color:var(--rr-muted)]",
  danger: "border-[rgba(255,122,122,0.3)] bg-[rgba(214,64,69,0.14)] text-[#ffb4ab]",
  success: "border-[rgba(151,255,199,0.24)] bg-[rgba(31,98,64,0.24)] text-[#b8ffd8]",
};

export function AdminStatusBadge({
  label,
  tone = "slate",
  pulse = false,
}: AdminStatusBadgeProps) {
  return (
    <span
      className={cn(
        "rr-kicker inline-flex min-h-8 items-center gap-2 border px-3 py-1.5 text-[0.72rem]",
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
