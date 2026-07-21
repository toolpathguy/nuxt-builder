# Task 03 — Page Document Schema & Store

## Goal
Define the **Page Document**: the serialized JSON tree of component instances that
the editor edits and the compiler consumes. Add runtime validation and a Pinia
store that holds the current document plus selection.

## Context
This is the central data model. It references registry `type` strings (Task 02)
but must remain a plain, serializable structure — no Vue component references, no
functions, no class instances. Anything in here must survive `JSON.stringify` →
`JSON.parse` unchanged. Read `00-START-HERE.md`, `/types/registry.ts`, and
`/types/shared.ts` first.

## Requirements

1. **Types** in `/types/page-document.ts`:
   ```ts
   interface PageNode {
     id: NodeId;                          // from shared.ts
     type: string;                        // must exist in registry
     props: Record<string, unknown>;      // validated against registry propschema
     children?: PageNode[];               // default-slot children
     slots?: Record<string, PageNode[]>;  // named-slot children
   }
   interface PageDocument {
     version: 1;                          // bump on breaking schema changes
     page: string;                        // route/slug, e.g. "home"
     title?: string;
     root: PageNode;                      // usually a Section
     meta?: Record<string, unknown>;      // description, ogImage, etc.
   }
   ```

2. **Zod schemas** in the same file (or `/types/page-document.schema.ts`):
   - `pageNodeSchema` (recursive) and `pageDocumentSchema`.
   - A **semantic validator** `validateAgainstRegistry(doc, registry)` that goes
     beyond shape checks: every node `type` exists; every prop key is declared in
     that type's registry entry; prop values match their `PropType`; children only
     present when `acceptsChildren`; slot keys only present when declared in
     `slots`. Return a list of typed errors `{ nodeId, path, message }`, not a
     throw, so the UI can surface them.

3. **Editor Pinia store** in `/app/stores/editor.ts`:
   - State: `document: PageDocument`, `selectedId: NodeId | null`.
   - Getters: `selectedNode`, `findNode(id)`, `findParent(id)`.
   - Actions (all immutable-style, replacing nodes rather than mutating in place
     where practical, to keep history simple in Task 11):
     - `select(id)`, `clearSelection()`
     - `updateProps(id, partialProps)`
     - `insertNode(parentId, node, slot?, index?)`
     - `moveNode(id, newParentId, slot?, index?)`
     - `removeNode(id)`
     - `replaceDocument(doc)`
   - Every mutating action must keep the document valid; reject moves that would
     create a cycle or drop children into a node that can't accept them.

4. **A tree-walk utility** in `/compiler/tree.ts` (shared, pure):
   `walk(node, visitor)`, `mapNodes`, `findById`, `findParentOf`. The compiler
   (Task 09) will reuse these, so keep them free of Vue/Pinia imports.

5. **A seed document** in `/app/stores/seed.ts`: a small valid page
   (Section → Hero + Text + Button) used as the store's initial state and by
   tests.

## Acceptance criteria
- `npm run typecheck` passes.
- Tests in `/tests/page-document.test.ts`:
  - The seed document passes both `pageDocumentSchema` and
    `validateAgainstRegistry`.
  - A doc with an unknown `type` and one with an undeclared prop each produce the
    expected validation errors.
  - `insertNode`, `moveNode`, `removeNode` produce still-valid documents.
  - `moveNode` refuses to parent a node under its own descendant (cycle guard).
- The store round-trips through `JSON.parse(JSON.stringify(document))` with deep
  equality.

## Out of scope
No UI. This is pure data + validation + store logic.

## Commit
`feat(03): page document schema, registry validation, editor store`
