import { createClient, type QueryParams } from "next-sanity";

import { apiVersion, dataset, projectId, useCdn } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  perspective: "published",
});

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}) {
  return client.fetch<QueryResponse>(query, params, {
    //TODO - revalidate to 3600 for production
    next: {
      // revalidate: process.env.NODE_ENV === "development" ? 30 : 60,
      tags,
      revalidate: 1,
    },
  });
}
