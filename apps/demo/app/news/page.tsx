import { sanityFetch } from "@/sanity/lib/client";
import { News } from "../types/sanity";
import NewsCard from "../components/NewsCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const newsQuery = `*[_type == "news" && draft != true] | order(date desc) {
  ...,
  "relatedProject": relatedProject->{title, slug},
  "relatedPublication": relatedPublication->{title},
  "relatedTool": relatedTool->{name}
}`;

export default async function NewsPage() {
  const news = await sanityFetch<News[]>({ query: newsQuery });

  const categoryCounts = news.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryLabels = {
    research: "Research Updates",
    software: "Software Releases",
    publication: "Publications",
    award: "Awards & Recognition",
    conference: "Conferences & Talks",
    general: "General News",
    lab: "Lab News",
  };

  const featuredNews = news.filter(n => n.featured);
  const recentNews = news.slice(0, 6);

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">News & Updates</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Latest research updates, software releases, publications, and announcements.
        </p>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No news items found. Add some in Sanity Studio!</p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="flex flex-wrap h-auto gap-2">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All News
              <Badge variant="secondary" className="ml-2">{news.length}</Badge>
            </TabsTrigger>
            {Object.entries(categoryCounts).map(([category, count]) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {categoryLabels[category as keyof typeof categoryLabels]}
                <Badge variant="secondary" className="ml-2">{count}</Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {featuredNews.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-6">Featured Updates</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featuredNews.map((item) => (
                    <NewsCard key={item._id} news={item} featured />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-semibold mb-6">Recent Updates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentNews.map((item) => (
                  <NewsCard key={item._id} news={item} />
                ))}
              </div>
            </section>

            {news.length > 6 && (
              <section>
                <h2 className="text-2xl font-semibold mb-6">All Updates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.slice(6).map((item) => (
                    <NewsCard key={item._id} news={item} />
                  ))}
                </div>
              </section>
            )}
          </TabsContent>

          {Object.keys(categoryCounts).map((category) => (
            <TabsContent key={category} value={category} className="space-y-6">
              <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-semibold">
                  {categoryLabels[category as keyof typeof categoryLabels]}
                </h2>
                <p className="text-muted-foreground">
                  All updates in this category
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <NewsCard key={item._id} news={item} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}