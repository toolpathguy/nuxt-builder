# Implementation Plan: Component Registry

## Overview

Build the Component Registry — the single source of truth for all placeable building blocks in the Nuxt Visual Builder. The implementation follows a purity split architecture: a pure-data entries module (no `.vue` imports) for tooling compatibility, a Vue-aware registry module that combines entries with component references, Zod validation in dev mode, 13 block components (10 Nuxt UI wrappers + 3 custom gap-fillers), and a `useRegistry()` composable for Vue access.

## Tasks

- [ ] 1. Set up type definitions and validation schema
  - [ ] 1.1 Create RegistryEntry interface and Registry type in `/types/registry.ts`
    - Define `Category` type as union of `'layout' | 'content' | 'media' | 'form'`
    - Define `RegistryEntry` interface with all fields: type, label, category, icon, props, slots, acceptsChildren, allowedChildren, allowedParents, compileAs
    - Define `Registry` type as `Record<string, RegistryEntry>`
    - Import `PropSchema` from `/types/shared.ts`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

  - [ ] 1.2 Create Zod validation module at `/registry/validation.ts`
    - Define `propSchemaZod` as a discriminated union covering all 8 PropSchema types (string, text, number, boolean, enum, color, url, image)
    - Define `registryEntryZod` schema with all field constraints (PascalCase regex, max lengths, valid categories)
    - Add `.superRefine` for cross-field constraints: allowedChildren requires acceptsChildren:true, "default" slot conflicts with acceptsChildren:false
    - Implement `validateRegistry()` function that iterates entries, validates each against the schema, and throws descriptive errors including entry type/key
    - Verify type field matches its registry key
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_

- [ ] 2. Implement registry entries (pure-data module)
  - [ ] 2.1 Create `/registry/entries.ts` with all 13 registry entries
    - Export `entries` as a `Registry` object with zero `.vue` imports
    - Include PageHero entry: category layout, compileAs UPageHero, props (title/string, description/text, headline/string, orientation/enum), acceptsChildren false
    - Include PageSection entry: category layout, compileAs UPageSection, props (title/string, description/text, headline/string, orientation/enum, reverse/boolean), acceptsChildren true
    - Include PageColumns entry: category layout, compileAs UPageColumns, empty props, acceptsChildren true
    - Include PageGrid entry: category layout, compileAs UPageGrid, empty props, acceptsChildren true
    - Include PageCTA entry: category content, compileAs UPageCTA, props (title/string, description/text, headline/string), acceptsChildren false
    - Include PageFeature entry: category content, compileAs UPageFeature, props (title/string, description/text, icon/string, orientation/enum), acceptsChildren false
    - Include PageCard entry: category content, compileAs UPageCard, props (title/string, description/text, to/url), acceptsChildren false
    - Include Card entry: category content, compileAs UCard, empty props, acceptsChildren true
    - Include Button entry: category content, compileAs UButton, props (label/string, to/url, color/enum, variant/enum, size/enum), acceptsChildren false
    - Include Separator entry: category layout, compileAs USeparator, props (orientation/enum, label/string), acceptsChildren false
    - Include RichText entry: category content, no compileAs, props (body/text, align/enum), acceptsChildren false
    - Include Image entry: category media, no compileAs, props (src/image, alt/string, rounded/boolean), acceptsChildren false
    - Include Spacer entry: category layout, no compileAs, props (size/enum), acceptsChildren false
    - All entries must include icon field with appropriate Lucide icon names
    - All prop defaults must match the values specified in requirements 4–12
    - _Requirements: 3.1, 3.2, 3.3, 3.6, 4.1–4.7, 5.1–5.8, 6.1–6.8, 7.1–7.5, 8.1–8.6, 9.1–9.10, 10.1–10.7, 11.1–11.4, 12.1–12.19, 13.1, 13.2_

- [ ] 3. Implement Nuxt UI block components
  - [ ] 3.1 Create BlockPageHero.vue in `/app/components/blocks/`
    - Thin wrapper passing title, description, headline, orientation props to UPageHero
    - Define props with `withDefaults` using defaults from registry entry
    - _Requirements: 4.8, 4.9, 3.4, 3.5_

  - [ ] 3.2 Create BlockPageSection.vue in `/app/components/blocks/`
    - Wrapper passing title, description, headline, orientation, reverse props to UPageSection
    - Include default `<slot>` for child content
    - _Requirements: 5.9, 5.10, 3.4, 3.5_

  - [ ] 3.3 Create BlockPageColumns.vue and BlockPageGrid.vue in `/app/components/blocks/`
    - PageColumns: render UPageColumns with default slot for children
    - PageGrid: render UPageGrid with default slot for children
    - _Requirements: 6.9, 6.10, 3.4, 3.5_

  - [ ] 3.4 Create BlockPageCTA.vue in `/app/components/blocks/`
    - Wrapper passing title, description, headline props to UPageCTA
    - _Requirements: 7.7, 7.8, 3.4, 3.5_

  - [ ] 3.5 Create BlockPageFeature.vue in `/app/components/blocks/`
    - Wrapper passing title, description, icon, orientation props to UPageFeature
    - _Requirements: 8.8, 3.4, 3.5_

  - [ ] 3.6 Create BlockPageCard.vue and BlockCard.vue in `/app/components/blocks/`
    - PageCard: wrapper passing title, description, to props to UPageCard
    - Card: render UCard with default slot for children
    - _Requirements: 9.11, 9.12, 3.4, 3.5_

  - [ ] 3.7 Create BlockButton.vue in `/app/components/blocks/`
    - Wrapper passing label, to, color, variant, size props to UButton
    - _Requirements: 10.9, 3.4, 3.5_

  - [ ] 3.8 Create BlockSeparator.vue in `/app/components/blocks/`
    - Wrapper passing orientation and label props to USeparator
    - _Requirements: 11.6, 3.4, 3.5_

- [ ] 4. Implement custom gap-filler block components
  - [ ] 4.1 Create BlockRichText.vue in `/app/components/blocks/`
    - Render body prop as HTML content using `v-html` in a block-level container
    - Apply text alignment from align prop using Tailwind CSS v4 classes
    - Use `prose max-w-none` class for content styling
    - _Requirements: 12.1, 12.6, 12.20_

  - [ ] 4.2 Create BlockImage.vue in `/app/components/blocks/`
    - Render `<img>` element with src and alt props bound
    - Apply `max-w-full` for responsive sizing
    - Conditionally apply border-radius class when rounded prop is true
    - _Requirements: 12.7, 12.13, 12.14, 12.20_

  - [ ] 4.3 Create BlockSpacer.vue in `/app/components/blocks/`
    - Render empty block-level element with height varying by size prop
    - sm = shortest, md = medium, lg = tallest using Tailwind height classes
    - _Requirements: 12.15, 12.19, 12.20_

- [ ] 5. Checkpoint - Ensure entries and block components are complete
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Implement Vue-aware registry module and composable
  - [ ] 6.1 Create `/registry/index.ts` with registry, componentMap, and helper functions
    - Import entries from `./entries` and all 13 block components from `~/components/blocks/`
    - Add dev-time validation guard: `if (import.meta.dev) { validateRegistry(entries) }`
    - Export `registry` (re-export entries)
    - Export `componentMap` mapping all 13 type strings to their Vue component references
    - Implement and export `getEntry(type)` returning `RegistryEntry | undefined`
    - Implement and export `defaultPropsFor(type)` returning object with each prop's default value, or undefined for unknown types
    - Implement and export `entriesByCategory()` returning entries grouped by category
    - _Requirements: 13.4, 13.5, 13.6, 13.7, 13.8, 13.9, 2.1, 2.7_

  - [ ] 6.2 Create `/app/composables/useRegistry.ts`
    - Import registry, componentMap, getEntry, defaultPropsFor, entriesByCategory from `/registry/index.ts`
    - Export `useRegistry()` function returning all imported values
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_

- [ ] 7. Checkpoint - Ensure registry module loads and composable works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Write property-based tests
  - [ ]* 8.0 Install fast-check as a devDependency if not already present
    - Run `npm install -D fast-check`
    - Verify it resolves in Vitest test files

  - [ ]* 8.1 Write property test: Validator rejects invalid entries with identifying information
    - **Property 1: Validator rejects invalid entries with identifying information**
    - Use fast-check to generate RegistryEntry objects that violate various constraints
    - Assert that the Zod validator throws errors containing the entry's type or registry key
    - **Validates: Requirements 1.5, 2.2, 2.3, 2.4, 2.5, 2.8, 2.9**

  - [ ]* 8.2 Write property test: Valid entries pass validation without errors
    - **Property 2: Valid entries pass validation without errors**
    - Use fast-check to generate fully valid RegistryEntry objects
    - Assert that the Zod validator accepts them without throwing
    - **Validates: Requirements 2.6**

  - [ ]* 8.3 Write property test: Registry and componentMap bijection
    - **Property 3: Registry and componentMap bijection**
    - Assert that keys of registry and componentMap are identical sets
    - **Validates: Requirements 13.5, 15.1, 15.2, 15.6, 15.7**

  - [ ]* 8.4 Write property test: defaultPropsFor returns correct defaults for all entries
    - **Property 4: defaultPropsFor returns correct defaults for all entries**
    - For each registered entry, verify defaultPropsFor returns keys matching the entry's props record with correct default values
    - **Validates: Requirements 13.7, 15.3**

  - [ ]* 8.5 Write property test: entriesByCategory groups all entries correctly
    - **Property 5: entriesByCategory groups all entries correctly**
    - Verify each entry appears in its category group and nowhere else, and the union covers all entries
    - **Validates: Requirements 13.9**

  - [ ]* 8.6 Write property test: Non-existent type strings return undefined
    - **Property 6: Non-existent type strings return undefined**
    - Use fast-check to generate random strings not matching any registry key
    - Assert getEntry and defaultPropsFor return undefined without throwing
    - **Validates: Requirements 13.8, 14.7**

  - [ ]* 8.7 Write property test: Entries module produces serializable data
    - **Property 7: Entries module produces serializable data**
    - For each entry, verify JSON.parse(JSON.stringify(entry)) deep-equals the original
    - **Validates: Requirements 13.1**

  - [ ]* 8.8 Write property test: Nuxt UI blocks have valid compileAs and icon
    - **Property 8: Nuxt UI blocks have valid compileAs and icon**
    - For entries with compileAs defined, verify it starts with 'U' and icon is non-empty
    - **Validates: Requirements 3.2, 3.6, 15.8**

- [ ] 9. Write example-based unit tests
  - [ ]* 9.1 Write unit tests for registry consistency and validation
    - Verify componentMap and registry key sets are identical (report each mismatch)
    - Verify defaultPropsFor('PageHero') returns correct defaults
    - Verify Zod validator throws for entry with missing label
    - Verify `/registry/entries.ts` source has zero `.vue` import statements
    - Verify all Nuxt UI block entries have non-empty compileAs starting with 'U'
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5, 15.6, 15.7, 15.8_

  - [ ]* 9.2 Write unit tests for entries module purity
    - Verify entries.ts loads in a plain Node.js context without errors
    - Verify all entries are serializable (no function references)
    - _Requirements: 13.1, 13.2, 13.3_

- [ ] 10. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript throughout, matching the design document
- Block components use Vue 3 `<script setup>` with `withDefaults(defineProps<...>())`
- All styling in custom blocks uses Tailwind CSS v4 utility classes

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "2.1"] },
    { "id": 2, "tasks": ["3.1", "3.2", "3.3", "3.4", "3.5", "3.6", "3.7", "3.8", "4.1", "4.2", "4.3"] },
    { "id": 3, "tasks": ["6.1"] },
    { "id": 4, "tasks": ["6.2"] },
    { "id": 5, "tasks": ["8.1", "8.2", "8.3", "8.4", "8.5", "8.6", "8.7", "8.8", "9.1", "9.2"] }
  ]
}
```
