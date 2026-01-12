import { createImageBuilder } from "@research-homepage/cms";
import type { Image } from "sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

const { urlForImage: urlForImageFn } = createImageBuilder({
  projectId,
  dataset,
});

export const urlForImage = (source: Image) => {
  return urlForImageFn(source);
};
