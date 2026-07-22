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
     // Restricts which parent types this node may be dropped into.
     // Omitted = any parent allowed (subject to parent's acceptsChildren).
     allowedParents?: string[];
     // A compiler hint: the tag/name the compiler emits. Defaults to `type`.
     compileAs?: string;
   }
   type Registry = Record<string, RegistryEntry>;
   ```

2. **Validate entries with zod** at module load (dev only is fine). A malformed
   entry (missing label, unknown prop type, `acceptsChildren:false` but declares
   default-slot children) should throw a clear error naming the entry.

3. **Starter component set.** Create thin wrapper Nuxt components under
   `/app/components/blocks/` AND their registry entries. The primary blocks wrap
   real Nuxt UI components; a few custom gap-fillers handle what Nuxt UI lacks.

   Each Nuxt UI wrapper component:
   - Uses `<script setup lang="ts">` with `defineProps` typed to match its
     registry `props`.
   - Passes all registered props through to the actual Nuxt UI component.
   - Renders cleanly with sensible defaults so it looks fine on an empty canvas.
   - Sets `compileAs` in the registry entry to the actual Nuxt UI tag name
     (e.g., `compileAs: 'UPageHero'`).

   Custom gap-filler components use Tailwind CSS v4 utility classes and have no
   `compileAs` (they compile as their own component name).

   Minimum set:
   | type | compileAs | category | key props | children |
   |------|-----------|----------|-----------|----------|
   | `PageHero`    | UPageHero    | layout  | `title(string)`, `description(text)`, `headline(string)`, `orientation(enum vertical/horizontal)` | none |
   | `PageSection` | UPageSection | layout  | `title(string)`, `description(text)`, `headline(string)`, `orientation(enum)`, `reverse(boolean)` | acceptsChildren |
   | `PageColumns` | UPageColumns | layout  | (none) | acceptsChildren |
   | `PageGrid`    | UPageGrid    | layout  | (none) | acceptsChildren |
   | `PageCTA`     | UPageCTA     | content | `title(string)`, `description(text)`, `headline(string)` | none |
   | `PageFeature` | UPageFeature | content | `title(string)`, `description(text)`, `icon(string)`, `orientation(enum)` | none |
   | `PageCard`    | UPageCard    | content | `title(string)`, `description(text)`, `to(url)` | none |
   | `Button`      | UButton      | content | `label(string)`, `to(url)`, `color(enum)`, `variant(enum)`, `size(enum)` | none |
   | `Card`        | UCard        | content | (none) | acceptsChildren |
   | `Separator`   | USeparator   | layout  | `orientation(enum horizontal/vertical)`, `label(string)` | none |
   | `RichText`    | (custom)     | content | `body(text)`, `align(enum)` | none |
   | `Image`       | (custom)     | media   | `src(image)`, `alt(string)`, `rounded(boolean)` | none |
   | `Spacer`      | (custom)     | layout  | `size(enum sm/md/lg)` | none |

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
  matching `registry` entry and vice-versa; `defaultPropsFor('PageHero')` returns
  the declared defaults; zod validation throws on a deliberately broken entry.
- Each block component can be imported and mounted in isolation without errors.
- **Purity check:** `/registry/entries.ts` has zero `.vue` imports; importing it
  from a plain Node/tsx script does not throw.
- **Nuxt UI blocks:** Every Nuxt UI wrapper block has a `compileAs` field starting
  with `'U'` and renders the actual Nuxt UI component in the editor canvas.

## Out of scope
No canvas, no editor, no drag-drop. Components should render standalone but need
no editor awareness yet.

## Commit
`feat(02): component registry + starter block set`

Work on branch `feat/02-component-registry`, merge to `main` via PR per git steering.
