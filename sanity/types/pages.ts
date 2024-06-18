import { defineArrayMember, defineField, defineType } from "sanity";

const PageType = defineType({
  name: "pages",
  title: "Pages",
  type: "document",

  fields: [
    defineField({
      name: "name",
      title: "Page Name",
      type: "string",
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
        defineArrayMember({
          name: "content-child",
          type: "reference",
          to: [{ type: "content" }],
        }),
      ],
    }),
  ],
});

export default PageType;
