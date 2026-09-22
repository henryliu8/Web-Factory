# Site map

- `/` — mosaic hero, values strip, service cards, approach, team cards, CTA.
- `/about-us/` — hero, purpose/story, values, approach, location summary.
- `/services/` — hero, service directory, support pathways, CTA.
- `/services/{slug}/` — seven service pages: hero, support areas, therapy pathway, process, FAQ, CTA.
- `/team/` — hero, team directory, shared approach.
- `/team/{slug}/` — Joanne, Wen and Annie Wang: profile hero, biography, expertise, experience, CTA.
- `/contact/` — hero, contact details and disconnected enquiry form, map link.

All 15 routes are generated at build time by `src/pages/[...slug].astro`. Core content is present in static HTML without client-side JavaScript. Client scripts only handle menu and form preview interactions.
