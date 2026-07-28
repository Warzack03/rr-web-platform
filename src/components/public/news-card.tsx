import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { NewsArtwork } from "@/components/public/news-artwork";
import { cn } from "@/lib/utils";
import type { PublicNewsImageTone } from "@/lib/contracts/public";

type LegacyNewsCardProps = {
  href: string;
  category: string;
  title: string;
  tone: "ball" | "tactics";
  variant?: "preview";
};

type ArticleNewsCardProps = {
  href: string;
  category: string;
  title: string;
  excerpt: string;
  dateLabel: string;
  imageTone: PublicNewsImageTone;
  imageUrl?: string;
  imageAlt?: string;
  relatedTeam?: string;
  ctaLabel?: string;
  className?: string;
  variant: "article";
};

type NewsCardProps = LegacyNewsCardProps | ArticleNewsCardProps;

function ArticleNewsCard({
  href,
  category,
  title,
  excerpt,
  dateLabel,
  imageTone,
  imageUrl,
  imageAlt,
  relatedTeam,
  ctaLabel = "Leer articulo",
  className,
}: ArticleNewsCardProps) {
  return (
    <article
      className={cn(
        "group overflow-hidden border border-[color:var(--rr-border)] bg-[linear-gradient(180deg,rgba(31,46,70,0.96),rgba(16,27,45,0.98))] shadow-[var(--rr-shadow)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--rr-border-strong)]",
        className,
      )}
    >
      <Link href={href} className="block">
        <NewsArtwork
          imageTone={imageTone}
          imageUrl={imageUrl}
          alt={imageAlt}
          className="aspect-[16/10] border-b border-[color:var(--rr-border)]"
        />
        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.86rem] uppercase tracking-[0.16em] text-[color:var(--rr-muted)]/84">
            <span className="rr-kicker inline-flex bg-[rgba(7,22,41,0.88)] px-2.5 py-1 text-[0.78rem] text-[color:var(--rr-gold)]">
              {category}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" strokeWidth={1.9} />
              {dateLabel}
            </span>
          </div>

          <div className="space-y-3">
            <h3 className="rr-display text-[2.15rem] leading-[0.92] text-white sm:text-[2.35rem]">
              {title}
            </h3>
            <p className="text-[1.02rem] leading-6 text-[color:var(--rr-muted)]">{excerpt}</p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {relatedTeam ? (
              <span className="rr-chip border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] text-[color:var(--rr-muted)]">
                {relatedTeam}
              </span>
            ) : (
              <span />
            )}

            <span className="rr-kicker inline-flex items-center gap-2 text-[color:var(--rr-gold)] transition group-hover:translate-x-1">
              {ctaLabel}
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function PreviewNewsCard({ href, category, title, tone }: LegacyNewsCardProps) {
  return (
    <Link
      href={href}
      className="group relative isolate block overflow-hidden rounded-[6px] border border-[color:var(--rr-border)] bg-[#161b20] aspect-[4/3] sm:aspect-[16/10]"
    >
      <div
        className={cn(
          "absolute inset-0 transition duration-500 group-hover:scale-[1.03]",
          tone === "ball" &&
            "bg-[radial-gradient(circle_at_18%_8%,rgba(218,238,255,0.7),transparent_18%),radial-gradient(circle_at_82%_8%,rgba(218,238,255,0.5),transparent_16%),linear-gradient(180deg,rgba(16,31,43,0.3),rgba(6,19,36,0.74)),linear-gradient(135deg,#1a303f_0%,#0b1725_64%,#0a1d33_100%)]",
          tone === "tactics" &&
            "bg-[linear-gradient(135deg,rgba(10,26,24,0.85),rgba(14,58,52,0.72)),radial-gradient(circle_at_top,rgba(189,255,229,0.15),transparent_40%)]",
        )}
      />

      {tone === "ball" ? (
        <>
          <div className="absolute left-1/2 top-[56%] h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#2d0f0f] bg-[radial-gradient(circle_at_30%_30%,#70403a,#311310_62%,#180707_100%)] shadow-[0_18px_34px_rgba(0,0,0,0.42)]" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,transparent,rgba(10,20,32,0.78))]" />
        </>
      ) : (
        <>
          <div className="absolute left-1/2 top-1/2 h-[78%] w-[54%] -translate-x-1/2 -translate-y-1/2 rounded-[4px] border border-white/18" />
          <div className="absolute left-1/2 top-1/2 h-[34%] w-[34%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/18" />
          <div className="absolute inset-y-[22%] left-1/2 w-px -translate-x-1/2 bg-white/18" />
          <div className="absolute inset-x-[23%] top-1/2 h-px -translate-y-1/2 bg-white/18" />
        </>
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_32%,rgba(5,11,18,0.28)_58%,rgba(5,11,18,0.94)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <span className="rr-kicker inline-flex bg-[rgba(7,22,41,0.88)] px-2.5 py-1 text-[0.82rem] text-[color:var(--rr-gold)]">
          {category}
        </span>
        <h3 className="rr-display mt-3 text-[2rem] leading-[0.95] text-white sm:text-[2.35rem]">
          {title}
        </h3>
      </div>
    </Link>
  );
}

export function NewsCard(props: NewsCardProps) {
  if (props.variant === "article") {
    return <ArticleNewsCard {...props} />;
  }

  return <PreviewNewsCard {...props} />;
}
