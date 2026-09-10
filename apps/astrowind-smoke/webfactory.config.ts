import { defineProject } from '@webfactory/core';

export default defineProject({
  name: 'Astrowind Smoke',
  slug: 'astrowind-smoke',
  template: 'astrowind',
  theme: 'default',
  pages: ["home","about","services","contact"],
});
