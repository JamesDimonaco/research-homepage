import { defineField, defineType } from "sanity";

const contactInfoType = defineType({
  name: "contactInfo",
  title: "Contact Information",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
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
    }),
    defineField({
      name: "X",
      title: "X Profile",
      type: "url",
    }),
  ],
});
export default contactInfoType;
