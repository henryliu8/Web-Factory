# Shared Layout, SEO, and URL Foundations

These packages provide neutral Shared-layer behavior. Templates compose them; themes style them through semantic tokens; projects provide final content and configuration.

## Layout

`DocumentLayout.astro` owns only the HTML document and optional skip link. Templates remain responsible for headers, footers, page structure, analytics, transitions, and style selection.

```astro
---
import DocumentLayout from "@webfactory/layouts/DocumentLayout.astro";
---

<DocumentLayout lang="en" skipTargetId="main-content">
  <slot name="head" slot="head" />
  <main id="main-content"><slot /></main>
</DocumentLayout>
```

## SEO

Use `SeoHead.astro` for canonical, robots, Open Graph, and Twitter metadata. `StructuredData.astro` serializes JSON-LD so content cannot terminate its script element.

```astro
---
import SeoHead from "@webfactory/seo/SeoHead.astro";
import StructuredData from "@webfactory/seo/StructuredData.astro";
---

<SeoHead title="Page title" description="Page description" />
<StructuredData schema={{ "@context": "https://schema.org", "@type": "WebPage" }} />
```

Site-wide defaults belong to Template, final domain and verification values belong to Project, and page metadata belongs with page content.

## URL utilities

`joinUrlPath`, `trimSlashes`, and `normalizePathTrailingSlash` are pure, environment-independent helpers. Blog taxonomy and permalink patterns remain Template concerns.
