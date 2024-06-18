import { defineField, defineType } from "sanity";

const ContentType = defineType({
  name: "content",
  title: "Content",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),

    defineField({
      name: "type",
      title: "Content Type",
      type: "string",
      options: {
        list: [
          { title: "Text", value: "text" },
          { title: "Image", value: "image" },
          { title: "CTA", value: "cta" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "text",
      title: "Text",
      type: "text",
      hidden: ({ parent }) => parent?.type === "image",
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
      name: "orientation",
      title: "Orientation",
      type: "string",
      options: {
        list: [
          { title: "Image Left, Text Right", value: "imageLeft" },
          { title: "Image Right, Text Left", value: "imageRight" },
        ],
        layout: "radio",
      },
      hidden: ({ parent }) =>
        parent?.image === undefined || parent?.type == "image",
    }),
    defineField({
      name: "cta",
      title: "Call to Action",
      type: "cta",
      hidden: ({ parent }) => parent?.type !== "cta",
    }),
    defineField({
      name: "displayDate",
      title: "Add a display date",
      type: "object",
      options: {
        collapsible: true,
        collapsed: true,
      },
      fields: [
        defineField({
          name: "dateText",
          title: "Date Text",
          type: "string",
        }),
        defineField({
          name: "date",
          title: "Date",
          type: "date",
        }),
      ],
    }),
  ],
});
export default ContentType;

export const CTAType = defineType({
  name: "cta",
  title: "Call to Action",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "buttonOrText",
      title: "Button or Text",
      type: "string",
      options: {
        list: [
          { title: "Button", value: "button" },
          { title: "Text", value: "text" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
    }),
    defineField({
      name: "size",
      title: "Size",
      type: "string",
      options: {
        list: [
          { title: "Small", value: "small" },
          { title: "Medium", value: "medium" },
          { title: "Large", value: "large" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
    }),
  ],
});
