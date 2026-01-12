import { sanityFetch } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { Badge } from "@research-homepage/ui";
import { ShareButton } from "@research-homepage/components";
import type { News } from "@research-homepage/cms";
import { Calendar } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const news = await sanityFetch<{ slug: { current: string } }[]>({
    query: `*[_type == "news" && defined(slug.current) && !draft]{ slug }`,
  });

  return news?.map((item) => ({
    slug: item.slug.current,
  })) || [];
}

export default async function NewsPostPage({ params }: Props) {
  const { slug } = await params;

  const news = await sanityFetch<News>({
    query: `*[_type == "news" && slug.current == $slug && !draft][0]{
      ...,
      relatedProject->,
      relatedPublication->,
      relatedTool->
    }`,
    params: { slug },
  });

  if (!news) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <article className="max-w-3xl mx-auto">
        {news.image && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={urlForImage(news.image) || ""}
              alt={news.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {news.category && <Badge variant="secondary">{news.category}</Badge>}
            {news.featured && <Badge>Featured</Badge>}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold">{news.title}</h1>

          {news.date && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(news.date).toLocaleDateString()}</span>
            </div>
          )}

          {news.summary && (
            <p className="text-lg text-muted-foreground">{news.summary}</p>
          )}

          {news.content && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PortableText value={news.content} />
            </div>
          )}

          <div className="pt-8 border-t">
            <ShareButton title={news.title} />
          </div>

          {news.tags && news.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {news.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
}
