# Task 04 — Render Engine

## Goal
Build the recursive renderer that turns a `PageDocument` tree into live Vue by
mapping each node to its real component via `<component :is>`. This renderer is
the heart of the WYSIWYG canvas — the preview *is* the production component.

## Context
Depends on the Registry (Task 02, for `componentMap`) and the Page Document
(Task 03). The renderer must work in two modes: a plain **preview** mode (no
editor chrome, used for export previews and the compiled output) and an
**editor** mode (adds selection outlines, hover states, empty-slot drop hints).
Keep the core node-rendering logic shared between both.

## Requirements

1. **`<RenderNode>`** in `/app/components/editor/RenderNode.vue`:
   - Props: `node: PageNode`, `editable?: boolean` (default `false`).
   - Look up the component via `componentMap[node.type]`. If missing, render a
     visible fallback box naming the unknown type (never crash).
   - Bind `v-bind="node.props"` to the component.
   - Render **default-slot children** by recursively rendering
     `node.children` inside the component's default slot.
   - Render **named slots**: for each key in `node.slots`, pass a slot of that
     name whose content is the recursively-rendered slot children. Use dynamic
     slot names (`<template #[slotName]>`).

2. **Editor affordances (only when `editable`)**:
   - Wrap each rendered node so clicking it calls `editorStore.select(node.id)`
     and stops propagation (so selecting a child doesn't also select the parent).
   - Apply a CSS outline/label to the currently selected node
     (`editorStore.selectedId === node.id`) and a subtler outline on hover.
   - For nodes that `acceptsChildren` or have declared slots but are currently
     **empty**, render a labeled empty-drop placeholder (e.g. "Drop content
     here") so users can target empty containers. Drag wiring comes in Task 07 —
     here just render the placeholder and the hooks/refs it will need.
   - Editor chrome must be visually non-destructive: it must not change layout
     enough to misrepresent the final output (use outline/ring utilities from
     Tailwind, not border that shifts box size; overlay labels absolutely).

3. **`<PageCanvas>`** in `/app/components/editor/PageCanvas.vue`:
   - Reads `editorStore.document.root` and renders it via `<RenderNode editable>`.
   - Clicking empty canvas space clears selection.
   - Provides the scroll container / device-frame wrapper (a plain centered
     column is fine; responsive device presets can come in Task 11).

4. **Isolation for the compiled path.** Ensure the same underlying render logic
   can run with `editable={false}` and zero editor-store dependency, so a
   read-only preview works without Pinia. If needed, split a pure
   `renderChildren` helper the compiler could conceptually mirror. (The compiler
   itself emits text, not Vue runtime — this is just to keep concerns clean.)

## Acceptance criteria
- `npm run typecheck` passes.
- Mounting `<PageCanvas>` with the seed document renders the real Hero/Text/Button
  components, nested correctly, including the Hero's `actions` named slot.
- Clicking a node selects it in the store; clicking a nested child selects the
  child, not its ancestors.
- An unknown node type renders the fallback box instead of throwing.
- A test in `/tests/render-node.test.ts` mounts a small document and asserts the
  expected component instances appear and that named-slot content renders in the
  right place.

## Out of scope
No palette, no property panel, no drag-drop behavior (only the empty-slot
placeholders + refs). No persistence.

## Commit
`feat(04): recursive render engine with editor affordances`

Work on branch `feat/04-render-engine`, merge to `main` via PR per git steering.
