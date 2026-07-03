import { createClient, type QueryParams } from "next-sanity";

export interface SanityClientConfig {
  projectId: string;
  dataset: string;
  apiVersion?: string;
  useCdn?: boolean;
}

export function createSanityClient(config: SanityClientConfig) {
  const {
    projectId,
    dataset,
    apiVersion = "2024-06-10",
    useCdn = true,
  } = config;

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn,
    perspective: "published",
  });

  async function sanityFetch<QueryResponse>({
    query,
    params = {},
    tags,
    revalidate,
  }: {
    query: string;
    params?: QueryParams;
    tags?: string[];
    revalidate?: number;
  }) {
    // Pages are prerendered static (served from CDN), so TTFB is low regardless.
    // Revalidate governs content freshness: 5 min balances edit-latency vs regen load.
    const defaultRevalidate = process.env.NODE_ENV === "development" ? 30 : 300;

    return client.fetch<QueryResponse>(query, params, {
      next: {
        revalidate: revalidate ?? defaultRevalidate,
        tags,
      },
    });
  }

  return {
    client,
    sanityFetch,
  };
}

// Re-export types for convenience
export type { QueryParams };
