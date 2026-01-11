import homePageType from "./homePage";
import publicationType from "./publication";
import toolType from "./tool";
import contactInfoType from "./contactInfo";
import sectionType from "./section";
import projectType from "./project";
import conferenceType from "./conference";
import cvType from "./cv";
import newsType from "./news";
import researchInterestType from "./researchInterest";
import datasetType from "./dataset";
import blogType from "./blog";

export {
  homePageType,
  publicationType,
  toolType,
  contactInfoType,
  sectionType,
  projectType,
  conferenceType,
  cvType,
  newsType,
  researchInterestType,
  datasetType,
  blogType,
};

// Export all schemas as an array for convenience
export const allSchemas = [
  homePageType,
  publicationType,
  toolType,
  contactInfoType,
  sectionType,
  projectType,
  conferenceType,
  cvType,
  newsType,
  researchInterestType,
  datasetType,
  blogType,
];
