import type { Image } from "sanity";

export interface ComponentsConfig {
  urlForImage: (source: Image) => string | null | undefined;
}

let config: ComponentsConfig | null = null;

export function configureComponents(newConfig: ComponentsConfig) {
  config = newConfig;
}

export function getConfig(): ComponentsConfig {
  if (!config) {
    throw new Error(
      "@research-homepage/components not configured. " +
      "Call configureComponents({ urlForImage }) in your app's layout."
    );
  }
  return config;
}

export function getUrlForImage() {
  return getConfig().urlForImage;
}
