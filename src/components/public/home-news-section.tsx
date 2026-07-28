import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { NewsArtwork } from "@/components/public/news-artwork";
import { NewsCard } from "@/components/public/news-card";
import type { PublicHomePageContent } from "@/lib/public/home-content";

type HomeNewsSectionProps = {
  content: NonNullable<PublicHomePageContent["news"]>;
};

export function HomeNewsSection({ content }: HomeNewsSectionProps) {
  return (
    <section className="border-y border-[color:var(--rr-border)] bg-[linear-gradient(180deg,rgba(7,12,14,0.86),rgba(10,15,18,0.98))]">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-12 md:px-8 md:py-16 xl:px-16">
        <div className="flex items-center justify-between gap-4">
          <h2 className="rr-display text-[3.2rem] leading-none text-white md:text-[4rem]">
            {content.title}
          </h2>
          <Link
            href={content.href}
            className="rr-kicker inline-flex text-[0.84rem] text-[color:var(--rr-gold)] transition hover:text-[#ffd46f]"
          >
            Todas las noticias
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="order-2 space-y-4 lg:order-1">
            {content.latest.map((article) => (
              <HomeNewsRailItem key={article.slug} article={article} />
            ))}
          </div>

          <div className="order-1 lg:order-2">
            <NewsCard
              variant="article"
              href={`/noticias/${content.featured.slug}`}
              category={content.featured.category}
              dateLabel={content.featured.dateLabel}
              title={content.featured.title}
              excerpt={content.featured.excerpt}
              imageTone={content.featured.imageTone}
              imageUrl={content.featured.coverImageUrl}
              imageAlt={content.featured.coverImageAlt}
              relatedTeam={content.featured.relatedTeam}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HomeNewsRailItem({
  article,
}: {
  article: NonNullable<PublicHomePageContent["news"]>["latest"][number];
}) {
  return (
    <Link
      href={`/noticias/${article.slug}`}
      className="group flex overflow-hidden border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.03)] transition hover:-translate-y-0.5 hover:border-[color:var(--rr-border-strong)]"
    >
      <NewsArtwork
        imageTone={article.imageTone}
        imageUrl={article.coverImageUrl}
        alt={article.coverImageAlt}
        className="hidden w-40 shrink-0 border-r border-[color:var(--rr-border)] sm:block"
      />
      <div className="flex min-h-[9.5rem] flex-1 flex-col justify-between p-4 md:p-5">
        <div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.82rem] uppercase tracking-[0.14em] text-[color:var(--rr-muted)]/82">
            <span className="rr-kicker text-[color:var(--rr-gold)]">{article.category}</span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="h-3.5 w-3.5 text-[color:var(--rr-gold)]" strokeWidth={1.9} />
              {article.dateLabel}
            </span>
          </div>

          <h3 className="rr-display mt-4 text-[2.15rem] leading-[0.92] text-white">{article.title}</h3>
          <p className="mt-3 line-clamp-2 text-[0.98rem] leading-6 text-[color:var(--rr-muted)]">
            {article.excerpt}
          </p>
        </div>

        <span className="rr-kicker mt-4 inline-flex items-center gap-2 text-[color:var(--rr-gold)] transition group-hover:translate-x-1">
          Leer articulo
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}
