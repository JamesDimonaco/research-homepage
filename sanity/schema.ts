import { type SchemaTypeDefinition } from "sanity";
import {
  homePageType,
  contactInfoType,
  publicationType,
  sectionType,
  toolType,
  PageType,
  ContentType,
  CTAType,
  projectType,
  conferenceType,
} from "./types";
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    homePageType,
    contactInfoType,
    publicationType,
    sectionType,
    toolType,
    PageType,
    ContentType,
    CTAType,
    projectType,
    conferenceType,
  ],
};
