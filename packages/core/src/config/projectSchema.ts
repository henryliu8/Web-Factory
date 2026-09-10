import { z } from "zod";

const identifierSchema = z.string().trim().min(1);

export const projectConfigSchema = z
  .object({
    name: z.string().trim().min(1, "Project name is required."),
    slug: identifierSchema.regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Project slug must use lowercase kebab-case.",
    ),
    template: identifierSchema,
    theme: identifierSchema,
    pages: z.array(identifierSchema).min(1, "At least one page is required."),
    site: z
      .object({
        url: z.string().url().optional(),
        language: identifierSchema.optional(),
      })
      .optional(),
    deploy: z
      .object({
        provider: identifierSchema.optional(),
      })
      .optional(),
  })
  .passthrough();

export type ProjectConfig = z.infer<typeof projectConfigSchema>;

export function parseProjectConfig(input: unknown): ProjectConfig {
  return projectConfigSchema.parse(input);
}
