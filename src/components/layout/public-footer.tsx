import Link from "next/link";
import { ClubMark } from "@/src/components/shared/club-mark";
import { sponsorPlaceholders } from "@/src/lib/demo-data";

export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--rr-border)] bg-[rgba(8,17,29,0.92)]">
      <div className="border-b border-[var(--rr-border)]">
        <div className="mx-auto max-w-[var(--rr-container)] px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--rr-accent)]">
                Patrocinadores
              </p>
              <p className="mt-2 text-base text-[var(--rr-text-muted)]">
                Espacio listo para futuros logos reales del club.
              </p>
            </div>
            <div className="grid flex-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {sponsorPlaceholders.map((sponsor) => (
                <div
                  key={sponsor}
                  className="rounded-[18px] border border-dashed border-[var(--rr-border)] bg-white/5 px-4 py-4 text-center text-sm font-semibold uppercase tracking-[0.14em] text-[var(--rr-text-soft)]"
                >
                  {sponsor}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[var(--rr-container)] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_0.7fr_0.7fr] lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ClubMark compact />
            <span className="font-display text-3xl uppercase tracking-[0.06em] text-[var(--rr-accent)]">
              Rising Raimon
            </span>
          </div>
          <p className="max-w-md text-base leading-7 text-[var(--rr-text-muted)]">
            Nueva base visual de la plataforma deportiva, con separacion clara entre web
            publica, backoffice y tienda externa.
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--rr-accent)]">
            Navegacion
          </p>
          <div className="flex flex-col gap-2 text-[var(--rr-text-soft)]">
            <Link href="/">Inicio</Link>
            <Link href="/primer-equipo">Primer Equipo</Link>
            <Link href="/equipos">Equipos</Link>
            <Link href="/noticias">Noticias</Link>
            <Link href="/admin/login">Admin</Link>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--rr-accent)]">
            Club
          </p>
          <div className="flex flex-col gap-2 text-[var(--rr-text-soft)]">
            <Link href="https://tienda.risingraimon.es">Tienda</Link>
            <span>Madrid</span>
            <span>Academia y Primer Equipo</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
