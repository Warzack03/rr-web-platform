import { NewsContentBlock } from "@/components/public/news-content-block";
import type { PublicNewsContentBlock } from "@/lib/public/news-content";

type NewsArticleContentProps = {
  blocks: PublicNewsContentBlock[];
};

export function NewsArticleContent({ blocks }: NewsArticleContentProps) {
  return (
    <div className="space-y-7">
      {blocks.map((block, index) => (
        <NewsContentBlock key={`${block.type}-${index}`} block={block} />
      ))}
    </div>
  );
}
