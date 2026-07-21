# Task 11 — Testing & Polish

## Goal
Harden the editor into something usable day-to-day: undo/redo history, responsive
device previews, accessibility, seed/template content, and a fuller test pass.

## Context
Depends on everything before it. Treat each item below as an independent
sub-task; they can be committed separately. Don't destabilize earlier tasks —
extend, don't rewrite.

## Requirements

1. **Undo / redo** in the editor store (Task 03):
   - Maintain past/future stacks of `PageDocument` snapshots (structured clone).
   - Every mutating action pushes to history; `undo()`/`redo()` restore snapshots.
   - Coalesce rapid prop edits (e.g. typing in a text field) into a single history
     entry rather than one per keystroke.
   - Shortcuts: `Cmd/Ctrl+Z` undo, `Cmd/Ctrl+Shift+Z` (and `Ctrl+Y`) redo, not
     while a text input is focused unless it makes sense.
   - Cap history depth to a sane number to bound memory.

2. **Responsive device previews** on the canvas:
   - Presets: desktop / tablet / mobile widths, plus a "fit" option.
   - Use a `<USelect>` or segmented `<UButtonGroup>` in the top bar to switch.
   - Switching preset constrains the canvas frame width; the real components must
     respond (this also validates that block components are actually responsive —
     fix any that aren't).

3. **Accessibility pass:**
   - Editor chrome: keyboard-navigable palette, tree, and controls; visible focus
     states; ARIA roles for the tree (`tree`/`treeitem`) and toolbar.
   - Ensure the keyboard move actions (Task 07) and delete/undo shortcuts are
     discoverable (tooltips via Nuxt UI's `<UTooltip>` / a shortcuts help panel).
   - Generated/preview output: block components emit semantic HTML (headings use
     real `<h1..h4>` per `level`, buttons/links are real elements, images have
     `alt`).

4. **Templates / seed content:**
   - Ship 2–3 starter templates (e.g. "Landing", "About", "Pricing") as
     `PageDocument` JSON fixtures selectable from "New" (show them in the new-page
     `<UModal>`).
   - Keep them valid against `validateAgainstRegistry`.

5. **Copy / paste / duplicate:**
   - Duplicate a selected node (deep clone with fresh `NodeId`s, inserted as a
     sibling).
   - Copy/paste a node subtree within the editor (in-memory clipboard is fine).
   - Wire to `Cmd/Ctrl+D` (duplicate) and `Cmd/Ctrl+C` / `Cmd/Ctrl+V`.

6. **Test pass:**
   - Unit: store actions + history, validation, compiler golden files, handoff
     digest.
   - Component: palette insert, selection sync, property editing, drag insert +
     reorder, undo/redo.
   - One end-to-end-ish flow test: build a small page via the store API, export
     JSON, run the compiler, assert the emitted `.vue` matches a snapshot.
   - Wire `npm run test` to run all of it; ensure `typecheck` and `lint` are clean.

7. **README** at repo root: what the project is, how to run the editor, how the
   Page Document / registry / compiler fit together, and how to run both compile
   paths (deterministic CLI and Claude Code handoff). Link back to `/specs`.
   Note the stack: Nuxt 4, Nuxt UI v4, Tailwind CSS v4, Pinia,
   @formkit/drag-and-drop, Zod.

## Acceptance criteria
- Undo/redo works across insert, move, delete, and prop edits, with coalesced
  typing.
- Device presets constrain the canvas and components reflow correctly.
- Keyboard-only operation can select, move, edit, and delete nodes.
- Templates load as valid documents.
- Duplicate/copy/paste produce valid documents with unique IDs.
- Full `npm run test`, `npm run typecheck`, `npm run lint` all pass.
- Root README is complete and accurate.

## Out of scope
Auth, multi-user/real-time collaboration, a hosted deployment, and a real image
asset backend — note these in the README as future work.

## Commit
`feat(11): undo/redo, responsive previews, a11y, templates, test pass, readme`

Work on branch `feat/11-testing-and-polish`, merge to `main` via PR per git steering.
