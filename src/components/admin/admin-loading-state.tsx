import { Loader2 } from "lucide-react";
import { AdminPanel } from "@/components/admin/admin-panel";

type AdminLoadingStateProps = {
  title?: string;
  description?: string;
};

export function AdminLoadingState({
  title = "Cargando backoffice",
  description = "Preparando datos.",
}: AdminLoadingStateProps) {
  return (
    <div className="space-y-6">
      <AdminPanel className="p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="h-5 w-5 animate-spin text-[color:var(--rr-gold)]" />
          <p className="rr-kicker text-[color:var(--rr-gold)]">Un momento</p>
        </div>
        <h1 className="rr-display mt-4 text-[2.6rem] leading-none text-white">
          {title}
        </h1>
        <p className="mt-3 text-[0.98rem] leading-6 text-[color:var(--rr-muted)]">
          {description}
        </p>
      </AdminPanel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <AdminPanel key={index} className="p-5">
            <div className="h-5 w-24 animate-pulse rounded bg-white/8" />
            <div className="mt-4 h-9 animate-pulse rounded bg-white/6" />
          </AdminPanel>
        ))}
      </div>
    </div>
  );
}
