import { defineField, defineType } from "sanity";

const sectionType = defineType({
  name: "section",
  title: "Section",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
    }),
    defineField({
      name: "orientation",
      title: "Orientation",
      type: "string",
      options: {
        list: [
          { title: "Image Left, Text Right", value: "imageLeft" },
          { title: "Image Right, Text Left", value: "imageRight" },
        ],
      },
    }),
  ],
});
export default sectionType;
