import { defineProject } from '@webfactory/core';

export default defineProject({
  name: '{{projectName}}',
  slug: '{{project}}',
  template: 'stardrive',
  theme: 'default',
  pages: ['home'],
});
