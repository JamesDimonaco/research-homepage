import Link from "next/link";
import Image from "next/image";
import { Blog } from "@research-homepage/cms";
import { Card, CardContent, CardFooter, CardHeader, Badge } from "@research-homepage/ui";
import { Calendar, Clock, Sparkles } from "lucide-react";
import { getUrlForImage } from "../config";

interface BlogCardProps {
  post: Blog;
  featured?: boolean;
}

export default function BlogCard({ post, featured = false }: BlogCardProps) {
  const urlForImage = getUrlForImage();
  const imageUrl = post.featuredImage ? urlForImage(post.featuredImage) : null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const calculateReadingTime = (content: any[]): number => {
    if (!content) return 5;
    const words = content
      .filter(block => block._type === 'block')
      .map(block => block.children?.map((child: any) => child.text).join(' ') || '')
      .join(' ')
      .split(/\s+/)
      .length;
    return Math.ceil(words / 200);
  };

  const readingTime = post.readingTime || calculateReadingTime(post.content || []);

  return (
    <Link href={`/blog/${post.slug.current}`}>
      <Card
        className={`group overflow-hidden h-full hover:shadow-lg transition-all duration-300 border-l-[3px] border-l-blue-500 dark:border-l-blue-400 ${
          featured ? "border-primary" : ""
        }`}
      >
        {imageUrl && (
          <div className={`relative overflow-hidden ${featured ? "h-64" : "h-48"}`}>
            <Image
              src={imageUrl}
              alt={post.featuredImage?.alt || post.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {post.featured && (
              <Badge className="absolute top-3 right-3 bg-primary/90 backdrop-blur">
                <Sparkles className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        )}

        <CardHeader>
          <div className="flex flex-wrap gap-2 mb-2">
            {post.categories?.slice(0, 2).map((category, index) => (
              <Badge key={index} variant="outline">
                {category}
              </Badge>
            ))}
          </div>
          <h3
            className={`font-semibold line-clamp-2 group-hover:text-primary transition-colors ${
              featured ? "text-2xl" : "text-xl"
            }`}
          >
            {post.title}
          </h3>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
        </CardContent>

        <CardFooter className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min</span>
          </div>
          {post.author && (
            <div className="flex items-center gap-1">
              <span>{post.author}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
