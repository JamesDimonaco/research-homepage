import { defineField, defineType } from "sanity";

export default defineType({
  name: "dataset",
  title: "Dataset",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Dataset Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Path",
      type: "slug",
      description: "This creates the web address for your dataset. Click 'Generate' to create from title. Example: 'COVID-19 Twitter Dataset v2' → 'covid-19-twitter-dataset-v2'. The page will be at: yoursite.com/datasets/covid-19-twitter-dataset-v2",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error("Please click 'Generate' to create a URL path"),
    }),
    defineField({
      name: "doi",
      title: "DOI",
      type: "string",
      description: "Digital Object Identifier if available",
    }),
    defineField({
      name: "version",
      title: "Version",
      type: "string",
      description: "e.g., 'v1.0', '2024.1'",
    }),
    defineField({
      name: "releaseDate",
      title: "Release Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "longDescription",
      title: "Detailed Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "dataType",
      title: "Data Type",
      type: "string",
      options: {
        list: [
          { title: "Tabular/CSV", value: "tabular" },
          { title: "Images", value: "images" },
          { title: "Text/Documents", value: "text" },
          { title: "Audio", value: "audio" },
          { title: "Video", value: "video" },
          { title: "Time Series", value: "timeseries" },
          { title: "Geospatial", value: "geospatial" },
          { title: "Mixed/Multi-modal", value: "mixed" },
          { title: "Code/Software", value: "code" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "size",
      title: "Dataset Size",
      type: "object",
      fields: [
        defineField({
          name: "fileSize",
          title: "File Size",
          type: "string",
          description: "e.g., '2.5 GB', '150 MB'",
        }),
        defineField({
          name: "samples",
          title: "Number of Samples",
          type: "string",
          description: "e.g., '10,000 images', '1M rows'",
        }),
      ],
    }),
    defineField({
      name: "license",
      title: "License",
      type: "string",
      options: {
        list: [
          { title: "CC0 (Public Domain)", value: "CC0" },
          { title: "CC BY 4.0", value: "CC-BY-4.0" },
          { title: "CC BY-SA 4.0", value: "CC-BY-SA-4.0" },
          { title: "CC BY-NC 4.0", value: "CC-BY-NC-4.0" },
          { title: "MIT", value: "MIT" },
          { title: "Apache 2.0", value: "Apache-2.0" },
          { title: "GPL v3", value: "GPL-3.0" },
          { title: "Custom/Other", value: "custom" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "accessType",
      title: "Access Type",
      type: "string",
      options: {
        list: [
          { title: "Open Access", value: "open" },
          { title: "Registration Required", value: "registration" },
          { title: "Request Access", value: "request" },
          { title: "Restricted", value: "restricted" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "downloadUrl",
      title: "Download URL",
      type: "url",
      description: "Direct download link if publicly available",
    }),
    defineField({
      name: "repositoryUrl",
      title: "Repository URL",
      type: "url",
      description: "Link to data repository (e.g., Zenodo, Figshare, GitHub)",
    }),
    defineField({
      name: "paperUrl",
      title: "Associated Paper",
      type: "url",
      description: "Link to paper describing the dataset",
    }),
    defineField({
      name: "citationText",
      title: "Citation",
      type: "text",
      rows: 3,
      description: "How to cite this dataset",
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
      name: "tags",
      title: "Tags/Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "image",
      title: "Preview Image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "Visualization or sample from the dataset",
    }),
    defineField({
      name: "featured",
      title: "Featured Dataset",
      type: "boolean",
      description: "Show this dataset prominently",
      initialValue: false,
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
  ],
  preview: {
    select: {
      title: "title",
      dataType: "dataType",
      date: "releaseDate",
      media: "image",
      featured: "featured",
    },
    prepare(selection) {
      const { title, dataType, date, media, featured } = selection;
      const year = date ? new Date(date).getFullYear() : "";
      return {
        title: `${featured ? "⭐ " : ""}${title}`,
        subtitle: `${dataType} • ${year}`,
        media,
      };
    },
  },
});