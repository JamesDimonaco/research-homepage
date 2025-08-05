import { defineField, defineType } from "sanity";

export default defineType({
  name: "conference",
  title: "Conference Talk/Presentation",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Talk Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "type",
      title: "Presentation Type",
      type: "string",
      options: {
        list: [
          { title: "Keynote", value: "keynote" },
          { title: "Invited Talk", value: "invited" },
          { title: "Conference Talk", value: "conference" },
          { title: "Workshop", value: "workshop" },
          { title: "Poster", value: "poster" },
          { title: "Panel", value: "panel" },
          { title: "Seminar", value: "seminar" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "conference",
      title: "Conference/Event Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "City, Country or Virtual",
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "abstract",
      title: "Abstract",
      type: "text",
      rows: 5,
      description: "Talk abstract or description",
    }),
    defineField({
      name: "description",
      title: "Full Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Detailed description with rich text formatting (optional)",
    }),
    defineField({
      name: "image",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Conference photo or presentation slide",
    }),
    defineField({
      name: "slides",
      title: "Presentation Slides",
      type: "object",
      fields: [
        defineField({
          name: "embedUrl",
          title: "Embed URL",
          type: "url",
          description: "Google Slides, SlideShare, or other embed URL",
        }),
        defineField({
          name: "downloadUrl",
          title: "Download URL",
          type: "url",
          description: "Direct link to PDF or PowerPoint file",
        }),
      ],
    }),
    defineField({
      name: "video",
      title: "Video Recording",
      type: "object",
      fields: [
        defineField({
          name: "embedUrl",
          title: "Video Embed URL",
          type: "url",
          description: "YouTube, Vimeo, or other video URL",
        }),
        defineField({
          name: "platform",
          title: "Video Platform",
          type: "string",
          options: {
            list: [
              { title: "YouTube", value: "youtube" },
              { title: "Vimeo", value: "vimeo" },
              { title: "Other", value: "other" },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: "links",
      title: "Additional Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Link Title",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "url",
              title: "URL",
              type: "url",
              validation: (Rule) => Rule.required(),
            }),
          ],
        },
      ],
      description: "Conference website, paper, code repo, etc.",
    }),
    defineField({
      name: "coAuthors",
      title: "Co-presenters",
      type: "array",
      of: [{ type: "string" }],
      description: "Names of co-presenters if any",
    }),
    defineField({
      name: "relatedPublication",
      title: "Related Publication",
      type: "reference",
      to: [{ type: "publication" }],
      description: "Link to related paper if applicable",
    }),
    defineField({
      name: "keywords",
      title: "Keywords/Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "featured",
      title: "Featured Talk",
      type: "boolean",
      description: "Show this talk prominently",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order for displaying talks (lower numbers first)",
    }),
  ],
  preview: {
    select: {
      title: "title",
      conference: "conference",
      date: "date",
      type: "type",
      media: "image",
    },
    prepare(selection) {
      const { title, conference, date, type, media } = selection;
      const year = date ? new Date(date).getFullYear() : "";
      return {
        title,
        subtitle: `${conference} ${year ? `• ${year}` : ""} • ${type ? type.charAt(0).toUpperCase() + type.slice(1) : ""}`,
        media,
      };
    },
  },
});