import { sanityFetch } from "@/sanity/lib/client";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { Badge } from "@research-homepage/ui";
import { ShareButton } from "@research-homepage/components";
import type { Blog } from "@research-homepage/cms";
import { Calendar, Clock, User } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await sanityFetch<{ slug: { current: string } }[]>({
    query: `*[_type == "blog" && defined(slug.current) && !draft]{ slug }`,
  });

  return posts?.map((post) => ({
    slug: post.slug.current,
  })) || [];
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await sanityFetch<Blog>({
    query: `*[_type == "blog" && slug.current == $slug && !draft][0]`,
    params: { slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <article className="max-w-3xl mx-auto">
        {post.featuredImage && (
          <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={urlForImage(post.featuredImage) || ""}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {post.categories?.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {post.author && (
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
            )}
            {post.publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>
            )}
            {post.readingTime && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.readingTime} min read</span>
              </div>
            )}
          </div>

          {post.excerpt && (
            <p className="text-lg text-muted-foreground italic">{post.excerpt}</p>
          )}

          {post.content && (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <PortableText value={post.content} />
            </div>
          )}

          <div className="pt-8 border-t">
            <ShareButton title={post.title} />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {post.tags.map((tag) => (
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
