import type { TemplateConfig } from '@webfactory/core';

const template: TemplateConfig = {
  id: 'astrowind',
  name: 'AstroWind',
  description: 'A content-rich marketing, landing-page, and blog structure adapted for Web Factory.',
  layouts: {
    default: './src/layouts/PageLayout.astro',
    landing: './src/layouts/LandingLayout.astro',
    markdown: './src/layouts/MarkdownLayout.astro',
  },
  style: '@webfactory/template-astrowind/styles',
  metadata: {
    upstream: 'https://github.com/arthelokyo/astrowind',
    license: 'MIT',
  },
};

export default template;
