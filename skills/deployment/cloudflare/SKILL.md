---
name: cloudflare
description: Prepare and deploy a Web Factory Astro project to Cloudflare. Use for Cloudflare Pages or Workers output, adapter configuration, environment bindings, production builds, and deployment troubleshooting.
---

# Deploy to Cloudflare

Confirm whether the selected app needs static Pages output or a Workers runtime. Reuse existing project and Wrangler configuration before adding files or dependencies, and verify current Astro and Cloudflare documentation before choosing an adapter.

Keep Cloudflare-specific configuration in `apps/<project>` unless it is demonstrably shared. Store secrets and bindings in Cloudflare configuration or secret storage; never commit secret values or expose server-only values to client code.

Run `pnpm wf check <project>` and `pnpm wf build <project>` before deployment. Verify routes, assets, redirects, runtime compatibility, required bindings, and the public site's primary routes after deployment.

Do not create or mutate Cloudflare resources until the user has selected the account, project, and intended target.
