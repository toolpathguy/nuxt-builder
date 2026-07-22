# CLAUDE.md

This repository is primarily built by Kiro using the specs in `.kiro/specs/`
and the task instructions in `MD Instructions/`. Claude (GitHub Actions
reviewer, Claude Code sessions) must follow the same project conventions.

## Read these first

- `.kiro/steering/AI-MAP.md` — project map, key files, conventions, and the
  Decisions Log. Treat the Decisions Log as settled; do not relitigate it in
  reviews.
- `.kiro/steering/Git-Branching-and-Merging.md` — branch/PR workflow. Never
  commit directly to main.
- `MD Instructions/00-START-HERE.md` — architecture overview and task order.

## Non-negotiable conventions

- Nuxt 4 (stable defaults, no `future.compatibilityVersion`), Nuxt UI v4,
  Tailwind v4, TypeScript strict, no `any`.
- Blocks (`app/components/blocks/`) use Tailwind only — never Nuxt UI.
  Editor chrome (`app/components/editor/`) uses Nuxt UI.
- Registry purity: `/compiler`, its CLI, and `/server` may only import
  registry data from `/registry/entries.ts` — never anything that
  transitively imports `.vue` files.
- Component tests mounting Nuxt UI components use `mountSuspended` from
  `@nuxt/test-utils/runtime` (Vitest environment `nuxt`); pure unit tests
  opt into node via a `// @vitest-environment node` docblock.
- A fresh clone must pass: `npm ci && npm run lint && npm run typecheck &&
  npm test && npm run build`.
- CI runs these checks as a gate before the Claude review job. Claude does
  not re-run them — it focuses on code review only.
