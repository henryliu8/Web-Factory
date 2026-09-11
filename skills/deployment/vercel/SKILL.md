---
name: vercel
description: Prepare and deploy a Web Factory Astro project to Vercel. Use for Vercel output, adapter configuration, environment variables, production builds, previews, and deployment troubleshooting.
---

# Deploy to Vercel

Confirm whether the selected app can use static output or needs a Vercel server runtime. Reuse existing project configuration before adding files or dependencies, and verify current Astro and Vercel documentation before choosing an adapter.

Keep Vercel-specific configuration in `apps/<project>` unless it is demonstrably shared. Store secrets in Vercel environment settings; commit only safe configuration and variable names. Keep preview and production values distinct when required.

Run `pnpm wf check <project>` and `pnpm wf build <project>` before deployment. Verify routes, assets, redirects, runtime compatibility, required environment variables, and the public site's primary routes after deployment.

Do not create a Vercel project, link an account, or deploy until the user has selected the target project and scope.
