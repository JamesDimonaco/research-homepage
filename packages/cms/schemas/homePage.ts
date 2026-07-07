import { defineField, defineType } from "sanity";

const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "metrics", title: "Metrics" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "your name",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Profile Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "affiliation",
      title: "Affiliation",
      type: "string",
      description:
        "Institution / department (e.g. Queen's University Belfast). Auto-filled by the ORCID importer.",
    }),
    defineField({
      name: "orcid",
      title: "ORCID iD",
      type: "string",
      description:
        "e.g. 0000-0002-1825-0097. Powers the citation-metrics strip and the ORCID importer.",
      validation: (Rule) =>
        Rule.regex(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/, {
          name: "ORCID iD",
          invert: false,
        }).warning("Should look like 0000-0002-1825-0097"),
    }),
    defineField({
      name: "citationsOverride",
      title: "Citations (manual override)",
      type: "number",
      group: "metrics",
      description:
        "Leave blank to use the live OpenAlex value. Set this to show an exact figure (e.g. from Google Scholar) instead.",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "hIndexOverride",
      title: "h-index (manual override)",
      type: "number",
      group: "metrics",
      description: "Leave blank to use the live OpenAlex value.",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "i10IndexOverride",
      title: "i10-index (manual override)",
      type: "number",
      group: "metrics",
      description: "Leave blank to use the live OpenAlex value.",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "publicationsOverride",
      title: "Publications count (manual override)",
      type: "number",
      group: "metrics",
      description:
        "Leave blank to use the deduped count from your ORCID record. Set to pin an exact number.",
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: "metricsSourceLabel",
      title: "Metrics source label",
      type: "string",
      group: "metrics",
      description:
        'Shown under the metrics strip (e.g. "OpenAlex" or "Google Scholar"). Defaults to "OpenAlex".',
    }),
    defineField({
      name: "bio",
      title: "Biography",
      type: "text",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [{ type: "section" }],
    }),
  ],
});

export default homePageType;
