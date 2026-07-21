# Task 10 — Claude Code Handoff

## Goal
Define the **AI compilation path**: the exact payload and prompt format that lets
Claude Code turn a Page Document into Nuxt pages/components when the work needs
judgment the deterministic compiler (Task 09) can't provide — responsive
refinement, extracting repeated blocks into reusable components, wiring data
fetching, or filling logic the editor doesn't model.

## Context
Finalizes the `buildHandoffPayload` function stubbed in Task 08. The Page Document
is deliberately compact and unambiguous, which makes it a far better input for an
LLM than raw HTML. This task produces (a) the payload builder, (b) a stable prompt
template, and (c) a written guide so a human (or an agent) can run the handoff.

## Requirements

1. **Handoff payload builder** in `/compiler/handoff.ts`:
   ```ts
   function buildHandoffPayload(doc: PageDocument, registry: Registry): HandoffPayload
   interface HandoffPayload {
     pageDocument: PageDocument;         // the tree, verbatim
     registryDigest: RegistryDigest;     // compact: per type -> props (name+type+default) + slots + acceptsChildren
     conventions: string;                // project conventions block (below)
     deterministicOutput?: string;       // optional: the Task 09 .vue, as a baseline to improve on
   }
   ```
   - `registryDigest` must be small: strip icons/labels, keep only what the model
     needs to emit correct components. Stable ordering.
   - Provide `serializeHandoff(payload): string` producing a single
     copy-pasteable block (fenced JSON + prose conventions) — this is what the
     Task 08 "Copy for Claude Code" button emits.

2. **Prompt template** in `/specs/prompts/compile-with-claude-code.md` (created by
   this task). It should instruct Claude Code to:
   - Treat the `pageDocument` as the source of truth for structure and content.
   - Use the `registryDigest` to map each node `type` to the real component in
     `~/components/blocks`, binding props with correct types.
   - Emit idiomatic Nuxt 4 `<script setup lang="ts">` SFCs into
     `/app/pages/<page>.vue` (nested routes if `page` has slashes).
   - **Go beyond transcription only where warranted:** extract a subtree that
     repeats across the page into a local component; add responsive behavior;
     wire `useAsyncData`/`useFetch` where a node's props reference dynamic data;
     add `useSeoMeta` from `doc.meta`.
   - Preserve fidelity: the compiled page must render equivalently to the editor
     preview unless an improvement is explicitly requested.
   - Not invent components outside the registry unless asked; if a node can't be
     represented, flag it rather than silently dropping it.
   - Output a short changelog of any judgment calls it made beyond a 1:1 compile.

3. **Two documented modes** in the guide:
   - **Faithful mode** — behave like Task 09 (use it as a checker; the AI output
     should match the deterministic output for expressible pages).
   - **Enhance mode** — start from the deterministic `.vue` and improve it
     (responsiveness, extraction, data wiring), listing changes.

4. **Round-trip note.** Document clearly (in the guide) that once Claude Code
   hand-edits the generated `.vue`, that file is no longer round-trippable back
   into the editor — the Page Document remains the editable source, generated Vue
   is downstream. Mirror the Figma-Make caveat: keep the JSON as the source of
   truth for anything you'll re-edit visually.

5. **Consistency check.** Provide a script or test that runs the deterministic
   compiler and asserts the handoff payload's `pageDocument` matches the input and
   the digest covers every type used in the document (so the model never lacks a
   mapping for a node it must emit).

## Acceptance criteria
- `npm run typecheck` passes; `handoff.ts` is pure (no Vue/Pinia/browser).
- `buildHandoffPayload(seed, registry)` yields a digest covering exactly the types
  used, with props/slots present and no UI-only fields.
- `serializeHandoff` output is a single self-contained block a person can paste
  into Claude Code.
- The Task 08 "Copy for Claude Code" button now emits this payload.
- `/specs/prompts/compile-with-claude-code.md` exists and is complete.
- A test asserts digest-covers-all-used-types and payload-document-equals-input.

## Out of scope
No live API calls to Claude from the app (that's a separate feature — could use
the in-artifact Anthropic API later). This task defines the *format and prompt*,
run manually via copy-paste into Claude Code.

## Commit
`feat(10): claude code handoff payload, prompt template, and guide`

Work on branch `feat/10-claude-code-handoff`, merge to `main` via PR per git steering.
