import { sanityFetch } from "@/sanity/lib/client";
import { Blog } from "../../types/sanity";
import { urlForImage } from "@/sanity/lib/image";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ShareButton from "../../components/ShareButton";
import ClickableImage from "../../components/ClickableImage";
import {
  Calendar,
  Tag,
  ArrowLeft,
  Clock,
  Sparkles
} from "lucide-react";
import { PortableText } from "@portabletext/react";

const blogQuery = `*[_type == "blog" && slug.current == $slug][0] {
  ...,
  "relatedPosts": relatedPosts[]->{
    _id,
    title,
    slug,
    excerpt,
    featuredImage,
    publishedAt,
    categories
  }
}`;

export async function generateStaticParams() {
  const posts = await sanityFetch<Blog[]>({
    query: `*[_type == "blog" && draft != true] { slug }`,
  });

  return posts.map((post) => ({
    slug: post.slug.current,
  }));
}

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      const imageUrl = urlForImage(value);
      return (
        <figure className="my-8">
          <div className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group">
            <ClickableImage
              src={imageUrl}
              alt={value.alt || "Blog image"}
              className="h-full w-full"
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
  },
  marks: {
    link: ({ value, children }: any) => {
      const target = value.blank ? "_blank" : undefined;
      const rel = value.blank ? "noopener noreferrer" : undefined;
      return (
        <Link
          href={value.href}
          target={target}
          rel={rel}
          className="text-primary underline hover:no-underline"
        >
          {children}
        </Link>
      );
    },
    code: ({ children }: any) => (
      <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-medium mt-6 mb-3">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-medium mt-4 mb-2">{children}</h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-4 my-6 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-2 my-4">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-2 my-4">{children}</ol>
    ),
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await sanityFetch<Blog>({
    query: blogQuery,
    params: { slug },
  });

  if (!post || post.draft) {
    notFound();
  }

  const imageUrl = post.featuredImage ? urlForImage(post.featuredImage) : null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Calculate reading time if not provided
  const calculateReadingTime = (content: any[]): number => {
    const words = content
      .filter(block => block._type === 'block')
      .map(block => block.children?.map((child: any) => child.text).join(' ') || '')
      .join(' ')
      .split(/\s+/)
      .length;
    return Math.ceil(words / 200); // Average reading speed: 200 words/minute
  };

  const readingTime = post.readingTime || calculateReadingTime(post.content || []);

  return (
    <article className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
      <Link href="/blog">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog
        </Button>
      </Link>

      <div className="max-w-4xl mx-auto">
        {imageUrl && (
          <div className="relative h-64 md:h-96 w-full overflow-hidden rounded-xl mb-8">
            <ClickableImage
              src={imageUrl}
              alt={post.featuredImage?.alt || post.title}
              featured={post.featured}
              className="h-full w-full"
            />
          </div>
        )}

        <header className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-3">
            {post.categories?.map((category, index) => (
              <Badge key={index} variant="outline">
                {category}
              </Badge>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{post.title}</h1>

          <p className="text-lg text-muted-foreground">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>

            {post.author && (
              <div className="flex items-center gap-1">
                <span>By {post.author}</span>
              </div>
            )}
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        {post.content && (
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <PortableText
              value={post.content}
              components={portableTextComponents}
            />
          </div>
        )}

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <Card className="mt-12 p-6">
            <h3 className="text-lg font-semibold mb-4">Related Posts</h3>
            <div className="space-y-4">
              {post.relatedPosts.map((relatedPost: any) => (
                <Link
                  key={relatedPost._id}
                  href={`/blog/${relatedPost.slug.current}`}
                  className="block hover:bg-muted/50 p-4 rounded-lg transition-colors"
                >
                  <div className="flex gap-4">
                    {relatedPost.featuredImage && (
                      <div className="relative w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                        <Image
                          src={urlForImage(relatedPost.featuredImage)}
                          alt={relatedPost.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium line-clamp-1">{relatedPost.title}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {relatedPost.categories?.map((cat: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        )}

        {/* Share */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <ShareButton title={post.title} text={post.excerpt} />
        </div>
      </div>
    </article>
  );
}
