import { ArrowRight, CalendarDays } from "lucide-react";
import { CTAButton } from "@/components/public/cta-button";
import type { PublicNewsArticle } from "@/lib/contracts/public";

type NewsHeroProps = {
  article: PublicNewsArticle;
};

export function NewsHero({ article }: NewsHeroProps) {
  return (
    <section className="relative isolate overflow-hidden border-b border-[color:var(--rr-border)] bg-[linear-gradient(180deg,#102746_0%,#09162a_100%)]">
      <div className="absolute inset-0 opacity-95">
        {article.coverImageUrl ? (
          <div
            className="absolute inset-0 scale-[1.01] bg-cover bg-center"
            role="img"
            aria-label={article.coverImageAlt}
            style={{ backgroundImage: `url(${JSON.stringify(article.coverImageUrl)})` }}
          />
        ) : null}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(205,231,255,0.5),transparent_22%),radial-gradient(circle_at_top_right,rgba(205,231,255,0.46),transparent_22%),linear-gradient(180deg,rgba(10,24,42,0.18),rgba(7,22,41,0.94))]" />
        <div className="absolute left-[-18%] top-[-30%] h-[22rem] w-[68%] rounded-[100%] border border-white/10 opacity-45 md:h-[32rem]" />
        <div className="absolute right-[-18%] top-[-30%] h-[22rem] w-[68%] rounded-[100%] border border-white/10 opacity-45 md:h-[32rem]" />
        <div className="absolute left-[11%] top-[16%] h-24 w-24 rounded-full bg-white/55 blur-[72px] md:h-36 md:w-36" />
        <div className="absolute right-[11%] top-[16%] h-24 w-24 rounded-full bg-white/50 blur-[72px] md:h-36 md:w-36" />
        <div className="absolute left-[17%] top-[39%] h-2 w-[14%] rounded-full bg-white/45 blur-sm" />
        <div className="absolute right-[17%] top-[39%] h-2 w-[14%] rounded-full bg-white/45 blur-sm" />
        <div className="absolute inset-x-[4%] bottom-[15%] h-[14rem] rounded-t-[100%] border-t border-white/8 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_60%)] opacity-75" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,22,41,0.1)_0%,rgba(7,22,41,0.18)_52%,rgba(7,22,41,0.92)_100%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[28rem] w-full max-w-[1280px] items-end px-5 pb-14 pt-24 md:px-8 md:pb-16 xl:px-16">
        <div className="max-w-[43rem]">
          <span className="rr-kicker inline-flex bg-[rgba(7,22,41,0.82)] px-3 py-1.5 text-[0.82rem] text-[color:var(--rr-gold)]">
            {article.badge ?? "Ultima noticia"}
          </span>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-[0.9rem] uppercase tracking-[0.16em] text-[color:var(--rr-muted)]/84">
            <span className="rr-chip border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] text-[color:var(--rr-text)]">
              {article.category}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-[color:var(--rr-gold)]" strokeWidth={1.9} />
              {article.dateLabel}
            </span>
            {article.relatedTeam ? (
              <span className="rr-chip border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] text-[color:var(--rr-muted)]">
                {article.relatedTeam}
              </span>
            ) : null}
          </div>

          <h1 className="rr-display mt-6 text-[3.9rem] leading-[0.92] text-white sm:text-[5rem] lg:text-[6.2rem]">
            {article.title}
          </h1>
          <p className="mt-5 max-w-[34rem] text-[1.12rem] leading-7 text-[color:var(--rr-muted)] md:text-[1.18rem]">
            {article.excerpt}
          </p>

          <div className="mt-8">
            <CTAButton href={`/noticias/${article.slug}`} className="w-full sm:w-auto">
              <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
              Leer articulo
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
