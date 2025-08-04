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
    defineField({
      name: "linkButtonText",
      title: "Link Button Text",
      type: "string",
      description: "Custom text for the link button (defaults to 'View on GitHub')",
      initialValue: "View on GitHub",
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
export default toolType;
