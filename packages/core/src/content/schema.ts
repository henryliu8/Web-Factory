import { z } from 'zod';

const actionSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const heroSchema = z.object({
  type: z.literal('hero/HeroFullscreen'),
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  image: z.union([
    z.string(),
    z.object({ src: z.string().min(1), alt: z.string().optional() }),
  ]).optional(),
  primaryCTA: actionSchema.optional(),
  secondaryCTA: actionSchema.optional(),
  align: z.enum(['start', 'center', 'end']).optional(),
}).passthrough();

const featureGridSchema = z.object({
  type: z.literal('features/FeatureGrid'),
  title: z.string().optional(),
  intro: z.string().optional(),
  items: z.array(z.object({
    title: z.string().min(1),
    description: z.string(),
    icon: z.string().optional(),
    href: z.string().optional(),
  })),
}).passthrough();

const ctaSchema = z.object({
  type: z.literal('cta/CTA'),
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  button: actionSchema.optional(),
  secondaryButton: actionSchema.optional(),
}).passthrough();

export const sectionDefinitionSchema = z.discriminatedUnion('type', [
  heroSchema,
  featureGridSchema,
  ctaSchema,
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
