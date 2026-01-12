import { sanityFetch } from "@/sanity/lib/client";
import { Header } from "@research-homepage/components";
import type { HomePage } from "@research-homepage/cms";

export default async function HeaderWrapper() {
  // Fetch counts for each content type to determine which nav items to show
  const [
    projectsCount,
    conferencesCount,
    publicationsCount,
    datasetsCount,
    newsCount,
    toolsCount,
    blogCount,
    homePage,
  ] = await Promise.all([
    sanityFetch<number>({
      query: `count(*[_type == "project"])`,
    }),
    sanityFetch<number>({
      query: `count(*[_type == "conference"])`,
    }),
    sanityFetch<number>({
      query: `count(*[_type == "publication"])`,
    }),
    sanityFetch<number>({
      query: `count(*[_type == "dataset"])`,
    }),
    sanityFetch<number>({
      query: `count(*[_type == "news" && !draft])`,
    }),
    sanityFetch<number>({
      query: `count(*[_type == "tool"])`,
    }),
    sanityFetch<number>({
      query: `count(*[_type == "blog" && !draft])`,
    }),
    sanityFetch<HomePage>({
      query: `*[_type == "homePage"][0]{ name }`,
    }),
  ]);

  const contentCounts = {
    projects: projectsCount || 0,
    conferences: conferencesCount || 0,
    publications: publicationsCount || 0,
    datasets: datasetsCount || 0,
    news: newsCount || 0,
    tools: toolsCount || 0,
    blog: blogCount || 0,
  };

  // TODO: Update fallback name with your name
  const siteName = homePage?.name || "Researcher Name";

  return <Header siteName={siteName} contentCounts={contentCounts} />;
}
