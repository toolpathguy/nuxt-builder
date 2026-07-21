---
inclusion: auto
---

# AI Project Map — Nuxt Visual Builder

This document provides agents with project context, current status, and maps to
the build instructions. Update this file as each task is completed.

## Project Overview

A Wix/Squarespace-style visual page editor built as a Nuxt 4 app. Users assemble
pages from real Vue components via drag-and-drop. The editor produces a Page
Document (JSON) that a deterministic compiler transforms into deployable `.vue`
files. A Claude Code handoff path handles the 10% requiring judgment.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Nuxt 4 (v4.5+) — stable defaults, no future.compatibilityVersion flag |
| UI | Nuxt UI v4 (`@nuxt/ui`) — Tailwind CSS v4, Reka UI, Lucide icons |
| State | Pinia (`@pinia/nuxt`) |
| Validation | Zod |
| Drag & Drop | `@formkit/drag-and-drop` |
| Testing | Vitest, @vue/test-utils, @nuxt/test-utils, happy-dom |
| Linting | @nuxt/eslint (flat config) |

## Repository

- Remote: `https://github.com/toolpathguy/nuxt-builder.git`
- Branch strategy: feature branches per task, merge to `main`

## Directory Structure (Nuxt 4 convention)

```
/app
  /components
    /blocks          # User-placeable building blocks (Hero, Section, ...)
    /editor          # Editor UI (canvas, tree, palette, property panel)
      /controls      # Per-PropType control wrappers (Task 06)
  /composables       # useRegistry, useEditor, useDragDrop, ...
  /stores            # Pinia: editor store (page document + selection + history)
  /pages             # /editor route + compiled output target
/server              # Nuxt server routes (persistence API)
/types               # registry.ts, page-document.ts, shared.ts
/registry            # Registry definitions + index
/compiler            # JSON → .vue emitter (pure, no Vue/Pinia deps)
/tests               # Vitest test files
/specs               # Build instruction MDs
```

## Build Plan & Task Status

Instructions live in `/specs/` (or `MD Instructions/` locally). Work through
them sequentially — each depends on artifacts from prior tasks.

| # | Task | Status | Branch | Notes |
|---|------|--------|--------|-------|
| 01 | Project Setup | 🔲 Not started | — | Scaffold, types, tooling |
| 02 | Component Registry | 🔲 Not started | — | Registry types, 8 starter blocks |
| 03 | Page Document Schema | 🔲 Not started | — | Schema, validation, Pinia store |
| 04 | Render Engine | 🔲 Not started | — | Recursive `<RenderNode>`, canvas |
| 05 | Editor Shell | 🔲 Not started | — | Layout, palette, tree, inspector |
| 06 | Property Panel | 🔲 Not started | — | Auto-generated Nuxt UI controls |
| 07 | Drag & Drop | 🔲 Not started | — | @formkit/drag-and-drop integration |
| 08 | Persistence | 🔲 Not started | — | Save/load/export, server routes |
| 09 | Compiler | 🔲 Not started | — | Deterministic JSON → .vue |
| 10 | Claude Code Handoff | 🔲 Not started | — | Payload format, prompt template |
| 11 | Testing & Polish | 🔲 Not started | — | Undo/redo, a11y, templates, tests |

**Legend:** 🔲 Not started · 🔨 In progress · ✅ Complete

## Architecture Concepts

### Component Registry
Single source of truth for all placeable blocks. Defines props (typed via
`PropSchema`), slots, children acceptance, and compiler hints. Consumed by:
- Render engine (maps `type` → Vue component)
- Property panel (auto-generates controls)
- Compiler (emits correct attributes)

### Page Document
A serializable JSON tree (`PageNode` with children/slots). Must survive
`JSON.stringify` → `JSON.parse`. Never contains Vue component refs or functions.

### Two Compilation Paths
1. **Deterministic compiler** — pure function, no AI, mechanical 1:1 translation
2. **Claude Code handoff** — for responsive refinement, logic, extraction

### Editor Design Principles
- Flow/grid layout only (no absolute positioning)
- The canvas renders real production components (`<component :is>`)
- Schema-driven: add a block = write component + registry entry → editor UI free
- Immutable-style store actions (enables undo/redo via snapshots)

## Key Files to Know

| File | Purpose |
|------|---------|
| `/types/shared.ts` | `PropType`, `PropSchema`, `NodeId`, `makeNodeId()` |
| `/types/registry.ts` | `RegistryEntry`, `Registry` |
| `/types/page-document.ts` | `PageNode`, `PageDocument`, Zod schemas |
| `/registry/entries.ts` | Pure registry data (NO .vue imports) — safe for compiler/CLI/server |
| `/registry/index.ts` | componentMap (imports .vue) + re-exports entries — app-side only |
| `/app/stores/editor.ts` | Pinia store: document, selection, CRUD |
| `/compiler/compile.ts` | `compilePage()` entry point |
| `/compiler/tree.ts` | Shared tree-walk utilities (pure) |
| `/compiler/handoff.ts` | `buildHandoffPayload()` for Claude Code |
| `nuxt.config.ts` | Nuxt 4 config with UI, Pinia |
| `app.config.ts` | Nuxt UI theme (primary color, neutral) |

## Conventions

- TypeScript strict, no `any` — use discriminated unions
- Commit messages: `feat(NN): short description`
- Work on `feat/NN-*` branches, merge to `main` via PR per git steering — never
  commit directly to main
- Block components use Tailwind utilities (portable, no Nuxt UI dependency)
- Editor chrome uses Nuxt UI v4 components exclusively
- Validation errors shown via `<UFormField :error="...">`, NOT `:error` on inputs
- Tests required per task acceptance criteria
- Component tests use `mountSuspended` from `@nuxt/test-utils/runtime` with the
  `nuxt` Vitest environment (bare @vue/test-utils will fail with Nuxt UI)
- Registry purity: compiler, CLI, and server routes import ONLY from
  `/registry/entries.ts` (never `/registry/index.ts` which pulls .vue files)
- Columns block: only accepts Column children (enforced by registry + validation)
- Zod pinned to ^4

## How to Update This File

After completing a task:
1. Change its status from 🔲 to ✅
2. Add the branch name if applicable
3. Add any notes about deviations or decisions made
4. Update "Key Files" if new important files were created

## Decisions Log

| Date | Decision | Context |
|------|----------|---------|
| — | @formkit/drag-and-drop spike required | Task 07 requires proving nested named-slot drops work before full wiring. If it can't, fall back to custom pointer-events for canvas, keep library for flat lists. |
| — | Columns only accepts Column children | `allowedChildren: ['Column']` on Columns entry + `allowedParents: ['Columns']` on Column entry. Both validated by `validateAgainstRegistry` (Task 03). Drop-target guard (Task 07) checks both directions. Column.span is a number prop (min:1, max:4). |
