import { defineField, defineType } from "sanity";

export const Accordion = defineType({
  name: "accordion",
  title: "Accordion",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
    }),
  ],
});

export const Button = defineType({
  name: "button",
  title: "Button",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
    }),
  ],
});

export const Card = defineType({
  name: "card",
  title: "Card",
  type: "object",
  fields: [
    defineField({
      name: "header",
      title: "Header",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      fields: [
        defineField({
          name: "text",
          title: "Text",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "includeHeader",
      title: "Include Header",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "includeFooter",
      title: "Include Footer",
      type: "boolean",
      initialValue: true,
    }),
  ],
});

export const Carousel = defineType({
  name: "carousel",
  title: "Carousel",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Carousel Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "carouselItem",
          fields: [
            defineField({
              name: "title",
              title: "Item Title",
              type: "string",
              description:
                "A title for this carousel item (for admin purposes)",
            }),
            defineField({
              name: "content",
              title: "Content",
              type: "array",
              of: [
                { type: "block" },
                { type: "image", options: { hotspot: true } },
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              media: "content.0",
            },
            prepare(selection) {
              const { title, media } = selection;
              return {
                title: title || "Untitled Carousel Item",
                media: media?.asset ? media : undefined,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "showArrows",
      title: "Show Navigation Arrows",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "autoPlay",
      title: "Auto Play",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "interval",
      title: "Autoplay Interval (in milliseconds)",
      type: "number",
      initialValue: 3000,
      hidden: ({ parent }) => !parent?.autoPlay,
    }),
  ],
  preview: {
    select: {
      title: "items.0.title",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: title || "Carousel",
      };
    },
  },
});

export const Collapsible = defineType({
  name: "collapsible",
  title: "Collapsible",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "text",
    }),
  ],
});

export const Command = defineType({
  name: "command",
  title: "Command",
  type: "object",
  fields: [
    defineField({
      name: "command",
      title: "Command",
      type: "string",
    }),
  ],
});

export const RadioGroup = defineType({
  name: "radioGroup",
  title: "Radio Group",
  type: "object",
  fields: [
    defineField({
      name: "options",
      title: "Options",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});

export const Separator = defineType({
  name: "separator",
  title: "Separator",
  type: "object",
  fields: [
    defineField({
      name: "style",
      title: "Style",
      type: "string",
      options: {
        list: [
          { title: "Solid", value: "solid" },
          { title: "Dashed", value: "dashed" },
          { title: "Dotted", value: "dotted" },
        ],
      },
    }),
  ],
});
