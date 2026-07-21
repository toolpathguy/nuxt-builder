# Task 02 — Component Registry

## Goal
Define the **Component Registry**: the single source of truth describing every
placeable building block — its editable props, its slots, whether it accepts
children — plus the actual Vue components and a runtime map from type-string to
component.

## Context
The registry is consumed by three later systems: the render engine (Task 04), the
auto-generated property panel (Task 06), and the compiler (Task 09). Design it so
none of those need to hardcode component knowledge. Read `00-START-HERE.md` and
`/types/shared.ts` (Task 01) before starting.

## Requirements

1. **Registry types** in `/types/registry.ts`:
   ```ts
   interface RegistryEntry {
     type: string;                 // unique, PascalCase, e.g. "Hero"
     label: string;                // human name for the palette
     category: 'layout' | 'content' | 'media' | 'form';
     icon?: string;                // Lucide icon name (e.g. "i-lucide-layout")
     props: Record<string, PropSchema>;   // editable props (from shared.ts)
     slots?: string[];             // named slots that accept child nodes
     acceptsChildren: boolean;     // whether default slot takes children
     // Restricts which node types may appear as default-slot children.
     // Omitted = any type allowed (subject to acceptsChildren).
     allowedChildren?: string[];
     // A compiler hint: the tag/name the compiler emits. Defaults to `type`.
     compileAs?: string;
   }
   type Registry = Record<string, RegistryEntry>;
   ```

2. **Validate entries with zod** at module load (dev only is fine). A malformed
   entry (missing label, unknown prop type, `acceptsChildren:false` but declares
   default-slot children) should throw a clear error naming the entry.

3. **Starter component set.** Create real Nuxt components under
   `/app/components/blocks/` AND their registry entries. Each component:
   - Uses `<script setup lang="ts">` with `defineProps` typed to match its
     registry `props`.
   - Renders cleanly with sensible defaults so it looks fine on an empty canvas.
   - Uses Tailwind CSS v4 utility classes for styling. Keep components simple and
     self-contained — no dependency on Nuxt UI (blocks should be portable for
     the compiled output).

   Minimum set:
   | type | category | key props | slots / children |
   |------|----------|-----------|------------------|
   | `Section`  | layout  | `padding(enum sm/md/lg)`, `bg(color)`, `maxWidth(enum full/wide/narrow)` | acceptsChildren |
   | `Columns`  | layout  | `gap(enum sm/md/lg)` | acceptsChildren, `allowedChildren: ['Column']` |
   | `Column`   | layout  | `span(number min:1 max:4 step:1)` | acceptsChildren |
   | `Hero`     | content | `heading(string)`, `subheading(text)`, `align(enum left/center)`, `bg(color)` | slot: `actions` |
   | `Heading`  | content | `text(string)`, `level(enum h1..h4)`, `align(enum)` | none |
   | `Text`     | content | `body(text)`, `align(enum)` | none |
   | `Button`   | content | `label(string)`, `href(url)`, `variant(enum primary/secondary/ghost)` | none |
   | `Image`    | media   | `src(image)`, `alt(string)`, `rounded(boolean)` | none |
   | `Spacer`   | layout  | `size(enum sm/md/lg)` | none |

4. **Registry purity split:**
   - **`/registry/entries.ts`** — export all `RegistryEntry` data as pure data
     objects. NO `.vue` imports allowed here. This file is safe to import from the
     compiler (Task 09), its CLI, and server routes (Task 08).
   - **`/registry/index.ts`** — import entries from `entries.ts`, import the Vue
     components, and export:
     - `registry: Registry` (re-exported from entries)
     - `componentMap: Record<string, Component>` mapping each `type` to its
       imported Vue component. This is what `<component :is>` will use.
     - Helpers: `getEntry(type)`, `defaultPropsFor(type)` (builds a props
       object from each `PropSchema.default`), and `entriesByCategory()`.
   - **Rule:** The compiler, CLI, and server routes must ONLY import from
     `/registry/entries.ts`. Importing `/registry/index.ts` (which pulls `.vue`
     files) would break any non-Vite runtime (tsx CLI, Nitro server).

5. **`useRegistry()` composable** in `/app/composables/useRegistry.ts` exposing
   the registry, the component map, and the helper functions to Vue land.

## Acceptance criteria
- `npm run typecheck` passes.
- A unit test in `/tests/registry.test.ts` asserts: every `componentMap` key has a
  matching `registry` entry and vice-versa; `defaultPropsFor('Hero')` returns the
  declared defaults; zod validation throws on a deliberately broken entry.
- Each block component can be imported and mounted in isolation without errors.
- **Purity check:** `/registry/entries.ts` has zero `.vue` imports; importing it
  from a plain Node/tsx script does not throw.
- **Columns rule:** `Columns` declares `allowedChildren: ['Column']`; the registry
  entry enforces this constraint. A bare `Column` outside a `Columns` parent is
  NOT validated here — that invariant is enforced by drop-target logic (Task 07)
  and is tolerated by the validator. Tasks 07 (drop targets) and 09 (compilation)
  rely on the rule that `Columns` only ever contains `Column` children.

## Out of scope
No canvas, no editor, no drag-drop. Components should render standalone but need
no editor awareness yet.

## Commit
`feat(02): component registry + starter block set`

Work on branch `feat/02-component-registry`, merge to `main` via PR per git steering.
