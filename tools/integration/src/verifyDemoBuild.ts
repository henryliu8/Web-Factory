import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../../..");
const dist = resolve(root, "apps/demo-site/dist");
const routes = [
  "index.html",
  "about/index.html",
  "services/index.html",
  "projects/index.html",
  "contact/index.html",
];

for (const route of routes) {
  if (!existsSync(resolve(dist, route)))
    throw new Error(`Missing demo build route: ${route}`);
}

const home = readFileSync(resolve(dist, "index.html"), "utf8");
for (const marker of [
  "demo-project-hero",
  "wf-section-header",
  "wf-feature-grid",
  "wf-cta",
]) {
  if (!home.includes(marker))
    throw new Error(`Missing rendered integration marker: ${marker}`);
}
for (const href of [
  'href="/"',
  'href="/about"',
  'href="/services"',
  'href="/projects"',
  'href="/contact"',
]) {
  if (!home.includes(href))
    throw new Error(`Missing demo navigation link: ${href}`);
}

const cssDirectory = resolve(dist, "_astro");
const css = readdirSync(cssDirectory)
  .filter((file) => file.endsWith(".css"))
  .map((file) => readFileSync(resolve(cssDirectory, file), "utf8"))
  .join("\n");

if (!css.includes("--wf-radius-lg:1.5rem"))
  throw new Error("Project token override is missing from built CSS.");
if (!css.includes("--wf-color-surface:#f3f4f6"))
  throw new Error("Default theme tokens are missing from built CSS.");
if (css.includes("Georgia") || css.includes("--wf-color-primary:#211d19")) {
  throw new Error("Luxury theme CSS was emitted in the Default demo build.");
}
if (!css.includes(".flex-wrap"))
  throw new Error("Tailwind utilities from monorepo sources are missing.");

console.log(
  "Verified demo routes, registry output, navigation, selected theme, project override, and Tailwind CSS.",
);
