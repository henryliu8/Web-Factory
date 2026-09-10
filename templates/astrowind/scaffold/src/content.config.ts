import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: 'src/content' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    sections: z.array(z.record(z.string(), z.unknown())).default([]),
  }),
});

export const collections = { pages };
