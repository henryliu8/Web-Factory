import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { createStyleRuntime } from '@webfactory/core';
import astrowind from '@webfactory/template-astrowind/integration';
import project from './webfactory.config';

const { vitePlugin: webFactoryStyles } = createStyleRuntime({
  applicationStyle: fileURLToPath(new URL('./src/styles/global.css', import.meta.url)),
  project,
  catalog: {
    templates: {
      astrowind: { style: '@webfactory/template-astrowind/styles' },
      stardrive: { style: '@webfactory/template-stardrive/styles' },
    },
    themes: {
      default: { style: '@webfactory/theme-default/styles' },
      luxury: { style: '@webfactory/theme-luxury/styles' },
    },
  },
});

export default defineConfig({
  output: 'static',
  integrations: [
    sitemap(),
    mdx(),
    icon({ include: { tabler: ['*'], 'flat-color-icons': ['*'] } }),
    astrowind({ config: './src/config.yaml' }),
  ],
  image: {
    domains: ['images.unsplash.com', 'cdn.pixabay.com'],
    responsiveStyles: true,
  },
  vite: {
    plugins: [webFactoryStyles, tailwindcss()],
  },
});
