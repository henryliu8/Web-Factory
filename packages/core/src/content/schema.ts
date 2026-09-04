import { z } from 'zod';

const ctaSchema = z.object({
  type: z.literal('cta/CTA'),
  title: z.string().min(1),
  description: z.string().optional(),
  button: z.object({
    label: z.string(),
    href: z.string(),
  }).optional(),
});

const featureGridSchema = z.object({
  type: z.literal('features/FeatureGrid'),
  title: z.string().optional(),
  intro: z.string().optional(),
  items: z.array(z.object({
    title: z.string().min(1),
    description: z.string(),
  })),
});

const heroSchema = z.object({
  type: z.literal('hero/HeroFullscreen'),
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  image: z.string().optional(),
  primaryCTA: z.object({
    label: z.string(),
    href: z.string(),
  }).optional(),
  secondaryCTA: z.object({
    label: z.string(),
    href: z.string(),
  }).optional(),
});

// A fallback schema for sections not explicitly defined above
export const sectionDefinitionSchema = z.discriminatedUnion('type', [
  ctaSchema,
  featureGridSchema,
  heroSchema,
]);

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
