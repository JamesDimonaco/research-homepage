import { sanityFetch } from "@/sanity/lib/client";
import { Header } from "@research-homepage/components";
import type { HomePage } from "@research-homepage/cms";

export default async function HeaderWrapper() {
  // Fetch counts for all content types and the homepage data for the site name
  const [projects, conferences, publications, datasets, news, tools, blog, homePage] = await Promise.all([
    sanityFetch<number>({ query: `count(*[_type == "project"])` }),
    sanityFetch<number>({ query: `count(*[_type == "conference"])` }),
    sanityFetch<number>({ query: `count(*[_type == "publication"])` }),
    sanityFetch<number>({ query: `count(*[_type == "dataset"])` }),
    sanityFetch<number>({ query: `count(*[_type == "news" && draft != true])` }),
    sanityFetch<number>({ query: `count(*[_type == "tool"])` }),
    sanityFetch<number>({ query: `count(*[_type == "blog" && draft != true])` }),
    sanityFetch<HomePage>({ query: `*[_type == "homePage"][0]{ name }` }),
  ]);

  const contentCounts = {
    projects,
    conferences,
    publications,
    datasets,
    news,
    tools,
    blog,
  };

  // Use the name from CMS, fallback to default
  const siteName = homePage?.name || "Dr. Nicholas Dimonaco";

  return <Header siteName={siteName} contentCounts={contentCounts} />;
}
