import { ArrowUpRight } from "lucide-react";
import { ArticleImageGrid } from "@/components/public/article-image-grid";
import { ArticleQuote } from "@/components/public/article-quote";
import type { PublicNewsContentBlock } from "@/lib/contracts/public";

type NewsContentBlockProps = {
  block: PublicNewsContentBlock;
};

export function NewsContentBlock({ block }: NewsContentBlockProps) {
  switch (block.type) {
    case "paragraph":
      return <p className="text-[1.04rem] leading-7 text-[color:var(--rr-muted)] md:text-[1.08rem]">{block.text}</p>;
    case "heading":
      return (
        <h2 className="rr-display text-[2.35rem] leading-[0.96] text-white md:text-[2.8rem]">
          {block.text}
        </h2>
      );
    case "quote":
      return <ArticleQuote block={block} />;
    case "image":
      return <ArticleImageGrid images={[block.image]} />;
    case "imageGrid":
      return <ArticleImageGrid images={block.images} />;
    case "link":
      return (
        <div className="rr-panel-dark p-4 md:p-5">
          <p className="rr-kicker text-[0.8rem] text-[color:var(--rr-gold)]">Referencia</p>
          <a
            href={block.href}
            target={block.external === false ? undefined : "_blank"}
            rel={block.external === false ? undefined : "noreferrer"}
            className="mt-3 inline-flex items-center gap-2 text-[1.08rem] font-semibold text-white transition hover:text-[color:var(--rr-gold)]"
          >
            {block.label}
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.9} />
          </a>
          {block.description ? (
            <p className="mt-3 text-[0.98rem] leading-6 text-[color:var(--rr-muted)]">{block.description}</p>
          ) : null}
          <p className="mt-3 break-all text-[0.8rem] uppercase tracking-[0.12em] text-[color:var(--rr-muted)]/82">
            {block.href}
          </p>
        </div>
      );
    default:
      return null;
  }
}
