// Schemas
export * from "./schemas";

// Library utilities
export { createSanityClient, type SanityClientConfig, type QueryParams } from "./lib/client";
export { createImageBuilder, type ImageBuilderConfig } from "./lib/image";
export { serializeJsonLd, safeUrl, stripUnsafeChars } from "./lib/security";

// Plugins
export { DoiInput, createDoiInput, type DoiInputConfig } from "./plugins/doi-input";
export {
  orcidImportTool,
  fetchWorksByOrcid,
  fetchAuthorByOrcid,
  fetchScholarMetrics,
  fetchPublicationCountByOrcid,
  fetchWorksFromOrcid,
  normaliseOrcid,
  normaliseDoi,
  type MappedWork,
  type AuthorProfile,
  type ScholarMetrics,
} from "./plugins/orcid-import";

// Types
export * from "./types";
