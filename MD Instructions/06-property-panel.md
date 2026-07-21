# Task 06 — Property Panel (auto-generated from registry)

## Goal
Generate the property-editing controls for the selected node **automatically** from
its registry `props` schema. No per-component hand-written forms — the schema
drives the UI. Editing a control updates the store, which live-updates the canvas.

## Context
Depends on the Registry `PropSchema` types (Task 02), the store's `updateProps`
(Task 03), and the Inspector slot (Task 05). This is the pattern that makes adding
a new block cheap: declare its props once and both the canvas and its editor UI
come for free.

## Requirements

1. **Control mapping.** For each `PropType`, render an appropriate Nuxt UI control
   in `/app/components/editor/controls/`:
   | PropType | Nuxt UI Control |
   |----------|-----------------|
   | `string` | `<UInput>` — single-line text input |
   | `text`   | `<UTextarea>` — multiline textarea |
   | `number` | `<UInputNumber>` — number input honoring `min`/`max`/`step` |
   | `boolean`| `<USwitch>` — toggle switch |
   | `enum`   | `<USelect>` — select over `options` (or `<URadioGroup>` for ≤4 options) |
   | `color`  | `<UColorPicker>` — color picker with hex value |
   | `url`    | `<UInput>` — text input with URL icon and light validation |
   | `image`  | `<UInput>` — URL input + a `<UButton>` "upload/pick" affordance stub |

   Each control is a small controlled component: `props: { schema, modelValue }`,
   emits `update:modelValue`. Keep them dumb and reusable — they wrap the Nuxt UI
   component with the schema-specific configuration.

2. **`<PropertyPanel>`** in `/app/components/editor/PropertyPanel.vue`:
   - Given the selected node, look up its registry entry and iterate its `props`
     in a stable declared order.
   - For each prop, render its label (from `PropSchema.label` or a humanized key)
     and the mapped control, seeded with the node's current value (falling back to
     the schema default).
   - On change, call `editorStore.updateProps(node.id, { [key]: value })`.
   - Debounce text inputs lightly (~150ms) so typing stays smooth but the canvas
     still updates live.

3. **Validation feedback.** If a value fails its schema (e.g. number out of range,
   malformed URL), show an inline error using Nuxt UI's built-in form error
   states (`:error` prop on inputs). Don't write the invalid value to the store.
   Reuse the prop-level validation from Task 03 where possible rather than
   re-implementing.

4. **Slot into the Inspector** (Task 05): when a node is selected, the Inspector
   renders `<PropertyPanel>` for it. Ensure switching selection resets control
   state to the newly selected node's values (no stale inputs).

5. **Extensibility hook.** Allow a registry entry to optionally specify a control
   override per prop (e.g. `controls?: Record<string, string>` naming a custom
   control component) so future rich props (icon picker, link picker) can opt out
   of the default mapping. Default behavior when absent is the type-based mapping
   above.

## Acceptance criteria
- `npm run typecheck` and `npm run lint` pass.
- Selecting a `Hero` shows text/textarea/enum/color controls matching its props;
  editing "heading" updates the canvas live.
- Editing an `enum` prop swaps the rendered variant; editing a `color` updates
  background live.
- Out-of-range/invalid values are rejected with an inline message and don't
  corrupt the document.
- Switching selection updates all controls to the new node's values.
- Component tests cover: control rendering per type, store update on change, and
  invalid-value rejection.

## Out of scope
No drag-drop (Task 07). No real image upload backend — the image control's
upload button is a stub. No page-meta editing beyond what Task 05 added.

## Commit
`feat(06): schema-driven auto-generated property panel with Nuxt UI controls`
