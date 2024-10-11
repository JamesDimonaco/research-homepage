import { defineArrayMember, defineField, defineType } from "sanity";

const PageType = defineType({
  name: "page",
  title: "Pages",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Page Name",
      type: "string",
      description: "Page Title",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        slugify: (input) =>
          input.toLowerCase().replace(/\s+/g, "-").slice(0, 200),
      },
      validation: (Rule) => Rule.required(),
      hidden: ({ document }) => !document?.name,
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "accordion" },
        { type: "button" },
        { type: "card" },
        { type: "carousel" },
        { type: "collapsible" },
        { type: "command" },
        { type: "radioGroup" },
        { type: "separator" },
      ],
    }),
  ],
});

export default PageType;
