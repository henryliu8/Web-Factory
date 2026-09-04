import CTA from './cta/CTA.astro';
import FeatureGrid from './features/FeatureGrid.astro';
import HeroFullscreen from './hero/HeroFullscreen.astro';

/** The shared section layer used as the final PageBuilder fallback. */
export const sharedSectionRegistry = {
  'hero/HeroFullscreen': HeroFullscreen,
  'features/FeatureGrid': FeatureGrid,
  'cta/CTA': CTA,
};
