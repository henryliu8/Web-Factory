# ADR 0002: Keep Templates and Themes Separate

- Status: Accepted
- Scope: Structural and visual responsibilities

## Context

When page structure and brand appearance are bundled into one “theme,” switching visual direction duplicates layouts and upgrading a template can overwrite customer customization.

## Decision

Template owns structure and functional defaults, Theme owns visual direction, and Project owns final content, branding, and necessary overrides. The complete precedence is:

```text
Project > Theme > Template > Shared
```

A Template may provide layouts, header and footer behavior, page templates, structural CSS, and a scaffold, but should avoid final branding. A Theme works primarily through semantic tokens, typography, motion, and general visual rules. It replaces markup only when necessary.

## Consequences

- One template can work with multiple themes.
- Switching Theme does not require rewriting page structure.
- A Project can override only its differences and continue inheriting upstream fixes.
- Component props, logical paths, and semantic tokens must remain stable so independent layers can compose.
- New functionality must first be classified as structural or visual rather than placed across boundaries for convenience.

## Exception

When a visual direction genuinely requires different markup, a Theme may provide an override at the same logical path. It must preserve the calling contract and be covered by fallback and theme-isolation tests.
