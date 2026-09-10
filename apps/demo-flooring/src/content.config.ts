import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const actionSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
});

const imageSchema = z.object({
  src: z.string().min(1),
  alt: z.string().min(1),
});

const pageBase = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
});

const homePageSchema = pageBase.extend({
  kind: z.literal("home"),
  slides: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        image: imageSchema,
        primaryAction: actionSchema,
        secondaryAction: actionSchema.optional(),
        tone: z.enum(["light", "dark"]).default("light"),
      }),
    )
    .min(1),
  materials: z
    .array(
      z.object({
        name: z.string().min(1),
        summary: z.string().min(1),
        detail: z.string().min(1),
      }),
    )
    .min(1),
  projects: z
    .array(
      z.object({
        name: z.string().min(1),
        location: z.string().min(1),
        material: z.string().min(1),
        image: imageSchema,
      }),
    )
    .min(1),
  process: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(1),
  quote: z.object({
    text: z.string().min(1),
    author: z.string().min(1),
    context: z.string().min(1),
    image: imageSchema,
  }),
});

const aboutPageSchema = pageBase.extend({
  kind: z.literal("about"),
  intro: z.string().min(1),
  story: z
    .array(
      z.object({
        title: z.string().min(1),
        text: z.string().min(1),
      }),
    )
    .min(1),
  principles: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(1),
  stats: z
    .array(
      z.object({
        value: z.string().min(1),
        label: z.string().min(1),
      }),
    )
    .min(1),
});

const servicesPageSchema = pageBase.extend({
  kind: z.literal("services"),
  intro: z.string().min(1),
  services: z
    .array(
      z.object({
        slug: z.string().min(1),
        name: z.string().min(1),
        summary: z.string().min(1),
        detail: z.string().min(1),
        image: imageSchema,
      }),
    )
    .min(1),
});

const servicePageSchema = pageBase.extend({
  kind: z.literal("service"),
  intro: z.string().min(1),
  material: z.string().min(1),
  image: imageSchema,
  benefits: z.array(z.string().min(1)).min(1),
  steps: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(1),
});

const contactPageSchema = pageBase.extend({
  kind: z.literal("contact"),
  intro: z.string().min(1),
  studio: z.object({
    address: z.array(z.string().min(1)).min(1),
    phone: z.string().min(1),
    email: z.string().email(),
    hours: z.array(z.string().min(1)).min(1),
  }),
  prompts: z.array(z.string().min(1)).min(1),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content" }),
  schema: z.discriminatedUnion("kind", [
    homePageSchema,
    aboutPageSchema,
    servicesPageSchema,
    servicePageSchema,
    contactPageSchema,
  ]),
});

export const collections = { pages };
