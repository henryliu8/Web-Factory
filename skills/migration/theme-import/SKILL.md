# External Theme Import Skill

## Purpose

Extract reusable visual design from an external repository and adapt it
to the Web Factory Theme architecture.

## Theme owns

- colors
- typography
- fonts
- radii
- shadows
- surfaces
- visual density
- appropriate motion defaults

## Theme does NOT own

- pages
- layouts
- routing
- project content
- navigation data
- client images
- deployment
- page composition

## Required approach

Inspect:

themes/default
themes/luxury

Reuse the existing Web Factory Theme package contract.

Translate upstream visual values into:

--wf-*

Do not create another token system.

Do not modify Shared components to know about individual themes.

Forbidden:

if (theme === "...")

inside Shared UI/Sections.

Do not copy upstream Tailwind configuration wholesale.

Preserve Tailwind CSS v4.

## Validation

The same Template must work with:

default
luxury
<new-theme>

Changing Theme must change appearance,
not page structure/content.