# Rising Tree editing instructions

Follow repository instructions and preserve Project > Theme > Template > Shared.

Read PROJECT.md, DESIGN.md, SITE.md and SOURCE-NOTES.md before changing this site. Edit business content in JSON, brand exceptions in project CSS and project-specific components through `src/config/overrides.ts`. Do not copy template/shared components into this app without an actual override need.

Do not strengthen clinical claims or change professional qualifications based on inference. Keep the enquiry form visibly disconnected until a real delivery workflow is implemented and tested.

Run `pnpm wf check rising-tree` and `pnpm --filter @webfactory/app-rising-tree test:integration` after changes. Schema and core registry changes also require the root integration gate.
