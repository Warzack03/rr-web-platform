import { notFound } from "next/navigation";
import { CTAButton } from "@/src/components/shared/cta-button";
import { PageHero } from "@/src/components/public/page-hero";
import { NewsListItem } from "@/src/components/public/news-list-item";
import { getNewsBySlug, publicNews } from "@/src/lib/demo-data";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getNewsBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = publicNews.filter((item) => item.slug !== article.slug).slice(0, 2);

  return (
    <div className="space-y-10 pb-20">
      <PageHero
        eyebrow={article.category}
        title={article.title}
        description={article.excerpt}
        meta={
          <span className="text-sm uppercase tracking-[0.16em] text-[var(--rr-text-muted)]">
            {article.publishedLabel}
          </span>
        }
      />

      <section className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface)] p-6">
          <div className="space-y-5 text-lg leading-8 text-[var(--rr-text-muted)]">
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {article.videoLabel ? (
            <div className="mt-8 rounded-[18px] border border-[var(--rr-border-strong)] bg-[rgba(253,203,88,0.08)] px-4 py-4 text-sm uppercase tracking-[0.16em] text-[var(--rr-accent)]">
              Video relacionado: {article.videoLabel}
            </div>
          ) : null}
        </article>

        <aside className="space-y-4">
          <div className="rounded-[22px] border border-[var(--rr-border)] bg-[var(--rr-surface-card)] p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--rr-accent)]">
              Equipos relacionados
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {article.teamSlugs.map((team) => (
                <span
                  key={team}
                  className="rounded-full border border-[var(--rr-border)] bg-black/15 px-3 py-2 text-sm uppercase tracking-[0.14em] text-white"
                >
                  {team.replace("-", " ")}
                </span>
              ))}
            </div>
            <div className="mt-6">
              <CTAButton href="/noticias" variant="secondary">
                Volver al listado
              </CTAButton>
            </div>
          </div>

          {related.map((item) => (
            <NewsListItem key={item.slug} item={item} />
          ))}
        </aside>
      </section>
    </div>
  );
}
