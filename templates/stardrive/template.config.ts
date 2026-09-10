import type { TemplateConfig } from "@webfactory/core";

const template: TemplateConfig = {
  id: "stardrive",
  name: "Stardrive",
  description: "A flexible, content-first Astro website structure.",
  layouts: {
    default: "./src/layouts/SiteLayout.astro",
  },
  style: "@webfactory/template-stardrive/styles",
};

export default template;
