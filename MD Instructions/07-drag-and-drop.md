# Task 07 — Drag & Drop

## Goal
Add drag-and-drop: drag blocks from the palette onto the canvas to insert them at
a precise position, and drag existing nodes (on the canvas and in the layer tree)
to reorder and reparent them. All drops go through the store's validated
`insertNode` / `moveNode`, so illegal drops are impossible.

## Context
Depends on the render engine's empty-slot placeholders and node refs (Task 04),
the palette (Task 05), and the store's move/insert guards (Task 03). Use
`@formkit/drag-and-drop` (installed in Task 01). It provides a pointer-based
approach that works on both mouse and touch.

## Requirements

0. **De-risking spike (do this first).** Before wiring the full editor, build a
   minimal isolated proof-of-concept that demonstrates palette → nested
   named-slot drop (a Button into a Hero's `actions` slot) using
   `@formkit/drag-and-drop`. Prove the library can express:
   - Cross-container drops (palette → canvas container)
   - Nested tree drops with named-slot targets
   - Index computation within a target
   If the library cannot cleanly handle nested-tree drops with named-slot targets,
   fall back to **custom pointer-event handling** for the canvas while keeping
   `@formkit/drag-and-drop` for flat lists (palette items, layer tree reorder).
   Document the decision in AI-MAP.md's Decisions Log.

1. **Drop targets & positioning.** A drop can land:
   - into a container node's default slot (between existing children — show an
     insertion line indicating index), or into a named slot,
   - into an **empty** container/slot (the placeholder from Task 04),
   - re-order among siblings.
   Compute target parent, slot, and index from pointer position. Show a clear
   **insertion indicator** (a line between siblings, or a highlighted drop zone
   for empty containers).

2. **Palette → canvas.** Dragging a palette item creates a *new* node via
   `defaultPropsFor(type)` and inserts it at the drop target with
   `editorStore.insertNode(parentId, node, slot, index)`. Reject (visually, e.g.
   a "no-drop" cursor) when hovering a target that can't accept that node.

3. **Canvas node → canvas.** Dragging an existing node calls
   `editorStore.moveNode(id, newParentId, slot, index)`. The store already guards
   cycles and illegal parents (Task 03) — surface rejected drops in the UI rather
   than letting them apply.

4. **Layer tree drag.** The `LayerTree` (Task 05) must support the same
   reorder/reparent via drag, staying in sync with the canvas. Dragging in the
   tree and on the canvas should feel like two views of one operation.

5. **Robustness:**
   - Auto-scroll the canvas when dragging near its top/bottom edge.
   - Cancel cleanly on `Escape` and on drop outside any valid target (no partial
     mutation).
   - Don't start a drag from within a focused text input.
   - Keep selection correct after a move (the moved node stays selected).

6. **Accessibility fallback.** Provide keyboard-based move as a minimum: with a
   node selected, expose "move up / move down / outdent / indent" actions
   (`<UButton>` icon buttons in the tree row and/or keyboard shortcuts) that call
   the same store actions, so the editor is usable without a pointer.

## Acceptance criteria
- `npm run typecheck` and `npm run lint` pass.
- Dragging a `Button` from the palette into the Hero's `actions` slot inserts it
  there; dragging a `Section`-only child into a non-container shows no-drop.
- Reordering siblings on the canvas updates the document and the tree together.
- Attempting to drop a node into its own descendant is rejected with no mutation.
- Keyboard move actions reorder/reparent equivalently.
- Tests cover: index computation from a mocked pointer position, a valid move
  mutating the store, and a cycle-drop being rejected.

## Out of scope
No multi-select drag. No copy/paste (can be added in Task 11). No absolute
positioning — flow/grid only.

## Commit
`feat(07): drag-and-drop insert, reorder, reparent with @formkit/drag-and-drop`

Work on branch `feat/07-drag-and-drop`, merge to `main` via PR per git steering.
