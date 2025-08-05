import { defineField, defineType } from "sanity";

export default defineType({
  name: "project",
  title: "Research Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project Title",
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
      name: "status",
      title: "Project Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Completed", value: "completed" },
          { title: "Planning", value: "planning" },
          { title: "On Hold", value: "on_hold" },
        ],
      },
      initialValue: "active",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "startDate",
      title: "Start Date",
      type: "date",
    }),
    defineField({
      name: "endDate",
      title: "End Date",
      type: "date",
    }),
    defineField({
      name: "summary",
      title: "Brief Summary",
      type: "text",
      rows: 3,
      description: "A short summary of the project (2-3 sentences)",
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: "description",
      title: "Full Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Detailed project description with rich text formatting",
    }),
    defineField({
      name: "image",
      title: "Project Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "funding",
      title: "Funding Information",
      type: "object",
      fields: [
        defineField({
          name: "source",
          title: "Funding Source",
          type: "string",
          description: "e.g., NSF, NIH, European Research Council",
        }),
        defineField({
          name: "amount",
          title: "Funding Amount",
          type: "string",
          description: "e.g., $500,000",
        }),
        defineField({
          name: "grantNumber",
          title: "Grant Number",
          type: "string",
          description: "Grant/Award number",
        }),
      ],
    }),
    defineField({
      name: "collaborators",
      title: "Collaborators",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              description: "e.g., Co-PI, Postdoc, PhD Student",
            }),
            defineField({
              name: "institution",
              title: "Institution",
              type: "string",
            }),
            defineField({
              name: "url",
              title: "Website URL",
              type: "url",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "publications",
      title: "Related Publications",
      type: "array",
      of: [{ type: "reference", to: [{ type: "publication" }] }],
      description: "Link to publications from this project",
    }),
    defineField({
      name: "links",
      title: "External Links",
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
      description: "Project website, GitHub repo, etc.",
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
      title: "Featured Project",
      type: "boolean",
      description: "Show this project prominently",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order for displaying projects (lower numbers first)",
    }),
  ],
  preview: {
    select: {
      title: "title",
      status: "status",
      media: "image",
      startDate: "startDate",
    },
    prepare(selection) {
      const { title, status, media, startDate } = selection;
      const year = startDate ? new Date(startDate).getFullYear() : "";
      return {
        title,
        subtitle: `${status ? status.charAt(0).toUpperCase() + status.slice(1) : ""} ${year ? `• ${year}` : ""}`,
        media,
      };
    },
  },
});