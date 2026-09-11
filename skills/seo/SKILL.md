---
name: seo
description: Implement or audit technical and on-page SEO for Web Factory Astro projects. Use for metadata, canonical URLs, robots directives, sitemaps, structured data, headings, links, and crawlable project content.
---

# SEO

Keep page-specific titles, descriptions, social metadata, canonical inputs, and structured data in project-owned content or configuration. Put reusable rendering logic in `packages/seo` only when more than one project consumes it.

For each public page, provide a unique descriptive title, useful meta description, one clear primary heading, meaningful link text, and crawlable server-rendered content. Use absolute canonical and social image URLs derived from the configured site origin.

Generate structured data only when the page content supports the selected schema, and serialize it safely. Do not invent ratings, addresses, authorship, dates, or other business facts.

Keep non-public or duplicate routes out of indexing deliberately. Ensure redirects, canonical URLs, robots policy, and sitemap entries agree.

Inspect the built HTML for changed routes and run the affected project's Astro check and production build.
