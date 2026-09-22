import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { createStyleRuntime } from "@webfactory/core";
import project from "./webfactory.config";
const { vitePlugin: styles } = createStyleRuntime({
  applicationStyle: fileURLToPath(
    new URL("./src/styles/global.css", import.meta.url),
  ),
  project,
  catalog: {
    templates: {
      "allied-health": { style: "@webfactory/template-allied-health/styles" },
    },
    themes: {
      "modern-clinical": { style: "@webfactory/theme-modern-clinical/styles" },
    },
  },
});
export default defineConfig({
  trailingSlash: "always",
  vite: { plugins: [styles, tailwindcss()] },
});
