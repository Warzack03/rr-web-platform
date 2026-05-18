"use client";

import { useState } from "react";
import { NewsCard } from "@/components/public/news-card";
import { LoadMoreNewsButton } from "@/components/public/load-more-news-button";
import { NewsCategoryTabs } from "@/components/public/news-category-tabs";
import { NEWS_CATEGORY_LABELS, type PublicNewsArticle } from "@/lib/public/news-content";

const INITIAL_VISIBLE_ITEMS = 6;
const LOAD_MORE_STEP = 3;

type NewsGridProps = {
  articles: PublicNewsArticle[];
};

export function NewsGrid({ articles }: NewsGridProps) {
  const [activeCategory, setActiveCategory] = useState<(typeof NEWS_CATEGORY_LABELS)[number]>("Todas");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_ITEMS);

  const filteredArticles =
    activeCategory === "Todas"
      ? articles
      : articles.filter((article) => article.category === activeCategory);
  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const canLoadMore = visibleArticles.length < filteredArticles.length;

  function handleCategoryChange(category: string) {
    setActiveCategory(category as (typeof NEWS_CATEGORY_LABELS)[number]);
    setVisibleCount(INITIAL_VISIBLE_ITEMS);
  }

  function handleLoadMore() {
    setVisibleCount((currentCount) => currentCount + LOAD_MORE_STEP);
  }

  return (
    <section className="border-t border-[color:var(--rr-border)] bg-[linear-gradient(180deg,rgba(255,255,255,0.015),rgba(255,255,255,0))]">
      <div className="mx-auto w-full max-w-[1280px] px-5 py-8 md:px-8 md:py-10 xl:px-16">
        <NewsCategoryTabs
          categories={NEWS_CATEGORY_LABELS}
          activeCategory={activeCategory}
          onChange={handleCategoryChange}
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {visibleArticles.map((article) => (
            <NewsCard
              key={article.slug}
              variant="article"
              href={`/noticias/${article.slug}`}
              category={article.category}
              dateLabel={article.dateLabel}
              title={article.title}
              excerpt={article.excerpt}
              imageTone={article.imageTone}
              relatedTeam={article.relatedTeam}
            />
          ))}
        </div>

        <div className="mt-8 flex justify-center md:mt-10">
          <LoadMoreNewsButton disabled={!canLoadMore} onClick={handleLoadMore} />
        </div>
      </div>
    </section>
  );
}
