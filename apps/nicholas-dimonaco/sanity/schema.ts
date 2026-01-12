import { type SchemaTypeDefinition } from "sanity";
import { allSchemas } from "@research-homepage/cms";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: allSchemas,
};
