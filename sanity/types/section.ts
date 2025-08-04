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
    defineField({
      name: "linkUrl",
      title: "Link URL (optional)",
      type: "string",
      description: "Add a URL to make this section clickable. Can be internal (/publications) or external (https://example.com)",
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab",
      type: "boolean",
      description: "Open link in a new browser tab (external links always open in new tab)",
      hidden: ({ parent }) => !parent?.linkUrl,
      initialValue: false,
    }),
  ],
});
export default sectionType;
