import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { createStyleRuntime } from '@webfactory/core';
import project from './webfactory.config';

const { vitePlugin: webFactoryStyles } = createStyleRuntime({
  applicationStyle: fileURLToPath(new URL('./src/styles/global.css', import.meta.url)),
  project,
  catalog: {
    templates: {
      stardrive: { style: '@webfactory/template-stardrive/styles' },
    },
    themes: {
      default: { style: '@webfactory/theme-default/styles' },
      luxury: { style: '@webfactory/theme-luxury/styles' },
    },
  },
});

export default defineConfig({
  vite: {
    plugins: [webFactoryStyles, tailwindcss()],
  },
});
