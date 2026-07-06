import { definePlugin } from "sanity";
import { DownloadIcon } from "@sanity/icons";
import { OrcidImportTool } from "./OrcidImportTool";

/**
 * Adds an "Import from ORCID" tool to the Studio nav. Fetches a researcher's
 * publications from OpenAlex by ORCID iD and creates them as draft
 * `publication` documents, deduped against what's already in the dataset.
 *
 * Register in an app's sanity.config.ts plugins array: `orcidImportTool()`.
 */
export const orcidImportTool = definePlugin({
  name: "orcid-import",
  tools: [
    {
      name: "orcid-import",
      title: "Import from ORCID",
      icon: DownloadIcon,
      component: OrcidImportTool,
    },
  ],
});

export {
  fetchWorksByOrcid,
  fetchAuthorByOrcid,
  fetchScholarMetrics,
  normaliseOrcid,
  normaliseDoi,
} from "./openalex";
export type { MappedWork, AuthorProfile, ScholarMetrics } from "./openalex";
