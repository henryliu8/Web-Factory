import { createSectionRegistry } from '@webfactory/core';
import { astrowindSectionRegistry } from '@webfactory/template-astrowind/sections';

const projectSections = import.meta.glob('../sections/**/*.astro', { eager: true, import: 'default' });

export const sectionRegistry = createSectionRegistry<unknown>([
  { name: 'template', entries: astrowindSectionRegistry },
  { name: 'project', entries: projectSections },
]);
