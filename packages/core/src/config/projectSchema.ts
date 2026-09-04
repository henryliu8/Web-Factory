import { z } from 'zod';

export const projectConfigSchema = z.object({
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  template: z.string().min(1),
  theme: z.string().min(1),
  pages: z.array(z.string().min(1)),
  site: z.object({
    url: z.string().url().optional(),
    language: z.string().min(1).optional(),
  }).optional(),
  deploy: z.object({
    provider: z.string().min(1).optional(),
  }).optional(),
}).passthrough();

export type ProjectConfig = z.infer<typeof projectConfigSchema>;

export function parseProjectConfig(input: unknown): ProjectConfig {
  return projectConfigSchema.parse(input);
}
