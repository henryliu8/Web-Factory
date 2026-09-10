import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import icon from 'astro-icon';
import astrowind from './src/integration/index.ts';

const virtualStyles = {
  name: 'webfactory-astrowind-check-styles',
  resolveId(id) {
    return id === 'virtual:webfactory-styles' ? '\0virtual:webfactory-styles' : undefined;
  },
  load(id) {
    return id === '\0virtual:webfactory-styles' ? '' : undefined;
  },
};

export default defineConfig({
  integrations: [
    icon({ include: { tabler: ['*'], 'flat-color-icons': ['*'] } }),
    astrowind({ config: { site: { name: 'Website' }, i18n: { language: 'en', textDirection: 'ltr' } } }),
  ],
  vite: { plugins: [virtualStyles, tailwindcss()] },
});
