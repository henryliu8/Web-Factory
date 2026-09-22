import {
  pageSchema,
  siteSchema,
} from "@webfactory/template-allied-health/schema";
import siteContent from "../content/site.json";
import { z } from "zod";
const recordSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    order: z.number().int().nonnegative().default(0),
    card: z
      .object({
        title: z.string().min(1),
        description: z.string(),
        href: z.string().startsWith("/"),
      })
      .passthrough(),
  })
  .passthrough();
const serviceFiles = import.meta.glob("../content/services/*.json", {
  eager: true,
  import: "default",
});
const teamFiles = import.meta.glob("../content/team/*.json", {
  eager: true,
  import: "default",
});
const records = (files: Record<string, unknown>) =>
  Object.values(files).map((value) => recordSchema.parse(value));
export const services = records(serviceFiles).sort((a, b) =>
  String(a.card.number).localeCompare(String(b.card.number)),
);
export const team = records(teamFiles).sort((a, b) => a.order - b.order);
const collections = { services, team };
const serviceLinks = services.map((entry) => ({
  label: entry.card.title,
  href: entry.card.href,
}));
export const site = siteSchema.parse({
  ...siteContent,
  navigation: siteContent.navigation.map((item) => ({
    ...item,
    ...(item.childrenFrom === "services" ? { children: serviceLinks } : {}),
  })),
  services: serviceLinks,
});
export function loadPage(input: unknown) {
  const raw = z
    .object({
      sections: z.array(
        z
          .object({ collection: z.enum(["services", "team"]).optional() })
          .passthrough(),
      ),
    })
    .passthrough()
    .parse(input);
  return pageSchema.parse({
    ...raw,
    sections: raw.sections.map((section) =>
      section.collection
        ? {
            ...section,
            items: collections[section.collection].map((entry) => entry.card),
          }
        : section,
    ),
  });
}
// Validate every record, including profiles not currently linked from a page.
for (const record of [...services, ...team]) loadPage(record);
