# Site map

- `/` — mosaic hero, values strip, service cards, approach, team cards, CTA.
- `/about-us/` — hero, purpose/story, values, approach, location summary.
- `/services/` — hero, service directory, support pathways, CTA.
- `/services/{slug}/` — seven service pages: hero, support areas, therapy pathway, process, FAQ, CTA.
- `/team/` — hero, team directory, shared approach.
- `/team/{slug}/` — Joanne, Wen and Annie Wang: profile hero, biography, expertise, experience, CTA.
- `/contact/` — hero, contact details and Resend enquiry form with reCAPTCHA v2, map link.

All 15 routes are generated at build time by `src/pages/[...slug].astro`. Core content is present in static HTML without client-side JavaScript. Client scripts handle navigation, reCAPTCHA and form submission. `/api/contact/` is a runtime POST endpoint served by the Astro Node adapter.
