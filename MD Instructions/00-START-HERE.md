# Nuxt Visual Builder — Build Plan (START HERE)

This folder contains a sequenced set of build tasks executed via **Kiro specs**.
Each numbered file is a self-contained task. Work through them **in order** — later
files assume the artifacts produced by earlier ones exist.

## What we're building

A Wix/Squarespace-style **visual page editor** where the building blocks are real
Nuxt (Vue 3) components. The editor does **not** output source code directly.
Instead it produces a serialized **Page Document (JSON)** describing a tree of
component instances. A separate **compiler** turns that JSON into `.vue` files.

Two things consume the Page Document:
1. A deterministic **compiler** (`json → .vue`) for the predictable 90%.
2. **Claude Code itself**, when a page needs judgment (responsive tweaks, logic,
   extraction of repeated blocks).

The **Component Registry** is the single source of truth shared by the editor
(to render + build property panels) and the compiler (to emit Vue).

```
Component Registry  ─┬─►  Editor canvas (live <component :is>)
   (schema)          ├─►  Auto-generated property panel (Nuxt UI controls)
                     └─►  Compiler (JSON → .vue)

Page Document (JSON) ─────►  Compiler / Claude Code ─────►  Nuxt pages & components
```

## How to run this with Kiro

1. The repo lives at `https://github.com/toolpathguy/nuxt-builder.git`.
2. Each task maps to a Kiro spec. Work through them in order.
3. Each task is implemented on a `feat/NN-*` branch and merged to `main` via PR
   per the git steering doc.
4. Review each PR, then move to the next spec.

**Do not** implement multiple specs at once. Each file is scoped so one spec can
finish and you can verify before moving on.

## File order

| File | Task | Depends on |
|------|------|-----------|
| `01-project-setup.md`        | Scaffold Nuxt 4 + TS + Pinia + Nuxt UI + tooling | — |
| `02-component-registry.md`   | Registry format + starter component set | 01 |
| `03-page-document-schema.md` | Page Document JSON schema + validation + store | 01, 02 |
| `04-render-engine.md`        | Recursive `<RenderNode>` canvas renderer | 02, 03 |
| `05-editor-shell.md`         | Editor layout: canvas, tree, palette, selection | 04 |
| `06-property-panel.md`       | Auto-generated prop controls from registry | 02, 03, 05 |
| `07-drag-and-drop.md`        | Palette→canvas + reorder + reparent | 05, 06 |
| `08-persistence.md`          | Save/load/export Page Documents | 03, 05 |
| `09-compiler.md`             | Deterministic `Page Document → .vue` compiler | 02, 03 |
| `10-claude-code-handoff.md`  | Prompt/format for AI compilation path | 09 |
| `11-testing-and-polish.md`   | Tests, a11y, undo/redo, seed content | all |

## Global conventions (apply to every task)

- **Stack:** Nuxt 4 (v4.5+, latest stable), Vue 3 `<script setup>`, TypeScript
  strict, Pinia for state, Vitest + Vue Test Utils for tests.
- **UI framework:** Nuxt UI v4 (`@nuxt/ui`) for both the editor chrome (inputs,
  buttons, selects, modals, color pickers, etc.) AND as the primary building
  blocks in the visual builder (UPageHero, UPageSection, UButton, etc.). Styling
  via Tailwind CSS v4 (ships with Nuxt UI). Use `app.config.ts` for theme
  customization.
- **Building blocks:** The Component Registry wraps real Nuxt UI page-building
  components (UPageHero, UPageSection, UPageColumns, UPageGrid, UPageCTA,
  UPageFeature, UPageCard, UButton, UCard, USeparator) as the primary placeable
  blocks. A small set of custom gap-filler blocks (RichText, Image, Spacer)
  covers functionality Nuxt UI doesn't provide. The compiled output uses Nuxt UI
  components directly — no custom component layer.
- **Layout model:** section/block **flow grid**, NOT absolute free-drag
  positioning. This keeps generated Vue clean and responsive.
- **The editor is itself a Nuxt app.** The canvas renders the real Nuxt UI
  components via `<component :is>`, so the preview *is* production output.
- **Type everything.** The Registry and Page Document have shared TS types in
  `/types`. Never duplicate a type; import it.
- **No `any`.** Prefer discriminated unions for node types.
- **Keep tasks isolated.** Don't refactor files owned by a later task.
- **Commit message convention:** `feat(NN): short description` matching the task
  number. Work happens on a `feat/NN-*` branch merged via PR per the git steering
  doc — never commit directly to `main`.

## Directory layout the build should converge on

```
/app
  /components
    /blocks          # the user-placeable building blocks (Hero, Section, ...)
    /editor          # editor UI (canvas, tree, palette, property panel)
  /composables       # useRegistry, useEditor, useDragDrop, ...
  /stores            # pinia: editor store (page document + selection + history)
  /pages             # /editor route, plus compiled output target
/types               # registry.ts, page-document.ts, shared.ts
/registry            # registry definitions + index
/compiler            # json -> vue emitter (pure, framework-agnostic node)
/tests
/specs               # these files
```

> Note: Nuxt 4 uses an `app/` directory for app-specific code by default. Server
> code lives in `/server`. Types, registry, and compiler are top-level since they
> are shared or framework-agnostic.

Start with `01-project-setup.md`.
