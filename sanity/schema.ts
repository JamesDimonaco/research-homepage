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
} from "./types";
import {
  Button,
  Accordion,
  Card,
  Carousel,
  Collapsible,
  Command,
  RadioGroup,
  Separator,
} from "./types/components";
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
    Button,
    Accordion,
    Card,
    Carousel,
    Collapsible,
    Command,
    RadioGroup,
    Separator,
  ],
};
