import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { pageContentSchema } from '@webfactory/core/content';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content' }),
  schema: pageContentSchema,
});

export const collections = { pages };
