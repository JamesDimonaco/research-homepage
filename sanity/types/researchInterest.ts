import { defineField, defineType } from "sanity";

export default defineType({
  name: "researchInterest",
  title: "Research Interest",
  type: "document",
  fields: [
    defineField({
      name: "keyword",
      title: "Keyword/Topic",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Primary Research Area", value: "primary" },
          { title: "Methodology", value: "methodology" },
          { title: "Application Domain", value: "application" },
          { title: "Technology", value: "technology" },
          { title: "Theory", value: "theory" },
          { title: "Interdisciplinary", value: "interdisciplinary" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Brief description of your work in this area",
    }),
    defineField({
      name: "weight",
      title: "Weight/Importance",
      type: "number",
      description: "1-10, affects size in tag cloud (10 = largest)",
      validation: (Rule) => Rule.required().min(1).max(10),
      initialValue: 5,
    }),
    defineField({
      name: "color",
      title: "Display Color",
      type: "string",
      options: {
        list: [
          { title: "Blue", value: "blue" },
          { title: "Green", value: "green" },
          { title: "Purple", value: "purple" },
          { title: "Amber", value: "amber" },
          { title: "Red", value: "red" },
          { title: "Teal", value: "teal" },
          { title: "Pink", value: "pink" },
          { title: "Indigo", value: "indigo" },
        ],
      },
      description: "Color theme for this interest",
    }),
    defineField({
      name: "relatedProjects",
      title: "Related Projects",
      type: "array",
      of: [{ type: "reference", to: [{ type: "project" }] }],
    }),
    defineField({
      name: "relatedPublications",
      title: "Related Publications",
      type: "array",
      of: [{ type: "reference", to: [{ type: "publication" }] }],
    }),
    defineField({
      name: "active",
      title: "Currently Active",
      type: "boolean",
      description: "Is this a current research interest?",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "For manual ordering if needed",
    }),
  ],
  preview: {
    select: {
      title: "keyword",
      category: "category",
      weight: "weight",
      active: "active",
    },
    prepare(selection) {
      const { title, category, weight, active } = selection;
      return {
        title: `${title} ${!active ? "(inactive)" : ""}`,
        subtitle: `${category} • Weight: ${weight}`,
      };
    },
  },
});