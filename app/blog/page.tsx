import { sanityFetch } from "@/sanity/lib/client";
import { Blog } from "../types/sanity";
import BlogCard from "../components/BlogCard";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const blogQuery = `*[_type == "blog" && draft != true] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  excerpt,
  featuredImage,
  categories,
  tags,
  author,
  readingTime,
  featured
}`;

export default async function BlogPage() {
  const posts = await sanityFetch<Blog[]>({ query: blogQuery });

  // Get unique categories from posts
  const allCategories = Array.from(
    new Set(posts.flatMap(post => post.categories || []))
  );

  const categoryCounts = allCategories.reduce((acc, category) => {
    acc[category] = posts.filter(post =>
      post.categories?.includes(category)
    ).length;
    return acc;
  }, {} as Record<string, number>);

  const categoryLabels: Record<string, string> = {
    research: "Research",
    tutorial: "Tutorials",
    opinion: "Opinion",
    technical: "Technical",
    career: "Career",
    personal: "Personal",
  };

  const featuredPosts = posts.filter(p => p.featured);

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-bold">Blog</h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Thoughts, tutorials, and insights on research, technology, and academia.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No blog posts found. Add some in Sanity Studio!</p>
        </div>
      ) : (
        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="flex flex-wrap h-auto gap-2">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All Posts
              <Badge variant="secondary" className="ml-2">{posts.length}</Badge>
            </TabsTrigger>
            {allCategories.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {categoryLabels[category] || category}
                <Badge variant="secondary" className="ml-2">
                  {categoryCounts[category]}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            {featuredPosts.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-6">Featured Posts</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {featuredPosts.map((post) => (
                    <BlogCard key={post._id} post={post} featured />
                  ))}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-semibold mb-6">All Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <BlogCard key={post._id} post={post} />
                ))}
              </div>
            </section>
          </TabsContent>

          {allCategories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-6">
              <div className="space-y-2 mb-6">
                <h2 className="text-2xl font-semibold">
                  {categoryLabels[category] || category}
                </h2>
                <p className="text-muted-foreground">
                  All posts in this category
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts
                  .filter((post) => post.categories?.includes(category))
                  .map((post) => (
                    <BlogCard key={post._id} post={post} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
