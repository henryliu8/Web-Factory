import type { HomeTemplateProps } from "@webfactory/template-stardrive";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export const site = {
  name: "Web Factory Demo",
  language: "en",
  navigation,
};

export const home: Pick<
  HomeTemplateProps,
  "header" | "hero" | "features" | "cta"
> = {
  header: {
    brand: site.name,
    items: navigation,
    cta: { label: "Explore services", href: "/services" },
  },
  hero: {
    title: "Reusable website architecture",
    description:
      "A working reference for shared components, structural templates, selectable themes, and focused project overrides.",
    primaryAction: { label: "View projects", href: "/projects" },
    secondaryAction: { label: "About the demo", href: "/about" },
  },
  features: {
    title: "One system, clear responsibilities",
    intro:
      "Each layer contributes only what it owns, keeping projects adaptable without copying framework code.",
    items: [
      {
        title: "Shared components",
        description:
          "Accessible primitives and sections provide the reusable foundation.",
      },
      {
        title: "Templates and themes",
        description:
          "Structure and appearance remain independent and selectable.",
      },
      {
        title: "Project overrides",
        description:
          "Local changes take precedence while preserving upgrade paths.",
      },
    ],
  },
  cta: {
    title: "Inspect the complete integration",
    description:
      "Browse the five routes to see shared navigation, template layouts, and project content working together.",
    primaryAction: { label: "Start with About", href: "/about" },
  },
};
