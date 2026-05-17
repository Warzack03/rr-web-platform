import { cn } from "@/lib/utils";

type AdminStatusBadgeProps = {
  value: string;
};

export function AdminStatusBadge({ value }: AdminStatusBadgeProps) {
  const normalized = value.toLowerCase();

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
        normalized.includes("activo") ||
          normalized.includes("aplicado") ||
          normalized.includes("publicada") ||
          normalized.includes("publicado")
          ? "border-[rgba(134,239,172,0.28)] bg-[rgba(134,239,172,0.12)] text-[var(--rr-success)]"
          : normalized.includes("pendiente") ||
              normalized.includes("borrador") ||
              normalized.includes("validado") ||
              normalized.includes("hoy")
            ? "border-[var(--rr-border-strong)] bg-[rgba(253,203,88,0.12)] text-[var(--rr-accent)]"
            : normalized.includes("sin acceso") || normalized.includes("alerta")
              ? "border-[rgba(255,180,171,0.28)] bg-[rgba(147,0,10,0.16)] text-[var(--rr-danger)]"
              : "border-[var(--rr-border)] bg-white/5 text-[var(--rr-text-soft)]",
      )}
    >
      {value}
    </span>
  );
}
