# Task 08 — Persistence (save / load / export)

## Goal
Let users save, load, and export Page Documents. The exported JSON is the artifact
that flows to the compiler (Task 09) and to Claude Code (Task 10), so its format
and stability matter.

## Context
Depends on the store (Task 03) and the editor shell's top-bar stubs (Task 05).
Keep persistence pluggable: a simple server-backed store for dev, but structured
so a real database could replace it later without touching the editor UI.

## Requirements

1. **Storage abstraction** in `/app/composables/usePersistence.ts` with an
   interface:
   ```ts
   interface PageStore {
     list(): Promise<PageSummary[]>;         // defined in /types/page-document.ts
     load(id: string): Promise<PageDocument>;
     save(doc: PageDocument): Promise<{ id: string }>;
     remove(id: string): Promise<void>;
   }
   ```
   `PageSummary` must be defined in `/types/page-document.ts`:
   ```ts
   interface PageSummary {
     id: string;
     title: string;
     page: string;
     updatedAt: string; // ISO 8601
   }
   ```
   Provide one concrete implementation for dev.

2. **Dev backend** using **Nuxt server routes** (`/server/api/pages/...`) that
   read/write JSON files under a gitignored `/.data/pages/` directory (or SQLite
   via `better-sqlite3` if you prefer — either is fine, but keep it
   dependency-light and document the choice). Endpoints: `GET /api/pages`,
   `GET /api/pages/:id`, `PUT /api/pages/:id`, `DELETE /api/pages/:id`.
   - **Validate on save** with `pageDocumentSchema` + `validateAgainstRegistry`
     (Task 03); reject invalid documents with a 422 and the error list.

3. **Top-bar wiring** (replace the Task 05 stubs):
   - **Save** (`<UButton>`) persists the current document; show saved/dirty state
     with a badge or icon change.
   - **Open** shows a list of saved pages (`list()`) in a `<UModal>` with a
     selectable list, loads the chosen one into the store via `replaceDocument`.
   - **New** creates a blank document (single empty `Section` root) after a
     confirm via `<UModal>` if there are unsaved changes.

4. **Export / Import**:
   - **Export JSON**: `<UButton>` downloads the current `PageDocument` as a
     `.json` file. Pretty-printed, stable key order.
   - **Import JSON**: `<UButton>` + file input to load a `.json` file, validate
     it, and either load it or show validation errors in a toast (`useToast()`).
     Reject unknown `version` values with a clear message.
   - **Copy for Claude Code**: a `<UButton>` that copies to clipboard a bundle
     containing the Page Document **and** a compact description of the registry
     (types + their props) — the exact payload Task 10 defines. Show a toast on
     success. (Implement the button here; the precise payload format is specified
     in Task 10, so coordinate: expose a `buildHandoffPayload(doc, registry)`
     function that Task 10 will finalize.)

5. **Autosave (light):** debounce-persist to the dev backend or to an in-memory
   draft every few seconds when the document is dirty, so work isn't lost on
   reload. Make it non-blocking and cancellable.

## Acceptance criteria
- `npm run typecheck` and `npm run lint` pass.
- Save then reload the page → document restored.
- Export produces a `.json` that re-imports to an identical document (round-trip
  deep-equal).
- Importing an invalid or unknown-`version` document shows errors and does not
  corrupt the current document.
- Server route rejects an invalid document with 422 + error list.
- **Registry import rule:** Server routes import ONLY from `/registry/entries.ts`
  (not `/registry/index.ts`) so no `.vue` files are pulled into Nitro.
- Tests cover: round-trip export/import equality, and a 422 on invalid save.

## Out of scope
No auth/multi-user. No versioning/history of saves (undo/redo is Task 11). The
final handoff payload format is finalized in Task 10.

## Commit
`feat(08): persistence — save/load/export/import + dev server backend`

Work on branch `feat/08-persistence`, merge to `main` via PR per git steering.
