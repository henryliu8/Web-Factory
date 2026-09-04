# Web Factory — Initial Architecture & Implementation Specification

> **Purpose**  
> This document is the implementation specification for the initial open-source **Web Factory** project.  
> It is intended to be given directly to **Continue in VS Code** so that Continue can create the initial monorepo structure, CLI, shared packages, theme/template system, project override mechanism, and a runnable demo Astro website.
>
> **Project name:** Web Factory  
> **Primary framework:** Astro  
> **Package manager:** pnpm  
> **Repository type:** Monorepo  
> **Initial license recommendation:** MIT  
> **Primary goal:** Create high-quality responsive websites quickly from reusable templates, themes, components, sections, content and project-level overrides.

---

# 1. Project Vision

Web Factory is not a single Astro theme and is not a single website template.

It is an extensible website production framework with the following model:

```text
Web Factory Core
      ↓
Shared Packages
      ↓
Template
      ↓
Theme
      ↓
Project
      ↓
Project Overrides
```

A project should be able to:

1. Select a website template.
2. Select a visual theme.
3. Reuse shared Web Factory components and sections.
4. Store its own content separately from code.
5. Override any component, section, style or configuration at project level.
6. Build and deploy as a normal Astro application.
7. Remain easy to upgrade when Web Factory itself is updated.
8. Eventually be generated through an AI workflow from:
   - page names,
   - content,
   - images,
   - reference websites/screenshots,
   - selected template/theme.

The initial version does **not** need to implement the full AI workflow.  
The first release must establish the architecture required for that future workflow.

---

# 2. Core Architectural Principles
## 2.1 Separate Template, Theme and Project

These concepts must remain independent.

### Template

A template controls website structure and functional defaults.

Examples:

```text
stardrive
corporate
landing
ecommerce
saas-marketing
```

A template may define:

- default layouts,
- structural sections,
- header/footer behavior,
- PageBuilder conventions,
- default page structures,
- Astro configuration defaults,
- SEO defaults,
- content conventions.

A template should avoid hard-coding the final visual brand.

---

### Theme

A theme controls visual direction.

Examples:

```text
default
luxury
construction
minimal
dark-tech
ecommerce-clean
```

A theme may define:

- design tokens,
- typography,
- color system,
- spacing,
- border radius,
- visual effects,
- motion defaults,
- preferred section variants,
- optional component/section overrides.

Themes should normally prefer design tokens and styles over completely replacing markup, but markup overrides must be supported where necessary.

---

### Project

A project is the final customer website.

Examples:

```text
forest-flooring
uncle-xiang
uwell
demo-site
```

Each project must contain its own:

- project settings,
- site configuration,
- content,
- images,
- optional custom skills,
- optional custom components,
- optional custom sections,
- optional custom styles,
- optional custom configuration.

Projects must not directly modify shared Web Factory packages, templates or themes.

---

# 3. Design Token Model
Web Factory must use **semantic design tokens** as the stable design contract between shared components, themes and projects.

A design token is a named design decision, for example:

```text
--wf-color-primary
--wf-color-background
--wf-color-surface
--wf-font-heading
--wf-font-body
--wf-content-width
--wf-section-space
--wf-radius-md
--wf-motion-normal
```

Use semantic names that describe meaning rather than a specific brand value.

Preferred:

```text
--wf-color-primary
--wf-color-surface
--wf-radius-card
```

Avoid framework-wide token names tied to one theme:

```text
--brown-700
--luxury-gold
--forest-green
```

Token inheritance:

```text
Web Factory base tokens
        ↓
Theme token overrides
        ↓
Project token overrides
```

Example:

```css
/* packages/tokens/src/base.css */
:root {
  --wf-color-primary: #171717;
}
```

```css
/* themes/luxury/src/styles/tokens.css */
:root {
  --wf-color-primary: #211d19;
}
```

```css
/* apps/forest-flooring/src/styles/project.css */
:root {
  --wf-color-primary: #5b4636;
}
```

The shared component remains unchanged:

```css
.button {
  background: var(--wf-color-primary);
}
```

This allows shared components to stay reusable while themes and individual projects can change the final visual identity.

---

# 4. Monorepo Structure
Create the repository with the following high-level structure:

```text
web-factory/
│
├── apps/
│   ├── demo-site/
│   └── showcase/
│
├── packages/
│   ├── core/
│   ├── tokens/
│   ├── ui/
│   ├── sections/
│   ├── layouts/
│   ├── forms/
│   ├── seo/
│   ├── animations/
│   └── utilities/
│
├── templates/
│   └── stardrive/
│
├── themes/
│   ├── default/
│   └── luxury/
│
├── skills/
│   ├── astro/
│   ├── ui-design/
│   ├── responsive/
│   ├── accessibility/
│   ├── animation/
│   ├── seo/
│   ├── performance/
│   └── deployment/
│
├── agents/
│   ├── planner/
│   ├── designer/
│   ├── developer/
│   ├── qa/
│   └── deployer/
│
├── workflows/
│   └── website/
│
├── tools/
│   └── cli/
│
├── docs/
│
├── .github/
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
├── .gitignore
├── README.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── LICENSE
```

The `agents/` and `workflows/` directories should exist in the initial repository but may contain only README/placeholder documentation in the first implementation.

Do not implement LangGraph or other agent orchestration in the first phase.

---

# 5. Shared Packages
## 5.1 `packages/core`
Purpose:

- PageBuilder
- project configuration
- theme/template configuration
- registry/resolution logic
- deep configuration merge
- shared types
- future plugin APIs

Suggested structure:

```text
packages/core/
├── src/
│   ├── page-builder/
│   │   ├── PageBuilder.astro
│   │   └── types.ts
│   │
│   ├── registry/
│   │   ├── createRegistry.ts
│   │   ├── resolveEntry.ts
│   │   └── types.ts
│   │
│   ├── config/
│   │   ├── defineProject.ts
│   │   ├── loadProjectConfig.ts
│   │   ├── mergeConfig.ts
│   │   └── types.ts
│   │
│   ├── content/
│   ├── utils/
│   └── index.ts
│
├── package.json
└── tsconfig.json
```

---

## 5.2 `packages/tokens`
Purpose:

- centralize framework-wide design tokens,
- define the stable semantic variables used by shared components,
- provide base spacing, typography, sizing, radii, shadows and motion values,
- provide a consistent contract that themes can override,
- allow project-level design changes without rewriting shared components.

Suggested structure:

```text
packages/tokens/
├── src/
│   ├── base.css
│   ├── colors.css
│   ├── spacing.css
│   ├── typography.css
│   ├── radius.css
│   ├── shadows.css
│   ├── motion.css
│   ├── breakpoints.ts
│   └── index.css
│
├── package.json
└── README.md
```

The distinction is:

```text
packages/tokens
= Web Factory's shared token contract and defaults

themes/<theme>/src/styles/tokens.css
= theme-specific values

apps/<project>/src/styles/project.css
= project-specific final overrides
```

Shared components should consume tokens instead of hard-coded project-specific values.

---

## 5.3 `packages/ui`
Shared low-level reusable components.

Example:

```text
packages/ui/src/
├── primitives/
│   ├── Button.astro
│   ├── Container.astro
│   ├── Badge.astro
│   └── Icon.astro
│
├── navigation/
│   ├── Header.astro
│   ├── Navbar.astro
│   └── MobileMenu.astro
│
├── cards/
│   ├── ServiceCard.astro
│   ├── ProjectCard.astro
│   └── ArticleCard.astro
│
└── index.ts
```

Components must use CSS custom properties/design tokens wherever practical.

Avoid hard-coded project-specific colors or branding.

---

## 5.4 `packages/sections`
Large page sections.

Initial sections:

```text
packages/sections/src/
├── hero/
│   ├── HeroMinimal.astro
│   ├── HeroFullscreen.astro
│   ├── HeroSplit.astro
│   └── HeroSlider.astro
│
├── features/
│   └── FeatureGrid.astro
│
├── services/
│   └── ServiceGrid.astro
│
├── projects/
│   └── ProjectGrid.astro
│
├── content/
│   └── ImageText.astro
│
├── testimonials/
│   └── Testimonials.astro
│
├── cta/
│   └── CTA.astro
│
├── contact/
│   └── ContactSection.astro
│
└── registry.ts
```

Do not implement every possible component now.  
Create a small but working initial library.

---

## 5.5 Other packages
Create basic package shells for:

```text
packages/layouts
packages/forms
packages/seo
packages/animations
packages/utilities
```

They may initially contain only a few working utilities/components and documentation.

---

# 6. Template Structure
Create:

```text
templates/stardrive/
├── src/
│   ├── components/
│   ├── sections/
│   ├── layouts/
│   ├── styles/
│   │   └── template.css
│   └── config/
│       └── template.ts
│
├── scaffold/
│   ├── src/
│   │   ├── pages/
│   │   ├── content/
│   │   ├── components/
│   │   ├── sections/
│   │   ├── styles/
│   │   └── config/
│   │
│   ├── public/
│   ├── astro.config.mjs
│   ├── tsconfig.json
│   └── package.json.template
│
├── template.config.ts
├── README.md
└── package.json
```

`scaffold/` contains only the minimal files required to create a new project.

Do not copy the entire Web Factory component library into every project.

---

# 7. Theme Structure
Web Factory uses the following styling stack:

```text
Tailwind CSS v4
+
CSS Custom Properties / Design Tokens
+
Astro scoped CSS
```

Responsibilities:

- **Design Tokens / CSS Custom Properties**: brand and design decisions.
- **Tailwind CSS v4**: layout, responsive utilities, grid/flex, spacing utilities and rapid composition.
- **Astro scoped CSS**: component-specific and complex visual styling.

Do not hard-code final project identity throughout Tailwind classes.

Prefer semantic design values such as:

```text
primary
surface
background
on-primary
heading-font
body-font
section-spacing
theme-radius
```

Create two initial themes:

```text
themes/default/
themes/luxury/
```

Each theme should follow:

```text
themes/luxury/
├── src/
│   ├── components/
│   ├── sections/
│   ├── styles/
│   │   ├── tokens.css
│   │   ├── theme.css
│   │   ├── typography.css
│   │   └── motion.css
│   └── config/
│       └── theme.ts
│
├── theme.config.ts
├── sections.json
├── THEME.md
└── package.json
```

Example theme metadata:

```ts
export default {
  id: 'luxury',
  name: 'Luxury',
  styles: [
    'premium',
    'minimal',
    'editorial',
    'architectural'
  ]
};
```

Themes may optionally override shared components/sections by using the same logical path/name.

---

# 8. Project Structure
Every generated project under `apps/` must use the following structure:

```text
apps/<project-name>/
│
├── project/
│   ├── PROJECT.md
│   ├── DESIGN.md
│   ├── SITE.md
│   ├── PLAN.md
│   ├── REFERENCES.md
│   └── AGENTS.md
│
├── skills/
│   └── README.md
│
├── src/
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── services.astro
│   │   ├── projects.astro
│   │   └── contact.astro
│   │
│   ├── content/
│   │   ├── home.md
│   │   ├── about.md
│   │   ├── services.md
│   │   ├── projects.md
│   │   └── contact.md
│   │
│   ├── components/
│   ├── sections/
│   ├── layouts/
│   ├── styles/
│   │   ├── global.css
│   │   └── project.css
│   │
│   └── config/
│       └── site.ts
│
├── public/
│   └── images/
│
├── webfactory.config.ts
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

---

# 9. Override / Inheritance System
This is a mandatory Web Factory feature.

The same logical component, section, style or config entry may exist at multiple levels.

Resolution priority must be:

```text
1. Project
2. Theme
3. Template
4. Shared Package
```

The first matching entry wins.

Example:

```text
packages/ui/src/primitives/Button.astro
themes/luxury/src/components/primitives/Button.astro
apps/forest-flooring/src/components/primitives/Button.astro
```

For `forest-flooring`, the final component must be:

```text
apps/forest-flooring/src/components/primitives/Button.astro
```

If the project override is removed, Web Factory must automatically fall back to:

```text
themes/luxury/src/components/primitives/Button.astro
```

If the theme does not contain it, fall back to the template, then the shared package.

---

## 9.1 Logical paths, not only basenames
Overrides must be based on relative logical paths.

Correct:

```text
components/navigation/Header.astro
sections/hero/HeroFullscreen.astro
```

Do not resolve only by basename because duplicate filenames will eventually exist.

---

## 9.2 Component and Section Resolution
Implement a registry/resolver in `packages/core`.

The registry should be able to merge entries in this order:

```text
shared
→ template
→ theme
→ project
```

Each subsequent layer replaces matching logical keys.

Example resulting registry:

```ts
{
  'hero/HeroFullscreen': ProjectHeroOrFallback,
  'features/FeatureGrid': ResolvedFeatureGrid,
  'cta/CTA': ResolvedCTA
}
```

The initial implementation may use `import.meta.glob()` and a registry merge strategy.

Prefer build-time resolution.

Avoid runtime filesystem access in production.

---

## 9.3 Styles
Styles should cascade in this order:

```text
1. shared/core styles
2. template styles
3. theme styles
4. project styles
```

Project styles are loaded last.

Use CSS custom properties extensively.

Example:

```css
:root {
  --color-primary: #111;
  --content-width: 1280px;
  --section-space: clamp(72px, 9vw, 140px);
}
```

A project may override:

```css
:root {
  --color-primary: #7b6147;
}
```

without editing the theme.

---

## 9.4 CSS Architecture and Cascade Order
Use this predictable style loading order:

```text
1. shared token/base styles
2. template styles
3. theme styles
4. project styles
```

Project styles load last.

Where useful, use CSS cascade layers:

```css
@layer reset, tokens, base, components, utilities, theme, project;
```

Recommended ownership:

```text
packages/tokens/src/
packages/core/src/styles/
templates/<template>/src/styles/
themes/<theme>/src/styles/
apps/<project>/src/styles/
```

A project must be able to override theme token values without changing the theme itself.

Example:

```css
/* themes/luxury/src/styles/tokens.css */
:root {
  --wf-color-primary: #171717;
  --wf-color-accent: #9a8264;
}
```

```css
/* apps/forest-flooring/src/styles/project.css */
:root {
  --wf-color-primary: #513d2d;
  --wf-color-accent: #c0a47d;
}
```

---

## 9.5 Configuration
Configuration should be deep-merged:

```text
shared defaults
→ template config
→ theme config
→ project config
```

Later layers override earlier values.

Arrays should normally replace rather than concatenate unless explicitly documented.

Implement and test a `mergeConfig()` utility.

---

# 10. `webfactory.config.ts`
Every project must have a simple central configuration file.

Example:

```ts
import { defineProject } from '@webfactory/core';

export default defineProject({
  name: 'Demo Site',
  slug: 'demo-site',

  template: 'stardrive',
  theme: 'luxury',

  site: {
    url: 'https://example.com',
    language: 'en-AU'
  },

  pages: [
    'home',
    'about',
    'services',
    'projects',
    'contact'
  ],

  deploy: {
    provider: 'cloudflare'
  }
});
```

The CLI and build system should use this file as the project's source of truth.

---

# 11. Content-First Website Model
Use **Astro Content Collections** for structured website content where practical.

Use **Zod** to validate:

- page content,
- section content,
- project config,
- template config,
- theme config,
- CLI-generated project metadata.

Page content must be separated from page implementation.

Example `src/content/home.md`:

```md
---
title: Home

sections:
  - type: hero/HeroFullscreen
    eyebrow: Premium Quality
    title: Beautiful Spaces, Built Better
    description: High quality solutions for modern Australian homes.
    image: /images/home/hero.jpg
    primaryCTA:
      label: View Our Work
      href: /projects

  - type: features/FeatureGrid
    title: What We Do
    items:
      - title: Design
        description: Thoughtful design for modern projects.
      - title: Build
        description: Reliable delivery from concept to completion.

  - type: cta/CTA
    title: Ready to start?
    button:
      label: Contact Us
      href: /contact
---
```

Pages should be thin.

Example concept:

```astro
---
import PageBuilder from '@webfactory/core/page-builder/PageBuilder.astro';
import content from '../content/home.md';
---

<PageBuilder sections={content.frontmatter.sections} />
```

The user should normally update content and images without editing Astro component code.

---

# 12. PageBuilder
Create an initial PageBuilder that:

1. Receives a `sections` array.
2. Looks up the requested section in the resolved section registry.
3. Renders the correct Astro component.
4. Passes section properties to the component.
5. Reports a useful development error when the requested section does not exist.

Example:

```yaml
type: hero/HeroFullscreen
```

must resolve through:

```text
project
→ theme
→ template
→ packages/sections
```

---

# 13. Supporting Front-End Libraries
## 13.1 Icons
Use **Iconify**, with **Lucide** as a preferred default icon family.

Expose icons through a Web Factory wrapper where useful.

## 13.2 Sliders / Carousels
Use **Embla Carousel** as the preferred shared carousel engine.

Wrap it in Web Factory components such as:

```text
Slider
HeroSlider
ProjectCarousel
TestimonialCarousel
LogoCarousel
```

Themes should control presentation.

## 13.3 Animation
Default:

```text
CSS transitions / keyframes
+
Motion
```

Optional advanced animation:

```text
GSAP
```

Use GSAP only where advanced behavior is genuinely needed, such as complex parallax, pinned scenes, scroll storytelling or advanced timelines.

All motion must respect:

```css
@media (prefers-reduced-motion: reduce)
```

## 13.4 Images
Use Astro's image capabilities:

```text
<Image />
<Picture />
```

Only create wrappers when Web Factory needs reusable responsive/image behavior.

---

# 14. CLI
Create a CLI under:

```text
tools/cli/
```

Package name may initially be:

```text
@webfactory/cli
```

CLI binary:

```text
webfactory
```

For local monorepo development, root scripts should expose a short command such as:

```bash
pnpm wf
```

---

## 14.1 Required initial commands
Implement:

```bash
pnpm wf create <project>
pnpm wf dev <project>
pnpm wf build <project>
pnpm wf check <project>
pnpm wf sync <project>
pnpm wf list templates
pnpm wf list themes
```

---

## 14.2 Create command
Example:

```bash
pnpm wf create forest-flooring
```

If arguments are missing, use an interactive prompt.

Ask:

```text
Project name:
Template:
Theme:
Pages:
Deploy provider:
```

Example interaction:

```text
Project name:
> forest-flooring

Select template:
> stardrive

Select theme:
> luxury

Pages:
[x] Home
[x] About
[x] Services
[x] Projects
[x] Contact

Deploy provider:
> cloudflare
```

Then create:

```text
apps/forest-flooring/
```

and generate:

- `webfactory.config.ts`
- minimal Astro files
- project documentation files
- page files
- markdown content files
- image directories
- package configuration

Do not duplicate all shared packages inside the new project.

---

## 14.3 Non-interactive CLI
Also support:

```bash
pnpm wf create forest-flooring \
  --template stardrive \
  --theme luxury \
  --pages home,about,services,projects,contact
```

This will be useful later for AI/automation.

---

## 14.4 Development command
```bash
pnpm wf dev forest-flooring
```

Should run the selected project using Astro dev server.

Equivalent behavior may internally use:

```bash
pnpm --filter @webfactory/app-forest-flooring dev
```

but the user should not need to remember workspace filters.

---

## 14.5 Build
```bash
pnpm wf build forest-flooring
```

Must:

1. validate project config,
2. resolve template/theme,
3. generate/refresh registry if needed,
4. run Astro build,
5. return a clear success/failure message.

---

## 14.6 Check
```bash
pnpm wf check forest-flooring
```

Initial version should check:

- project exists,
- selected template exists,
- selected theme exists,
- content files exist,
- referenced sections exist,
- Astro check/build configuration is valid.

Future versions can add Lighthouse, accessibility and broken-link checks.

---

## 14.7 Sync
```bash
pnpm wf sync forest-flooring
```

Purpose:

- refresh generated registries/manifests,
- update resolved template/theme metadata,
- never overwrite project custom files.

This command must be safe to run repeatedly.

---

# 15. Root Commands
Root `package.json` should provide:

```json
{
  "scripts": {
    "wf": "pnpm --filter @webfactory/cli start --",
    "dev": "turbo run dev",
    "build": "turbo run build",
    "check": "turbo run check",
    "lint": "turbo run lint"
  }
}
```

Exact implementation may vary, but the developer experience should remain simple.

---

# 16. Initial Demo Site
Create a working project:

```text
apps/demo-site/
```

Use:

```text
template: stardrive
theme: luxury
```

Pages:

```text
Home
About
Services
Projects
Contact
```

The demo must:

- run successfully,
- be responsive,
- use shared components,
- use shared sections,
- use the Luxury theme,
- load content from markdown,
- demonstrate project-level override.

---

# 17. Mandatory Override Demonstration
The demo must include at least one visible project override.

For example:

Shared:

```text
packages/sections/src/hero/HeroFullscreen.astro
```

Project override:

```text
apps/demo-site/src/sections/hero/HeroFullscreen.astro
```

The demo site must render the project version.

Document how to verify:

1. Run demo.
2. Confirm project Hero renders.
3. Temporarily rename/remove project Hero.
4. Restart/sync.
5. Confirm fallback Hero renders.

Also demonstrate project CSS overriding a theme token.

---

# 18. Theme Design Requirements
The initial `luxury` theme should demonstrate the intended visual quality.

Guidelines:

- clean,
- premium,
- spacious,
- modern,
- editorial,
- responsive,
- strong typography hierarchy,
- restrained use of animation,
- no excessive gradients,
- no excessive shadows,
- no unnecessary visual noise.

Suggested design principles:

```text
content width: 1200–1400px
section spacing: 80–150px
body line-height: approximately 1.5–1.8
subtle hover effects
subtle reveal animation
large high-quality imagery
mobile-first responsive behavior
```

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

---

# 19. Skills Architecture
Global skills live in:

```text
skills/
```

Project skills live in:

```text
apps/<project>/skills/
```

Global skills apply to all projects.

Project skills extend or refine global rules.

Initial global skill documents should be lightweight placeholders describing expectations for:

```text
Astro
UI design
Responsive design
Accessibility
Animation
SEO
Performance
Deployment
```

Future AI agents should read:

```text
Global Skills
+
Template Rules
+
Theme Rules
+
Project Skills
+
PROJECT.md
+
DESIGN.md
+
SITE.md
+
content
```

---

# 20. Project Documentation Files
Every project must contain:

## `PROJECT.md`

Business/project overview.

## `DESIGN.md`

Project-specific design decisions and overrides.

## `SITE.md`

Site map and page structure.

## `PLAN.md`

Implementation tasks/status.

## `REFERENCES.md`

Reference websites/screenshots and design analysis.

## `AGENTS.md`

Instructions for AI coding assistants working on this project.

These files may initially contain templates/placeholders generated by the CLI.

---

# 21. Component Showcase Application
Create:

```text
apps/showcase/
```

Purpose:

- visually browse Web Factory components,
- browse sections,
- preview themes,
- preview animations,
- support manual design selection,
- become a future metadata source for AI-assisted component/section selection.

Suggested routes:

```text
/components
/components/buttons
/components/cards
/sections
/sections/hero
/sections/projects
/themes
/themes/default
/themes/luxury
/animations
```

Future component metadata may include:

```ts
export default {
  id: 'hero/HeroFullscreen',
  category: 'hero',
  styles: ['luxury', 'minimal', 'architecture'],
  features: ['image', 'overlay', 'cta', 'motion'],
  recommendedFor: ['construction', 'property', 'flooring']
};
```

The initial implementation can remain small.

---

# 22. Future AI Workflow — Do Not Implement Yet
The architecture must support this future workflow:

```text
User Input
   ↓
Project name
Pages
Content
Images
Reference URL / screenshots
   ↓
Reference Analysis
   ↓
DESIGN.md
   ↓
SITE.md
   ↓
Theme Selection
   ↓
Section Selection
   ↓
Content Mapping
   ↓
Astro Generation
   ↓
Responsive QA
   ↓
Build
   ↓
Preview
   ↓
Deploy
```

Future goal:

```text
Create Website
```

from a dashboard or CLI command with minimal manual coding.

The initial architecture must not make this future automation difficult.

---

# 23. Open-Source Requirements
The repository will be published publicly on GitHub and should be suitable for community use.

Create:

```text
README.md
CONTRIBUTING.md
CODE_OF_CONDUCT.md
SECURITY.md
LICENSE
.github/
```

Recommended initial license:

```text
MIT
```

Do not include:

- customer secrets,
- private API keys,
- production credentials,
- commercial project content,
- private server information.

Add `.env.example`.

Add relevant `.gitignore` entries.

---

# 24. Naming Conventions
Use:

```text
Repository:
web-factory

Packages:
@webfactory/core
@webfactory/tokens
@webfactory/ui
@webfactory/sections
@webfactory/layouts
@webfactory/forms
@webfactory/seo
@webfactory/animations
@webfactory/utilities
@webfactory/cli

CLI:
webfactory

Project folders:
kebab-case

Component files:
PascalCase.astro

Section logical paths:
hero/HeroFullscreen
features/FeatureGrid
projects/ProjectGrid
```

Do not use inconsistent variants such as:

```text
web_factory
webFactory
WebFactoryProject
```

for filesystem/package identifiers unless technically required.

Human-facing product name is:

```text
Web Factory
```

---

# 25. Versioning and Upgrade Rules
Important maintenance rule:

**Never modify a project when upgrading shared Web Factory packages unless explicitly requested.**

Projects should consume shared layers.

Avoid copying shared code into projects during normal creation.

Project-specific custom code must stay in:

```text
apps/<project>/
```

This allows:

```text
Web Factory v1.0
→ v1.1
→ v1.2
```

without losing project customizations.

Later consider Changesets for package version management.

It is acceptable to add Changesets in the initial setup if implementation remains simple.

---

# 26. Technology Choices for Initial Version
Use:

```text
Node.js: current maintained LTS-compatible setup
pnpm workspaces
Turbo
Astro
TypeScript
CSS custom properties
Markdown/Astro content
```

CLI implementation:

```text
TypeScript
```

Recommended CLI helper libraries are acceptable if lightweight, for example:

```text
commander
prompts / @clack/prompts
picocolors
```

Do not introduce a large framework when a small dependency is enough.

---

# 27. Error Handling
CLI errors must be clear.

Bad:

```text
Error: ENOENT
```

Good:

```text
Web Factory could not find theme "luxury-x".

Available themes:
- default
- luxury
```

Examples to handle:

- duplicate project,
- invalid project name,
- missing theme,
- missing template,
- unknown section,
- invalid config,
- failed Astro build.

---

# 28. Initial Implementation Phases
Continue should implement in this order.

## Phase 1 — Repository foundation

Create:

- monorepo directories,
- workspace config,
- Turbo config,
- root TypeScript config,
- root scripts,
- open-source repository files.

Confirm:

```bash
pnpm install
```

works.

---

## Phase 2 — Shared packages

Create:

```text
@webfactory/core
@webfactory/tokens
@webfactory/ui
@webfactory/sections
```

plus minimal shells for the remaining packages.

Build a small working UI/section library.

---

## Phase 3 — Template and Theme

Create:

```text
templates/stardrive
themes/default
themes/luxury
```

Implement design tokens and theme loading.

---

## Phase 4 — Resolver / Override Engine

Implement:

```text
Project
→ Theme
→ Template
→ Shared
```

resolution.

Add automated tests for:

- section override,
- config override,
- CSS ordering.

---

## Phase 5 — CLI

Implement:

```bash
webfactory create
webfactory dev
webfactory build
webfactory check
webfactory sync
webfactory list
```

---

## Phase 6 — Demo

Create:

```text
apps/demo-site
```

and confirm the full flow works.

Do not start AI orchestration until the above phases are stable.

---

# 29. Acceptance Criteria
The initial implementation is complete only when all of these are true.

### Repository

- [ ] pnpm workspace installs successfully.
- [ ] Packages are independently identifiable.
- [ ] Root build command works.
- [ ] Repository has open-source documentation.

### CLI

- [ ] `pnpm wf list templates` shows `stardrive`.
- [ ] `pnpm wf list themes` shows `default` and `luxury`.
- [ ] `pnpm wf create test-site --template stardrive --theme luxury` creates a project.
- [ ] Duplicate project names are rejected safely.
- [ ] `pnpm wf dev test-site` starts Astro.
- [ ] `pnpm wf build test-site` successfully builds the project.
- [ ] `pnpm wf check test-site` validates the project.

### Architecture

- [ ] Project content is separate from components.
- [ ] Theme is separate from template.
- [ ] Shared components are not copied into every project.
- [ ] Project-level sections can override theme/template/shared sections.
- [ ] Project-level components can override lower layers.
- [ ] Project CSS loads after theme CSS.
- [ ] Project config overrides theme/template defaults.
- [ ] Removing an override correctly falls back to the next layer.

### Demo

- [ ] Home page works.
- [ ] About page works.
- [ ] Services page works.
- [ ] Projects page works.
- [ ] Contact page works.
- [ ] Desktop layout is usable.
- [ ] Tablet layout is usable.
- [ ] Mobile layout is usable.
- [ ] Demo visibly demonstrates at least one override.

---

# 30. Continue Implementation Instructions
When implementing this specification:

1. **Do not rewrite the architecture into a completely different design.**
2. Work in phases.
3. Create runnable code, not only empty directories.
4. Keep initial implementations small and understandable.
5. Prefer TypeScript.
6. Avoid unnecessary dependencies.
7. Do not duplicate shared components into project folders.
8. Preserve the override order:
   ```text
   Project > Theme > Template > Shared
   ```
9. Use relative logical paths for override keys.
10. Keep project content independent from layout code.
11. Create a working demo before adding additional abstractions.
12. Run install/build/type checks after each major phase.
13. Fix errors before proceeding to the next phase.
14. Document any architectural decision that differs from this specification.
15. Do not implement AI agents yet.
16. Do not add database/backend SaaS functionality to this website framework phase.
17. Keep all generated code suitable for public GitHub publication.

---

# 31. First Continue Task
Use the following as the first execution task:

```text
Implement Phase 1 and Phase 2 of WEB_FACTORY_REQUIREMENTS.md.

Requirements:

1. Create the Web Factory pnpm/Turbo monorepo.
2. Create all top-level directories defined in the specification.
3. Create @webfactory/core, @webfactory/tokens, @webfactory/ui and @webfactory/sections as real workspace packages.
4. Create package shells for layouts, forms, seo, animations and utilities.
5. Configure Tailwind CSS v4 and the shared semantic token architecture.
6. Add a minimal Container, Button and Header component.
7. Add a minimal HeroFullscreen, FeatureGrid and CTA section.
8. Add root TypeScript, pnpm workspace and Turbo configuration.
8. Add README, MIT LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY and .env.example.
9. Do not implement AI agents.
10. Do not implement the full CLI yet.
11. Run pnpm install and the available build/type-check commands.
12. Fix all errors.
13. At completion, report:
    - files created,
    - commands executed,
    - errors fixed,
    - remaining Phase 3 work.
```

After Phase 1 and Phase 2 pass successfully, execute Phase 3–6 one phase at a time.

---

# 32. Target Developer Experience
The long-term developer experience should become:

```bash
git clone <web-factory-repository>
cd web-factory
pnpm install

pnpm wf create forest-flooring \
  --template stardrive \
  --theme luxury

pnpm wf dev forest-flooring
```

Then project work should mainly involve:

```text
apps/forest-flooring/src/content/
apps/forest-flooring/public/images/
apps/forest-flooring/project/DESIGN.md
```

Custom development should only be needed when the project requires an override:

```text
apps/forest-flooring/src/components/
apps/forest-flooring/src/sections/
apps/forest-flooring/src/styles/
apps/forest-flooring/src/config/
```

---

# 33. Final Architecture Rule
The most important Web Factory rule is:

> **Shared layers provide capabilities; projects provide identity and customization.**

A project should use shared Web Factory code by default and override only what it genuinely needs.

The framework must therefore remain:

```text
Reusable
+
Composable
+
Overrideable
+
Upgradeable
+
AI-friendly
+
Open source
```

This principle should guide all future Web Factory development.
