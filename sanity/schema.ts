import { type SchemaTypeDefinition } from "sanity";
import {
  homePageType,
  contactInfoType,
  publicationType,
  sectionType,
  toolType,
  projectType,
  conferenceType,
  cvType,
  newsType,
  researchInterestType,
  datasetType,
} from "./types";
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    homePageType,
    contactInfoType,
    publicationType,
    sectionType,
    toolType,
    projectType,
    conferenceType,
    cvType,
    newsType,
    researchInterestType,
    datasetType,
  ],
};
