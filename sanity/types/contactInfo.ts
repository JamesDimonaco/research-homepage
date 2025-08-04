import { defineField, defineType } from "sanity";

const contactInfoType = defineType({
  name: "contactInfo",
  title: "Contact Information",
  type: "document",
  fields: [
    defineField({
      name: "emails",
      title: "Email Addresses",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Label",
              type: "string",
              description: "e.g., Work, Personal, Research",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "value",
              title: "Email Address",
              type: "string",
              validation: (Rule) => Rule.required().email(),
            },
          ],
          preview: {
            select: {
              title: "label",
              subtitle: "value",
            },
          },
        },
      ],
    }),
    defineField({
      name: "email",
      title: "Email (Legacy - for backward compatibility)",
      type: "string",
      hidden: true,
    }),
    defineField({
      name: "phone",
      title: "Phone Number",
      type: "string",
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn Profile",
      type: "url",
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }),
    }),
    defineField({
      name: "X",
      title: "X (Twitter) Profile",
      type: "url",
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }),
    }),
    defineField({
      name: "github",
      title: "GitHub Profile",
      type: "url",
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }),
    }),
    defineField({
      name: "googleScholar",
      title: "Google Scholar Profile",
      type: "url",
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https']
      }),
    }),
  ],
});
export default contactInfoType;
