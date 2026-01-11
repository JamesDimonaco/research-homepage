import { createSanityClient } from "@research-homepage/cms";
import { apiVersion, dataset, projectId, useCdn } from "../env";

const { client, sanityFetch } = createSanityClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
});

export { client, sanityFetch };
