import { defineField, defineType } from "sanity";

const homePageType = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
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
