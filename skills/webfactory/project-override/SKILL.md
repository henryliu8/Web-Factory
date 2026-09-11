---
name: project-override
description: Add or diagnose a project-level Web Factory override for components, sections, styles, or configuration. Use when one app must customize shared, template, or theme behavior without modifying upstream layers.
---

# Project overrides

Confirm the customization is genuinely project-specific. Reusable behavior belongs in a shared package, template, or theme instead.

Place overrides only inside `apps/<project>`. Preserve the original public props and stable logical path when replacing a component or section. Register the project entry in the existing project registry so it wins over theme, template, and shared entries.

Use `src/styles/project.css` for token and visual overrides; it loads last. Prefer overriding existing semantic `--wf-*` tokens over copying component CSS. Keep project content and assets project-owned.

Do not edit or duplicate the upstream component unless the project requires changed markup or behavior. Verify both the override and its fallback path when practical.

Run the project check and build, then `pnpm test:integration` when registry precedence, style order, or fallback behavior changes.
