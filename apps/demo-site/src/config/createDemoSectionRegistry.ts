import { createSectionRegistry } from "@webfactory/core";

export interface DemoSectionComponents<T> {
  sharedHeader: T;
  sharedHero: T;
  sharedFeatures: T;
  sharedCTA: T;
  projectHero: T;
}

export function createDemoSectionRegistry<T>(
  components: DemoSectionComponents<T>,
) {
  return createSectionRegistry<T>([
    {
      name: "shared",
      entries: {
        "header/Header": components.sharedHeader,
        "hero/HeroFullscreen": components.sharedHero,
        "features/FeatureGrid": components.sharedFeatures,
        "cta/CTA": components.sharedCTA,
      },
    },
    { name: "template", entries: {} },
    { name: "theme", entries: {} },
    {
      name: "project",
      entries: {
        "hero/HeroFullscreen": components.projectHero,
      },
    },
  ]);
}
