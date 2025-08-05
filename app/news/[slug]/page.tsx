import { sanityFetch } from "@/sanity/lib/client";
import { News } from "../../types/sanity";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Calendar, 
  Tag,
  ArrowLeft,
  Share2,
  Sparkles
} from "lucide-react";
import { PortableText } from "@portabletext/react";

const newsQuery = `*[_type == "news" && slug.current == $slug][0] {
  ...,
  "relatedProject": relatedProject->{title, slug},
  "relatedPublication": relatedPublication->{title, googleScholarLink},
  "relatedTool": relatedTool->{name, githubLink}
}`;

export async function generateStaticParams() {
  const news = await sanityFetch<News[]>({
    query: `*[_type == "news" && draft != true] { slug }`,
  });
  
  return news.map((item) => ({
    slug: item.slug.current,
  }));
}

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      const imageUrl = urlForImage(value);
      return (
        <figure className="my-8">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={value.alt || "News image"}
              fill
              className="object-cover"
            />
          </div>
          {value.caption && (
            <figcaption className="text-sm text-muted-foreground text-center mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    code: ({ value }: any) => (
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto my-6">
        <code className="text-sm">{value.code}</code>
      </pre>
    ),
  },
  marks: {
    link: ({ value, children }: any) => (
      <Link 
        href={value.href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary underline hover:no-underline"
      >
        {children}
      </Link>
    ),
    code: ({ children }: any) => (
      <code className="bg-muted px-1 py-0.5 rounded text-sm">{children}</code>
    ),
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-medium mt-6 mb-3">{children}</h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 my-6 italic">
        {children}
      </blockquote>
    ),
  },
};

export default async function NewsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const newsItem = await sanityFetch<News>({
    query: newsQuery,
    params: { slug },
  });

  if (!newsItem || newsItem.draft) {
    notFound();
  }

  const imageUrl = newsItem.image ? urlForImage(newsItem.image) : null;
  
  const categoryIcons = {
    research: "🔬",
    software: "💻",
    publication: "📚",
    award: "🏆",
    conference: "🎤",
    general: "📢",
    lab: "🧪",
  };

  const categoryColors = {
    research: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    software: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    publication: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    award: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    conference: "bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-500/20",
    general: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
    lab: "bg-teal-500/10 text-teal-700 dark:text-teal-400 border-teal-500/20",
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <article className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
      <Link href="/news">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to News
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto">
        {imageUrl && (
          <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-xl mb-8">
            <Image
              src={imageUrl}
              alt={newsItem.title}
              fill
              className="object-cover"
              priority
            />
            {newsItem.featured && (
              <Badge className="absolute top-4 right-4 bg-primary/90 backdrop-blur">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        )}

        <header className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            <Badge 
              variant="outline" 
              className={categoryColors[newsItem.category]}
            >
              <span className="mr-1">{categoryIcons[newsItem.category]}</span>
              {newsItem.category.charAt(0).toUpperCase() + newsItem.category.slice(1)}
            </Badge>
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <time dateTime={newsItem.date}>{formatDate(newsItem.date)}</time>
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold">{newsItem.title}</h1>
          
          <p className="text-lg text-muted-foreground">{newsItem.summary}</p>
          
          {newsItem.tags && newsItem.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {newsItem.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {newsItem.content && (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <PortableText 
              value={newsItem.content}
              components={portableTextComponents}
            />
          </div>
        )}

        {/* Related Items */}
        {(newsItem.relatedProject || newsItem.relatedPublication || newsItem.relatedTool) && (
          <Card className="mt-12 p-6">
            <h3 className="text-lg font-semibold mb-4">Related Work</h3>
            <div className="space-y-3">
              {newsItem.relatedProject && (
                <div>
                  <p className="text-sm text-muted-foreground">Project</p>
                  <Link 
                    href={`/projects/${newsItem.relatedProject.slug.current}`}
                    className="text-primary hover:underline"
                  >
                    {newsItem.relatedProject.title}
                  </Link>
                </div>
              )}
              
              {newsItem.relatedPublication && (
                <div>
                  <p className="text-sm text-muted-foreground">Publication</p>
                  {newsItem.relatedPublication.googleScholarLink ? (
                    <Link 
                      href={newsItem.relatedPublication.googleScholarLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {newsItem.relatedPublication.title}
                    </Link>
                  ) : (
                    <p>{newsItem.relatedPublication.title}</p>
                  )}
                </div>
              )}
              
              {newsItem.relatedTool && (
                <div>
                  <p className="text-sm text-muted-foreground">Tool</p>
                  {newsItem.relatedTool.githubLink ? (
                    <Link 
                      href={newsItem.relatedTool.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {newsItem.relatedTool.name}
                    </Link>
                  ) : (
                    <p>{newsItem.relatedTool.name}</p>
                  )}
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Share */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              navigator.share({
                title: newsItem.title,
                text: newsItem.summary,
                url: window.location.href,
              }).catch(() => {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href);
              });
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </article>
  );
}