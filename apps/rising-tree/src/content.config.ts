import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { pageSchema } from "@webfactory/template-allied-health/schema";
export const collections = {
  pages: defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/pages" }),
    schema: pageSchema,
  }),
  services: defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/services" }),
    schema: pageSchema,
  }),
  team: defineCollection({
    loader: glob({ pattern: "**/*.json", base: "./src/content/team" }),
    schema: pageSchema,
  }),
};
