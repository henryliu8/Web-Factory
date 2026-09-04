import HeroFullscreen from '@webfactory/sections/hero/HeroFullscreen.astro';
import FeatureGrid from '@webfactory/sections/features/FeatureGrid.astro';
import CTA from '@webfactory/sections/cta/CTA.astro';

export const sectionRegistry = {
  'hero/HeroFullscreen': HeroFullscreen,
  'features/FeatureGrid': FeatureGrid,
  'cta/CTA': CTA,
};
