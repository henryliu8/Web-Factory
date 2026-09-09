import Header from '@webfactory/sections/header/Header';
import HeroFullscreen from '@webfactory/sections/hero/HeroFullscreen';
import FeatureGrid from '@webfactory/sections/features/FeatureGrid';
import CTA from '@webfactory/sections/cta/CTA';
import ProjectHero from '../overrides/sections/hero/HeroFullscreen.astro';
import { createDemoSectionRegistry } from './createDemoSectionRegistry';

export const sectionRegistry = createDemoSectionRegistry({
  sharedHeader: Header as unknown,
  sharedHero: HeroFullscreen as unknown,
  sharedFeatures: FeatureGrid as unknown,
  sharedCTA: CTA as unknown,
  projectHero: ProjectHero as unknown,
});
