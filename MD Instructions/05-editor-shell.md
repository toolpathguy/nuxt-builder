# Task 05 — Editor Shell

## Goal
Assemble the full editor layout around the canvas: a left **palette** of available
blocks, the center **canvas**, a right **inspector** column (property panel comes
in Task 06 — leave a slot for it), and a **layer tree** showing the document
hierarchy. Wire selection so all panels stay in sync.

## Context
Depends on the render engine (Task 04) and the editor store (Task 03). This task
is about layout, navigation, and selection sync — not property editing or drag.
Replace the `/app/pages/editor.vue` stub from Task 01.

## Requirements

1. **Editor layout** in `/app/pages/editor.vue` (or a `<EditorShell>` component
   it renders): a three-column app shell — palette (left, ~240px), canvas
   (center, flexible), inspector (right, ~320px) — plus a top bar for document
   title and global actions (save/export buttons wired in Task 08; render them as
   disabled `<UButton>` stubs now). Use Tailwind utilities for the layout grid.
   Make it fill the viewport; canvas scrolls independently.

2. **Palette** in `/app/components/editor/BlockPalette.vue`:
   - Lists registry entries grouped by `category` (use `entriesByCategory()`).
   - Each item shows icon (Lucide via `<UIcon>`) + label and is keyboard-focusable.
   - Use `<UAccordion>` or simple collapsible groups for categories.
   - Clicking a palette item inserts a new node (with `defaultPropsFor(type)`)
     into the currently selected container — or the root if the selection can't
     accept children — then selects the new node. (Full drag-to-place is Task 07;
     click-to-insert is the baseline here.)

3. **Layer tree** in `/app/components/editor/LayerTree.vue`:
   - Renders the document as a collapsible tree (each node shows its `label`/type
     and a truncated hint like its `heading`/`text` prop if present).
   - Clicking a tree row selects that node (syncs with canvas selection).
   - The selected node is highlighted in the tree; selecting on the canvas scrolls
     the tree to and highlights the same node.
   - Include per-row actions: delete node (with `<UButton>` icon button), and
     select-parent. Guard against deleting the root.

4. **Inspector container** in `/app/components/editor/Inspector.vue`:
   - When a node is selected, show its type/label as a header and reserve a
     `<PropertyPanel>` slot/placeholder (Task 06 fills it).
   - When nothing is selected, show page-level fields (title, slug/`page`, meta
     description) bound to the store using `<UInput>` and `<UTextarea>`.

5. **Selection sync** must be bidirectional and single-source-of-truth via the
   store: canvas ↔ tree ↔ inspector all read/write `editorStore.selectedId`.

6. **Keyboard**: `Delete`/`Backspace` removes the selected node (not the root);
   `Escape` clears selection. Don't hijack these while a text input is focused.

## Acceptance criteria
- `npm run typecheck` and `npm run lint` pass.
- `/editor` shows palette, canvas, tree, and inspector with the seed document.
- Clicking a block in the palette inserts and selects it; it appears on the canvas
  and in the tree.
- Selecting a node anywhere highlights it everywhere.
- Deleting via tree action or keyboard removes it from canvas and tree; root is
  protected.
- A component test covers palette-insert and tree/canvas selection sync.

## Out of scope
No auto-generated property controls (Task 06). No drag-and-drop reordering
(Task 07). Save/export buttons are stubs (Task 08).

## Commit
`feat(05): editor shell — palette, canvas, layer tree, inspector, selection sync`
