import { defineProject } from '@webfactory/core';

export default defineProject({
  name: 'Demo Site',
  slug: 'demo-site',
  template: 'stardrive',
  theme: 'default',
  pages: ["home","about","services","projects","contact"],
});
