import { z } from 'zod';

export const sectionDefinitionSchema = z.object({
  type: z.string().min(1, 'Section type is required'),
}).passthrough();

export const sectionsSchema = z.array(sectionDefinitionSchema);

export const pageContentSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  sections: sectionsSchema,
}).passthrough();

export type SectionDefinition = z.infer<typeof sectionDefinitionSchema>;
export type PageContent = z.infer<typeof pageContentSchema>;

export function parseSections(input: unknown): SectionDefinition[] {
  return sectionsSchema.parse(input);
}
