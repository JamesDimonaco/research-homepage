import { defineField, defineType } from "sanity";

export default defineType({
  name: "blog",
  title: "Blog Post",
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
      description: "This creates the web address for your blog post. Click 'Generate' to auto-create from title.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error("Please click 'Generate' to create a URL path"),
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Brief excerpt for blog list view (recommended 150-200 characters)",
      validation: (Rule) => Rule.required().max(300),
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
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'},
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Numbered', value: 'number'},
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'},
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
                    validation: (Rule) => Rule.uri({
                      scheme: ['http', 'https', 'mailto'],
                    }),
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                    initialValue: true,
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
              validation: (Rule) => Rule.required(),
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text",
        },
      ],
      description: "Main image for the blog post",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
        list: [
          { title: "Research", value: "research" },
          { title: "Tutorial", value: "tutorial" },
          { title: "Opinion", value: "opinion" },
          { title: "Technical", value: "technical" },
          { title: "Career", value: "career" },
          { title: "Personal", value: "personal" },
        ],
      },
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
      description: "Keywords and topics for this post",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      description: "Author name (defaults to site owner if left empty)",
    }),
    defineField({
      name: "readingTime",
      title: "Reading Time",
      type: "number",
      description: "Estimated reading time in minutes (auto-calculated if left empty)",
    }),
    defineField({
      name: "featured",
      title: "Featured Post",
      type: "boolean",
      description: "Show this post prominently on the blog homepage",
      initialValue: false,
    }),
    defineField({
      name: "draft",
      title: "Draft",
      type: "boolean",
      description: "Draft posts won't be shown publicly",
      initialValue: false,
    }),
    defineField({
      name: "relatedPosts",
      title: "Related Blog Posts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "blog" }] }],
      description: "Manually select related posts",
    }),
  ],
  preview: {
    select: {
      title: "title",
      publishedAt: "publishedAt",
      featuredImage: "featuredImage",
      draft: "draft",
      featured: "featured",
      categories: "categories",
    },
    prepare(selection) {
      const { title, publishedAt, featuredImage, draft, featured, categories } = selection;
      const dateStr = publishedAt ? new Date(publishedAt).toLocaleDateString() : "";
      const prefix = draft ? "🔸 " : featured ? "⭐ " : "";
      const categoryStr = categories && categories.length > 0 ? categories[0] : "";

      return {
        title: `${prefix}${title}`,
        subtitle: `${categoryStr}${categoryStr && dateStr ? " • " : ""}${dateStr}`,
        media: featuredImage,
      };
    },
  },
  orderings: [
    {
      title: "Published Date, Newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
    {
      title: "Published Date, Oldest",
      name: "publishedAtAsc",
      by: [{ field: "publishedAt", direction: "asc" }],
    },
    {
      title: "Title, A-Z",
      name: "titleAsc",
      by: [{ field: "title", direction: "asc" }],
    },
  ],
});
