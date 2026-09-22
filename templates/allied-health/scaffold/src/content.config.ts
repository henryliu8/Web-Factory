import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { pageSchema } from "@webfactory/template-allied-health/schema";
export const collections = {
  pages: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content" }),
    schema: pageSchema,
  }),
};
