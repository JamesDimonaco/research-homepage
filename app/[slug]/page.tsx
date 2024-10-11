import React from "react";
import { SanityDocument } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import PageTitle from "../_components/PageTitle";
import ComponentMap from "@/app/_components/ComponentMap";

type Params = {
  params: { slug: string };
};
type ContentItem = {
  _type: keyof typeof ComponentMap; // Ensure _type corresponds to keys in ComponentMap
  // Define other properties as needed based on your Sanity schema
};

export default async function sanityPage({ params }: Params) {
  const { slug } = params;
  console.log(slug);

  const query = `*[_type == "page" && slug.current == "${slug}"][0]{
    ...,
    content[] {
      ...
    }
  }`;

  const page = await sanityFetch<SanityDocument>({ query });

  console.log(page);

  return (
    <main className="bg-gray-100 dark:bg-gray-900 py-24 h-screen">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <PageTitle titleText={page.name} />
        {page.content.map((contentItem: ContentItem, index: number) => {
          const Component: React.ComponentType<any> =
            ComponentMap[contentItem._type];

          console.log(contentItem);

          return Component ? (
            <Component key={index.toString()} {...contentItem} />
          ) : null;
        })}
      </div>
    </main>
  );
}
