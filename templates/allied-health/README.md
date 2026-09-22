# Allied Health template

A reusable Astro template migrated from the supplied clinical website prototype. Customer names, text, logo and photos remain in `apps/rising-tree`; the template contains no customer identity.

## Public contracts

- `layouts/SiteLayout`: shared document and SEO shell with the existing virtual style runtime.
- `page-templates/StandardPageTemplate`: accepts `metadata`, optional `site`, and validated `sections`. It composes `sharedSections`, `templateSections`, `themeSections`, then `projectSections` using the core registry. Header/footer use the component registry with the same precedence for supplied overrides.
- `schema`: Zod schemas and inferred section, site and page types. Invalid fields or unsafe link protocols fail the build. Existing shared section schemas remain accepted.
- `registry`: template sections and navigation components, plus the existing shared section entries.
- `styles`: responsive layout rules using semantic `--wf-*` tokens. The theme supplies the palette and typography, and project CSS loads last.

Logical sections: `clinic/Hero`, `clinic/Stats`, `clinic/CardGrid`, `clinic/Split`, `clinic/CTA`, `clinic/FAQ`, `clinic/ProfileBio`, `clinic/Timeline`, `clinic/Contact`, `clinic/Location`.

`CardGrid.variant` supports services, team, features, values, process and pathways. `Hero.variant` supports simple, mosaic, service and profile. These variants represent the source layouts without separate copies of the same card rendering.

## Create a project

```sh
pnpm wf create my-clinic --template allied-health --theme modern-clinical --pages home,about,contact
pnpm install
pnpm wf check my-clinic
pnpm wf build my-clinic
```

The minimal scaffold has generic Markdown home content, no customer assets, and works with other catalog themes. Additional CLI-created pages start with their content title; pass their `entry.data.sections` to `StandardPageTemplate` when adding sections. For a full data-driven clinic, see Rising Tree's JSON pages and dynamic route.

`clinic/Contact` intentionally demonstrates a disconnected enquiry form. It prevents submission and states that nothing was sent; connecting delivery, consent and handling is separate project work.

The `sectionParser` PageBuilder prop is an optional template extension; omitting it retains the original shared schema validation. The template supplies its own schema while all component resolution still goes through Web Factory.
