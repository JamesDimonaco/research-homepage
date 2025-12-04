import { defineField, defineType } from "sanity";

export default defineType({
  name: "news",
  title: "News/Updates",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Path",
      type: "slug",
      description: "This creates the web address for your news post. Click 'Generate' to auto-create from title. Example: 'New Paper Published in Nature' → 'new-paper-published-in-nature'. The full URL will be: yoursite.com/news/new-paper-published-in-nature",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error("Please click 'Generate' to create a URL path"),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Research Update", value: "research" },
          { title: "Software Release", value: "software" },
          { title: "Publication", value: "publication" },
          { title: "Award/Recognition", value: "award" },
          { title: "Conference/Talk", value: "conference" },
          { title: "General News", value: "general" },
          { title: "Lab News", value: "lab" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "Brief summary for the news list view",
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { 
          type: "block",
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
            {
              name: "alt",
              type: "string",
              title: "Alt text",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "image",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "relatedProject",
      title: "Related Project",
      type: "reference",
      to: [{ type: "project" }],
    }),
    defineField({
      name: "relatedPublication",
      title: "Related Publication",
      type: "reference",
      to: [{ type: "publication" }],
    }),
    defineField({
      name: "relatedTool",
      title: "Related Tool",
      type: "reference",
      to: [{ type: "tool" }],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show this prominently on the homepage",
      initialValue: false,
    }),
    defineField({
      name: "draft",
      title: "Draft",
      type: "boolean",
      description: "Draft posts won't be shown publicly",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      date: "date",
      media: "image",
      draft: "draft",
    },
    prepare(selection) {
      const { title, category, date, media, draft } = selection;
      const dateStr = date ? new Date(date).toLocaleDateString() : "";
      return {
        title: `${draft ? "🔸 " : ""}${title}`,
        subtitle: `${category ? category.charAt(0).toUpperCase() + category.slice(1) : ""} • ${dateStr}`,
        media,
      };
    },
  },
});