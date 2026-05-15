import { PageHero } from "@/src/components/public/page-hero";
import { NewsCard } from "@/src/components/public/news-card";
import { NewsListItem } from "@/src/components/public/news-list-item";
import { publicNews } from "@/src/lib/demo-data";

export default function NewsPage() {
  const [featured, ...rest] = publicNews;

  return (
    <div className="space-y-10 pb-20">
      <PageHero
        eyebrow="Noticias"
        title="Actualidad del club"
        description="Listado separado para noticias publicadas, con acceso a detalle y relacion con equipos cuando proceda."
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <NewsCard item={featured} />
        <div className="space-y-4">
          {rest.map((item) => (
            <NewsListItem key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
