import { defineField, defineType } from "sanity";
import { DoiInput } from "../plugins/doi-input";

const publicationType = defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "status",
      title: "Publication Status",
      type: "string",
      options: {
        list: [
          { title: "Published", value: "published" },
          { title: "In Press", value: "in_press" },
          { title: "Accepted", value: "accepted" },
          { title: "Under Review", value: "under_review" },
          { title: "Preprint", value: "preprint" },
          { title: "Submitted", value: "submitted" },
          { title: "Other", value: "other" },
        ],
      },
    }),
    defineField({
      name: "customStatus",
      title: "Custom Status",
      type: "string",
      description: "Specify your custom status",
      hidden: ({ parent }) => parent?.status !== "other",
      validation: (Rule) =>
        Rule.custom((customStatus, context) => {
          const parent = context.parent as { status?: string };
          if (parent?.status === "other" && !customStatus) {
            return "Please specify a custom status";
          }
          return true;
        }),
    }),
    defineField({
      name: "publicationDate",
      title: "Publication Date",
      type: "date",
      description: "Leave empty if not yet published",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
      description: "Year of publication/submission (used for sorting). Optional for unpublished works.",
      validation: (Rule) => Rule.min(1900).max(2100),
    }),
    defineField({
      name: "journal",
      title: "Journal/Venue",
      type: "string",
      description: "Journal name, conference, or preprint server (e.g., Nature, arXiv, bioRxiv)",
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "text",
      rows: 2,
      description: "List of authors (e.g., Smith J, Doe A, Johnson B)",
    }),
    defineField({
      name: "description",
      title: "Abstract/Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "doi",
      title: "DOI",
      type: "string",
      description: "Digital Object Identifier - Enter DOI to auto-fill publication details",
      components: {
        input: DoiInput,
      },
    }),
    defineField({
      name: "googleScholarLink",
      title: "Google Scholar Link",
      type: "url",
    }),
    defineField({
      name: "preprintLink",
      title: "Preprint Link",
      type: "url",
      description: "Link to arXiv, bioRxiv, or other preprint server",
    }),
    defineField({
      name: "pdfLink",
      title: "PDF Link",
      type: "url",
      description: "Direct link to PDF if available",
    }),
    defineField({
      name: "linkButtonText",
      title: "Link Button Text",
      type: "string",
      description: "Custom text for the link button (defaults based on status)",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Figure or graphical abstract",
    }),
    defineField({
      name: "featured",
      title: "Featured Publication",
      type: "boolean",
      description: "Show this publication prominently",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      customStatus: "customStatus",
      year: "year",
      journal: "journal",
      media: "image",
    },
    prepare(selection) {
      const { title, status, customStatus, year, journal, media } = selection;
      const displayStatus = status === "other" ? customStatus : status;
      const statusLabel = displayStatus
        ? displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1).replace(/_/g, " ")
        : "";
      return {
        title,
        subtitle: `${statusLabel} • ${journal || "No venue"} • ${year || "No year"}`,
        media,
      };
    },
  },
});
export default publicationType;
