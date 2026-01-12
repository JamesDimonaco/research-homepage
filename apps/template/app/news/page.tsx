import { sanityFetch } from "@/sanity/lib/client";
import { NewsCard } from "@research-homepage/components";
import type { News } from "@research-homepage/cms";

export default async function NewsPage() {
  const news = await sanityFetch<News[]>({
    query: `*[_type == "news" && !draft] | order(featured desc, date desc)`,
  });

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">News & Updates</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news?.map((item) => (
          <NewsCard key={item._id} news={item} />
        ))}
      </div>

      {(!news || news.length === 0) && (
        <p className="text-muted-foreground text-center py-12">
          No news posts yet. Add some in Sanity Studio.
        </p>
      )}
    </div>
  );
}
