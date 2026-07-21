# Task 09 — Compiler (Page Document → .vue)

## Goal
Build the **deterministic compiler**: a pure function that walks a `PageDocument`
and emits clean Nuxt/Vue `.vue` source. This handles the predictable majority of
pages with no AI involved. Given the registry maps every type to a known
component with known props, this is mechanical and fully testable.

## Context
Depends on the registry (Task 02, for `compileAs` and prop schemas) and the Page
Document + shared tree utilities (Task 03). The compiler must be **framework-node
pure**: no Vue runtime, no Pinia, no browser APIs — so it can run in a build step,
a CLI, or a server route. It only produces text.

## Requirements

1. **Entry point** in `/compiler/compile.ts`:
   ```ts
   function compilePage(doc: PageDocument, registry: Registry): CompiledPage
   interface CompiledPage {
     filename: string;         // e.g. "home.vue"
     code: string;             // full <template>/<script setup> SFC source
     usedComponents: string[]; // block components referenced, for imports
   }
   ```

2. **Template emission.** Walk `doc.root` and emit a Vue `<template>`:
   - Each node becomes `<ComponentName ...props>`, using `compileAs ?? type`.
   - **Props → attributes**, correctly typed:
     - string/url/image/color/enum → static attribute `heading="..."` when the
       value is a literal; use `:prop="..."` binding only when needed.
     - number/boolean → bound form (`:count="3"`, `rounded`) so Vue receives the
       right type, not a string.
     - Omit props equal to their schema default to keep output clean (configurable
       via an option `emitDefaults?: boolean`, default false).
   - **Default-slot children** render nested inside the tag; **named slots** emit
     `<template #slotName>...</template>`.
   - Produce **readable, indented** output (2-space indent, one element per line
     for block-level nodes). Escape/quote attribute values safely.

3. **Script block.** Emit `<script setup lang="ts">` that imports each used block
   component from `~/components/blocks/...` (or auto-import-aware: if the target
   project uses Nuxt auto-imports, allow an option to skip explicit imports).
   Include page `meta` via `useSeoMeta`/`definePageMeta` when `doc.meta`/`title`
   are present.

4. **Determinism.** Same input → byte-identical output. No timestamps, no random
   ordering, stable prop ordering (registry-declared order). This is essential for
   diffing and for tests.

5. **Multi-page + CLI.**
   - `compileProject(docs: PageDocument[], registry)` → array of files, mapping
     each `doc.page` to `/pages/<page>.vue` (respecting nested routes if `page`
     contains slashes).
   - A small CLI `/compiler/cli.ts` (runnable via `node`/`tsx` or an npm script
     `compile`) that reads exported `.json` file(s) and writes `.vue` files to a
     target dir, defaulting to `/app/pages/` (or a `--out` dir).

6. **Formatting pass.** Optionally run the emitted code through Prettier (if
   available) for final formatting; fall back to the built-in indenter if not.
   Keep this behind a flag so tests can assert on raw output.

## Acceptance criteria
- `npm run typecheck` passes; the compiler module has **no** Vue/Pinia/browser
  imports.
- `compilePage(seedDocument, registry)` produces a valid `.vue` file that, when
  placed in `/app/pages`, renders the same result as the editor canvas for that
  document (verify by eye + a snapshot).
- Golden-file tests in `/tests/compiler/`: several fixture documents each have an
  expected `.vue` snapshot; output is byte-stable across runs.
- Number/boolean props emit as bound attributes (not string literals); default
  props are omitted unless `emitDefaults`.
- Named slots compile to `<template #name>`.
- The CLI compiles an exported `.json` to a `.vue` file on disk.

## Out of scope
No AI. No handling of props/logic the registry can't express — those are the
Claude Code path (Task 10). No styling extraction (components own their styles).

## Commit
`feat(09): deterministic page-document to .vue compiler + CLI`
