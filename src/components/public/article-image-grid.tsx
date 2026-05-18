import { NewsArtwork } from "@/components/public/news-artwork";
import { cn } from "@/lib/utils";
import type { PublicNewsArticleImage } from "@/lib/public/news-content";

type ArticleImageGridProps = {
  images: PublicNewsArticleImage[];
  className?: string;
};

export function ArticleImageGrid({ images, className }: ArticleImageGridProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        images.length > 1 ? "md:grid-cols-2" : "grid-cols-1",
        className,
      )}
    >
      {images.map((image, index) => (
        <figure
          key={`${image.alt}-${index}`}
          className="overflow-hidden rounded-[6px] border border-[color:var(--rr-border)] bg-[rgba(255,255,255,0.02)]"
        >
          <NewsArtwork
            imageTone={image.tone}
            alt={image.alt}
            className="aspect-[16/10] border-b border-[color:var(--rr-border)]"
          />
          {image.caption ? (
            <figcaption className="px-4 py-3 text-[0.96rem] leading-6 text-[color:var(--rr-muted)]">
              {image.caption}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  );
}
