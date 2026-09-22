import type { TemplateConfig } from "@webfactory/core";
export default {
  id: "allied-health",
  name: "Allied Health",
  description: "Content-driven services, people and clinic pages.",
  layouts: { default: "./src/layouts/SiteLayout.astro" },
  style: "@webfactory/template-allied-health/styles",
} satisfies TemplateConfig;
