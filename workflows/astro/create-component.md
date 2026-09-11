# Create an Astro component

Use this workflow for a new component or section. Read [`component-create`](../../skills/astro/component-create/SKILL.md) first.

## Flow

1. Search for an existing component that can be reused or extended.
2. Decide its owner: project, theme, template, shared UI, or shared sections.
3. Implement the smallest typed Astro component with content supplied through props or project data.
4. Add a public export or registry entry only when a real consumer requires it.
5. Check accessibility, responsive behavior, and reduced motion where relevant.
6. Run the affected package or project check and build.

## Complete when

The component has a real consumer, respects its layer boundary, and passes the affected checks.
