import { sanityFetch } from "@/sanity/lib/client";
import Header from "./Header";

export default async function HeaderWrapper() {
  // Fetch counts for all content types
  const [projects, conferences, publications, datasets, news, tools, blog] = await Promise.all([
    sanityFetch<number>({ query: `count(*[_type == "project"])` }),
    sanityFetch<number>({ query: `count(*[_type == "conference"])` }),
    sanityFetch<number>({ query: `count(*[_type == "publication"])` }),
    sanityFetch<number>({ query: `count(*[_type == "dataset"])` }),
    sanityFetch<number>({ query: `count(*[_type == "news" && draft != true])` }),
    sanityFetch<number>({ query: `count(*[_type == "tool"])` }),
    sanityFetch<number>({ query: `count(*[_type == "blog" && draft != true])` }),
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

  return <Header contentCounts={contentCounts} />;
}