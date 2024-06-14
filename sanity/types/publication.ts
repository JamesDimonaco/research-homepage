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
  ],
});
export default publicationType;
