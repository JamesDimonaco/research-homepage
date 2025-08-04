import { defineField, defineType } from "sanity";

const publicationType = defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "publicationDate",
      title: "Publication Date",
      type: "date",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "googleScholarLink",
      title: "Google Scholar Link",
      type: "url",
    }),
    defineField({
      name: "linkButtonText",
      title: "Link Button Text",
      type: "string",
      description: "Custom text for the link button (defaults to 'Read on Google Scholar')",
      initialValue: "Read on Google Scholar",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
  ],
});
export default publicationType;
