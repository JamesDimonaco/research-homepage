import { createSanityClient } from "@research-homepage/cms";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-06-10";

const { client, sanityFetch } = createSanityClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

export { client, sanityFetch };
