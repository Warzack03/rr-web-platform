import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  publicFooterCopyright,
  publicFooterLegalLinks,
  publicFooterSocialLinks,
  publicFooterSponsors,
} from "@/lib/public/footer-content";

function FooterInstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.15rem] w-[1.15rem] fill-current">
      <path d="M12 4.622c2.403 0 2.688.009 3.637.052.877.04 1.354.187 1.671.31.42.163.72.358 1.035.673.315.315.51.615.673 1.035.123.317.27.794.31 1.671.043.949.052 1.234.052 3.637s-.009 2.688-.052 3.637c-.04.877-.187 1.354-.31 1.671-.163.42-.358.72-.673 1.035-.315.315-.615.51-1.035.673-.317.123-.794.27-1.671.31-.949.043-1.234.052-3.637.052s-2.688-.009-3.637-.052c-.877-.04-1.354-.187-1.671-.31a2.806 2.806 0 0 1-1.035-.673 2.806 2.806 0 0 1-.673-1.035c-.123-.317-.27-.794-.31-1.671C4.631 14.688 4.622 14.403 4.622 12s.009-2.688.052-3.637c.04-.877.187-1.354.31-1.671.163-.42.358-.72.673-1.035.315-.315.615-.51 1.035-.673.317-.123.794-.27 1.671-.31C9.312 4.631 9.597 4.622 12 4.622M12 3c-2.444 0-2.751.01-3.711.054-.958.044-1.612.196-2.185.418a4.403 4.403 0 0 0-1.594 1.039 4.403 4.403 0 0 0-1.038 1.594c-.222.572-.375 1.227-.418 2.185C3.01 9.249 3 9.556 3 12c0 2.444.01 2.751.054 3.711.044.958.196 1.612.418 2.185a4.403 4.403 0 0 0 1.038 1.594 4.403 4.403 0 0 0 1.594 1.038c.572.222 1.227.375 2.185.418.96.044 1.267.054 3.711.054s2.751-.01 3.711-.054c.958-.044 1.612-.196 2.185-.418a4.6 4.6 0 0 0 2.632-2.632c.222-.572.375-1.227.418-2.185.044-.96.054-1.267.054-3.711s-.01-2.751-.054-3.711c-.044-.958-.196-1.612-.418-2.185a4.6 4.6 0 0 0-2.632-2.632c-.572-.222-1.227-.375-2.185-.418C14.751 3.01 14.444 3 12 3m0 4.378A4.622 4.622 0 1 0 16.622 12 4.622 4.622 0 0 0 12 7.378m0 7.622a3 3 0 1 1 3-3 3 3 0 0 1-3 3m4.804-8.884a1.08 1.08 0 1 0 1.08 1.08 1.08 1.08 0 0 0-1.08-1.08" />
    </svg>
  );
}

function FooterTikTokIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className="h-[1.15rem] w-[1.15rem] fill-current">
      <path d="M16.708.027c1.745-.027 3.48-.011 5.213-.027.105 2.041.839 4.12 2.333 5.563 1.491 1.479 3.6 2.156 5.652 2.385v5.369c-1.923-.063-3.855-.463-5.6-1.291-.76-.344-1.468-.787-2.161-1.24-.009 3.896.016 7.787-.025 11.667-.104 1.864-.719 3.719-1.803 5.255-1.744 2.557-4.771 4.224-7.88 4.276-1.907.109-3.812-.411-5.437-1.369-2.693-1.588-4.588-4.495-4.864-7.615-.032-.667-.043-1.333-.016-1.984.24-2.537 1.495-4.964 3.443-6.615 2.208-1.923 5.301-2.839 8.197-2.297.027 1.975-.052 3.948-.052 5.923-1.323-.428-2.869-.308-4.025.495-.844.547-1.485 1.385-1.819 2.333-.276.676-.197 1.427-.181 2.145.317 2.188 2.421 4.027 4.667 3.828 1.489-.016 2.916-.88 3.692-2.145.251-.443.532-.896.547-1.417.131-2.385.079-4.76.095-7.145.011-5.375-.016-10.735.025-16.093" />
    </svg>
  );
}

function FooterYoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[1.15rem] w-[1.15rem] fill-current">
      <path d="M21.8 8.001s-.195-1.378-.795-1.985c-.76-.797-1.613-.801-2.004-.847-2.799-.202-6.997-.202-6.997-.202h-.009s-4.198 0-6.997.202c-.391.047-1.243.051-2.004.847C2.395 6.623 2.2 8.001 2.2 8.001S2 9.62 2 11.238v1.517c0 1.618.2 3.237.2 3.237s.195 1.378.795 1.985c.761.797 1.76.771 2.205.855 1.6.153 6.8.201 6.8.201s4.203-.006 7.001-.209c.391-.047 1.243-.051 2.004-.847.6-.607.795-1.985.795-1.985s.2-1.618.2-3.237v-1.517c0-1.618-.2-3.237-.2-3.237M9.935 14.594l-.001-5.62 5.404 2.82z" />
    </svg>
  );
}

function FooterSocialIcon({ kind }: { kind: (typeof publicFooterSocialLinks)[number]["kind"] }) {
  const icons: Record<(typeof publicFooterSocialLinks)[number]["kind"], ReactNode> = {
    instagram: <FooterInstagramIcon />,
    tiktok: <FooterTikTokIcon />,
    youtube: <FooterYoutubeIcon />,
  };

  return icons[kind];
}

export function PublicFooter() {
  return (
    <footer className="border-t border-[color:var(--rr-border)] bg-[#0a0f10]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 px-5 py-12 md:px-8 md:py-14 xl:px-16">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-4">
            <Image
              src="/media/brand/escudo-rising-raimon.png"
              alt="Escudo de Rising Raimon"
              width={64}
              height={72}
              className="h-auto w-[3.45rem]"
            />
            <div>
              <p className="rr-brand text-[2.2rem] leading-none text-[color:var(--rr-gold)] md:text-[2.5rem]">
                Rising Raimon
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 md:justify-end">
            {publicFooterSocialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                aria-label={link.label}
                className="inline-flex h-11 w-11 items-center justify-center rounded-[0.45rem] border border-[color:var(--rr-gold)] bg-[rgba(253,203,88,0.08)] text-[color:var(--rr-gold)] transition hover:-translate-y-0.5 hover:bg-[rgba(253,203,88,0.16)]"
              >
                <FooterSocialIcon kind={link.kind} />
              </a>
            ))}
          </div>
        </div>

        <div className="rr-bolt-divider" />

        <div className="flex flex-col gap-5">
          <p className="rr-kicker text-center text-[1rem] text-[color:var(--rr-gold)]">
            Patrocinado por
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
            {publicFooterSponsors.map((sponsor) => (
              <div
                key={sponsor.src}
                className="flex min-h-[102px] items-center justify-center rounded-[0.5rem] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)] px-4 py-5"
              >
                <Image
                  src={sponsor.src}
                  alt={sponsor.alt}
                  width={sponsor.width}
                  height={sponsor.height}
                  className="h-auto max-h-[52px] w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[rgba(253,203,88,0.18)] pt-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm uppercase tracking-[0.12em] text-[color:var(--rr-muted)]/72">
            {publicFooterCopyright}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.92rem] uppercase tracking-[0.16em] text-[color:var(--rr-muted)]/85">
            {publicFooterLegalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-[color:var(--rr-gold)]"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
