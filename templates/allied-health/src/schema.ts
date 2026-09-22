import { z } from "zod";
import { sectionDefinitionSchema } from "@webfactory/core";
const text = z.string().min(1);
const href = text.refine(
  (value) => /^(\/(?!\/)|#|https:\/\/|mailto:|tel:)/.test(value),
  "Use a local path, HTTPS, email or telephone URL",
);
const image = z.object({
  src: href,
  alt: z.string(),
  position: z.string().optional(),
});
const action = z.object({
  label: text,
  href,
  variant: z.enum(["light", "ghost", "primary"]).default("primary"),
});
const heading = {
  eyebrow: z.string().optional(),
  title: text,
  intro: z.string().optional(),
};
const common = {
  ...heading,
  tint: z.boolean().default(false),
  id: z.string().optional(),
};
const panel = z.object({
  eyebrow: z.string().optional(),
  title: z.string().optional(),
  paragraphs: z.array(z.string()).default([]),
  checks: z.array(text).default([]),
  action: action.optional(),
  dark: z.boolean().default(false),
});
const item = z.object({
  title: text,
  description: z.string().default(""),
  href: href.optional(),
  number: z.string().optional(),
  image: image.optional(),
  role: z.string().optional(),
  eyebrow: z.string().optional(),
  linkLabel: z.string().optional(),
});
export const sectionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("clinic/Hero"),
    ...heading,
    variant: z
      .enum(["mosaic", "simple", "service", "profile"])
      .default("simple"),
    images: z.array(image).default([]),
    actions: z.array(action).default([]),
    role: z.string().optional(),
    strapline: z.string().optional(),
  }),
  z.object({ type: z.literal("clinic/Stats"), items: z.array(item) }),
  z.object({
    type: z.literal("clinic/CardGrid"),
    ...common,
    variant: z.enum([
      "services",
      "team",
      "features",
      "values",
      "process",
      "pathways",
    ]),
    items: z.array(item),
    action: action.optional(),
  }),
  z.object({
    type: z.literal("clinic/Split"),
    tint: z.boolean().default(false),
    variant: z
      .enum(["image", "story", "approach", "columns"])
      .default("columns"),
    image: image.optional(),
    panels: z.array(panel).min(1).max(2),
  }),
  z.object({
    type: z.literal("clinic/CTA"),
    ...heading,
    actions: z.array(action),
  }),
  z.object({
    type: z.literal("clinic/FAQ"),
    ...common,
    items: z.array(z.object({ question: text, answer: text })),
  }),
  z.object({
    type: z.literal("clinic/ProfileBio"),
    ...common,
    qualificationsLabel: text,
    languagesLabel: text,
    personalLabel: text,
    qualifications: z.array(text),
    languages: z.array(text),
    personal: z.string(),
  }),
  z.object({
    type: z.literal("clinic/Timeline"),
    ...common,
    items: z.array(item),
  }),
  z.object({
    type: z.literal("clinic/Contact"),
    ...common,
    details: z.array(
      z.object({ label: text, value: text, href: href.optional() }),
    ),
    form: z.object({
      eyebrow: text,
      title: text,
      intro: text,
      fields: z.array(
        z.object({
          name: text,
          label: text,
          type: z.enum(["text", "tel", "email", "select", "textarea"]),
          autocomplete: z.string().optional(),
          required: z.boolean().optional(),
          maxLength: z.number().int().positive().optional(),
          full: z.boolean().default(false),
          options: z.array(text).optional(),
        }),
      ),
      button: text,
      note: text,
      message: text,
      feedback: z
        .object({
          sending: text,
          success: text,
          invalid: text,
          verification: text,
          failed: text,
          unavailable: text,
          noScript: text,
          captchaLabel: text,
        })
        .optional(),
    }),
  }),
  z.object({ type: z.literal("clinic/Location"), ...common, action }),
]);
export const sectionsSchema = z.array(
  z.union([sectionSchema, sectionDefinitionSchema]),
);
export const pageSchema = z.object({
  title: text,
  description: text,
  sections: sectionsSchema,
});
export const siteSchema = z.object({
  name: text,
  tagline: text,
  logo: image,
  navigation: z.array(action.extend({ children: z.array(action).optional() })),
  cta: action,
  phone: text,
  phoneHref: href,
  email: text.email(),
  address: z.array(text),
  footer: z.object({
    explore: text,
    services: text,
    contact: text,
    copyright: text,
  }),
  services: z.array(action),
});
export type ClinicSection = z.infer<typeof sectionSchema>;
export type SectionProps<T extends ClinicSection["type"]> = Omit<
  Extract<ClinicSection, { type: T }>,
  "type"
>;
export type ClinicPage = z.infer<typeof pageSchema>;
export type ClinicSite = z.infer<typeof siteSchema>;
export type Action = z.infer<typeof action>;
