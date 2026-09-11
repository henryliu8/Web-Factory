# Validate a project

Use this workflow before handing off a project or proceeding to deployment.

## Flow

1. Review the working tree and identify the affected app, packages, template, and theme.
2. Run:

   ```sh
   pnpm wf check <project>
   pnpm wf build <project>
   ```

3. Inspect affected routes at narrow and wide viewports.
4. Check keyboard access, focus, headings, links, images, reduced motion, and console errors.
5. Run `pnpm test:integration` when shared packages, registries, scaffolds, style composition, or public exports changed.
6. Fix failures before continuing; do not describe a failed build as complete.

## Complete when

Automated checks pass and the affected user flows render and operate correctly.
