import Link from "next/link";
import { AdminMetricCard } from "@/components/admin/admin-metric-card";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminPanel } from "@/components/admin/admin-panel";
import type { AdminRole } from "@/lib/admin/roles";
import { getSectionOverview } from "@/lib/admin/mock-data";

type AdminSectionOverviewProps = {
  section: string;
  role: AdminRole;
};

export function AdminSectionOverview({
  section,
  role,
}: AdminSectionOverviewProps) {
  const overview = getSectionOverview(section, role);

  return (
    <div className="space-y-6 lg:space-y-8">
      <AdminPageHeader
        eyebrow={overview.eyebrow}
        title={overview.title}
        description={overview.description}
        actions={
          <Link href="/admin" className="rr-button rr-button-secondary text-[0.84rem]">
            Volver al dashboard
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        {overview.metrics.map((metric) => (
          <AdminMetricCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            detail={metric.detail}
            tone={metric.tone}
          />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        {overview.highlights.map((group) => (
          <AdminPanel key={group.title} className="p-5 sm:p-6">
            <div className="space-y-4">
              <div>
                <p className="rr-kicker text-[color:var(--rr-gold)]">{overview.title}</p>
                <h2 className="rr-display mt-2 text-[2rem] leading-[0.95] text-white">
                  {group.title}
                </h2>
              </div>
              <div className="grid gap-3">
                {group.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-[10px] border border-white/10 bg-[rgba(255,255,255,0.04)] px-4 py-4 text-[0.96rem] text-[color:var(--rr-muted)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </AdminPanel>
        ))}
      </div>
    </div>
  );
}
