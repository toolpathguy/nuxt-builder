# Task 01 — Project Setup

## Goal
Scaffold the Nuxt 4 + TypeScript workspace with Nuxt UI, Pinia, and the tooling
and directory structure the rest of the build depends on.

## Context
Read `00-START-HERE.md` first for the overall architecture and conventions. This
task produces an empty-but-running skeleton. No builder features yet — just a
clean foundation with the folders, base types, and dev tooling in place.

## Requirements

1. **Initialize Nuxt 4** (latest stable, v4.5+) in the repo root with TypeScript.
   - Enable `typescript.strict: true` and `typescript.typeCheck: true` in
     `nuxt.config.ts`.
   - Set `ssr: true` (we want real Nuxt pages as output, but the editor route
     will be client-heavy).
   - Enable `future: { compatibilityVersion: 5 }` for forward compatibility with
     Nuxt 5.

2. **Install and register dependencies:**
   - `@nuxt/ui` (v3) — brings Tailwind CSS v4, Reka UI primitives, and Lucide
     icons. Register as a Nuxt module.
   - `@pinia/nuxt` and `pinia` — state management.
   - `vitest`, `@vue/test-utils`, `@nuxt/test-utils`, `happy-dom` — testing.
   - `zod` — runtime validation of the Page Document and Registry entries.
   - `@formkit/drag-and-drop` — reserved for Task 07; install now, don't use yet.
   - Configure ESLint via `@nuxt/eslint` with the recommended flat config.

3. **Create the directory skeleton** exactly as described in `00-START-HERE.md`
   ("Directory layout"). Add a `.gitkeep` to any folder that would otherwise be
   empty. Remember Nuxt 4 uses the `app/` directory structure.

4. **Base shared types** in `/types/shared.ts`:
   - `type PropType = 'string' | 'text' | 'number' | 'boolean' | 'enum' | 'color' | 'url' | 'image'`
   - A `PropSchema` discriminated union keyed on `type`, where each variant
     carries the fields it needs (`enum` has `options: string[]`; `number` has
     optional `min`/`max`/`step`; all have optional `default` and `label`).
   - Export a `NodeId` branded string type and a `makeNodeId()` helper
     (use `crypto.randomUUID()`).

5. **Scripts** in `package.json`: `dev`, `build`, `generate`, `lint`,
   `typecheck` (`nuxi typecheck`), `test` (`vitest run`), `test:watch`.

6. **A placeholder `/app/pages/index.vue`** that links to `/editor` (route added
   in a later task) and an `/app/pages/editor.vue` stub that renders the text
   "Editor coming soon". Use `<UButton>` for the link to verify Nuxt UI works.

7. **A single smoke test** in `/tests/smoke.test.ts` that imports `makeNodeId`
   and asserts it returns a non-empty string, to prove Vitest is wired up.

8. **Theme configuration** in `app.config.ts`: set a neutral base theme using
   Nuxt UI's theming system. Configure the primary color (e.g. indigo) and
   neutral (e.g. slate). This ensures a consistent look for the editor chrome.

## Acceptance criteria
- `npm run dev` serves the app; `/` renders with a working Nuxt UI button linking
  to `/editor`.
- `npm run typecheck` passes with zero errors.
- `npm run lint` passes.
- `npm run test` runs the smoke test green.
- The directory skeleton matches `00-START-HERE.md`.
- Nuxt UI components render correctly (button on index page proves it).

## Out of scope
No registry content, no editor UI, no components. Just the skeleton. Do not
create anything owned by later tasks.

## Commit
`feat(01): scaffold nuxt 4 + ts + pinia + nuxt ui + tooling`
