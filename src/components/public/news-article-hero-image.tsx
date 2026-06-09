import { NewsArtwork } from "@/components/public/news-artwork";
import type { PublicNewsCategory, PublicNewsImageTone } from "@/lib/public/news-content";

type NewsArticleHeroImageProps = {
  category: PublicNewsCategory;
  imageTone: PublicNewsImageTone;
  alt: string;
};

export function NewsArticleHeroImage({ category, imageTone, alt }: NewsArticleHeroImageProps) {
  return (
    <NewsArtwork
      imageTone={imageTone}
      alt={alt}
      className="aspect-[16/10] rounded-[6px] border border-[color:var(--rr-border)] shadow-[var(--rr-shadow)] md:aspect-[16/8.8]"
    >
      <div className="flex h-full items-start justify-start p-4 md:p-5">
        <span className="rr-kicker inline-flex bg-[rgba(7,22,41,0.9)] px-3 py-1.5 text-[0.8rem] text-[color:var(--rr-gold)]">
          {category}
        </span>
      </div>
    </NewsArtwork>
  );
}
