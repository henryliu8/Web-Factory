import HeroFullscreen from '../../../../../packages/sections/src/hero/HeroFullscreen.astro';
import FeatureGrid from '../../../../../packages/sections/src/features/FeatureGrid.astro';
import CTA from '../../../../../packages/sections/src/cta/CTA.astro';

export const sectionRegistry = {
  'hero/HeroFullscreen': HeroFullscreen,
  'features/FeatureGrid': FeatureGrid,
  'cta/CTA': CTA,
};
