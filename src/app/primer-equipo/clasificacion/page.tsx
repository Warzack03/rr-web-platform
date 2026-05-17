import { PublicSiteLayout } from "@/components/layout/public-site-layout";

export default function FirstTeamStandingPlaceholderPage() {
  return (
    <PublicSiteLayout activeNav="primer-equipo">
      <section className="mx-auto flex min-h-[70vh] w-full max-w-[1280px] items-center px-5 py-16 md:px-8 xl:px-16">
        <div className="rr-panel max-w-2xl p-8">
          <p className="rr-kicker text-[color:var(--rr-gold)]">Primer Equipo</p>
          <h1 className="rr-display mt-4 text-[4rem] leading-none text-white">Clasificacion</h1>
          <p className="mt-4 text-[1.15rem] text-[color:var(--rr-muted)]">
            Placeholder minimo. La clasificacion completa queda fuera intencionadamente.
          </p>
        </div>
      </section>
    </PublicSiteLayout>
  );
}
