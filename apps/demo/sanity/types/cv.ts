import { defineField, defineType } from "sanity";

export default defineType({
  name: "cv",
  title: "CV/Resume",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "e.g., 'Academic CV', 'Industry Resume', 'Short CV'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      description: "e.g., 'v2.1', 'December 2024'",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Brief description of this CV version or what it's tailored for",
    }),
    defineField({
      name: "file",
      title: "CV File",
      type: "file",
      options: {
        accept: ".pdf,.doc,.docx",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "fileSize",
      title: "File Size",
      type: "string",
      description: "e.g., '245 KB' (will be calculated automatically if possible)",
      readOnly: true,
    }),
    defineField({
      name: "pages",
      title: "Number of Pages",
      type: "number",
      description: "Number of pages in the document",
    }),
    defineField({
      name: "isPublic",
      title: "Public",
      type: "boolean",
      description: "Make this CV publicly downloadable",
      initialValue: true,
    }),
    defineField({
      name: "isPrimary",
      title: "Primary CV",
      type: "boolean",
      description: "This is the main/default CV to show",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Order for displaying CVs (lower numbers first)",
    }),
  ],
  preview: {
    select: {
      title: "title",
      version: "version",
      date: "lastUpdated",
      isPrimary: "isPrimary",
    },
    prepare(selection) {
      const { title, version, date, isPrimary } = selection;
      const dateStr = date ? new Date(date).toLocaleDateString() : "";
      return {
        title: `${title} ${isPrimary ? "⭐" : ""}`,
        subtitle: `${version} • ${dateStr}`,
      };
    },
  },
});