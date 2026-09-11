# Deploy a project

Use this workflow after project validation and only when the target provider is known.

## Inputs

- Project
- Provider
- Target account and project
- Required environment variables and bindings

## Flow

1. Run [project validation](../quality/validate-project.md).
2. For Cloudflare, read [`cloudflare`](../../skills/deployment/cloudflare/SKILL.md). For Vercel, read [`vercel`](../../skills/deployment/vercel/SKILL.md).
3. Reuse existing provider configuration and add an adapter only when the runtime requires it.
4. Confirm environment variables, redirects, canonical origin, output mode, and secrets handling.
5. Deploy only to the user-selected target.
6. Verify the provider reports success and check the public site's primary routes.

## Complete when

The production target is known, the build succeeds, required configuration is present, and the deployed routes respond correctly.
