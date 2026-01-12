import { sanityFetch } from "@/sanity/lib/client";
import { BlogCard } from "@research-homepage/components";
import type { Blog } from "@research-homepage/cms";

export default async function BlogPage() {
  const posts = await sanityFetch<Blog[]>({
    query: `*[_type == "blog" && !draft] | order(featured desc, publishedAt desc)`,
  });

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
      <h1 className="text-4xl md:text-5xl font-bold mb-8">Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.map((post) => (
          <BlogCard key={post._id} post={post} />
        ))}
      </div>

      {(!posts || posts.length === 0) && (
        <p className="text-muted-foreground text-center py-12">
          No blog posts yet. Add some in Sanity Studio.
        </p>
      )}
    </div>
  );
}
