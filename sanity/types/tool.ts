import { defineField, defineType } from "sanity";

const toolType = defineType({
  name: "tool",
  title: "Tool",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
    }),
    defineField({
      name: "githubLink",
      title: "GitHub Link",
      type: "url",
    }),
  ],
});
export default toolType;
