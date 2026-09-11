# Update project content

Use this workflow for copy, navigation, page metadata, images, and section data that do not require shared-code changes.

## Flow

1. Read `apps/<project>/project/PROJECT.md`, `DESIGN.md`, `SITE.md`, and the affected content files.
2. Update only files owned by `apps/<project>`.
3. Keep content separate from Astro presentation and preserve the project's content schema.
4. Put images in the project's public assets and use meaningful filenames and alternative text.
5. Check affected routes for heading order, links, metadata, and responsive layout.
6. Run [project validation](../quality/validate-project.md).

## Complete when

The rendered pages match the requested content, no shared branding was changed, and project check and build pass.
