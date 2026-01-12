import createImageUrlBuilder from '@sanity/image-url';
import type { Image } from 'sanity';

export interface ImageBuilderConfig {
  projectId: string;
  dataset: string;
}

export function createImageBuilder(config: ImageBuilderConfig) {
  const { projectId, dataset } = config;

  const imageBuilder = createImageUrlBuilder({
    projectId: projectId || '',
    dataset: dataset || '',
  });

  function urlForImage(source: Image) {
    return imageBuilder?.image(source).auto('format').fit('max').url();
  }

  return {
    imageBuilder,
    urlForImage,
  };
}
