# Implementation Plan: 01-project-setup

## Overview

Scaffold a Nuxt 4 + TypeScript workspace with strict typing, all required dependencies, directory skeleton, base shared types, tooling configuration, placeholder pages, and a smoke test. Each task incrementally builds the foundation so that all subsequent builder features have a verified, type-safe skeleton to work from.

## Tasks

- [x] 1. Initialize Nuxt 4 project and core configuration
  - [x] 1.1 Author the base Nuxt 4 project files manually (do NOT run `nuxi init` — the repo is non-empty and the wizard prompts interactively)
    - Create `package.json` with `nuxt` v4.5+ as a dependency, per the design doc
    - Create `nuxt.config.ts` and `tsconfig.json` per the design doc
    - Run `npm install` to generate the lockfile
    - _Requirements: 1.1, 1.5, 1.6_

  - [x] 1.2 Configure `nuxt.config.ts` with TypeScript strict mode and SSR
    - Set `typescript.strict: true` and `typescript.typeCheck: true`
    - Set `ssr: true`
    - Do NOT include `future.compatibilityVersion` set to `5`
    - Add `css: ['~/assets/css/main.css']`
    - _Requirements: 1.2, 1.3, 1.4_

  - [x] 1.3 Create `app/app.vue` with UApp wrapper and NuxtPage
    - Create `app/app.vue` with `<UApp>` wrapping `<NuxtPage />`
    - _Requirements: 6.3_

- [x] 2. Install and register dependencies
  - [x] 2.1 Install runtime dependencies and register modules
    - Install `@nuxt/ui` (^4) and add `'@nuxt/ui'` to `modules` in `nuxt.config.ts`
    - Install `@pinia/nuxt` and `pinia`, add `'@pinia/nuxt'` to `modules`
    - Install `zod` (^4)
    - Install `@formkit/drag-and-drop`
    - _Requirements: 2.1, 2.2, 2.4, 2.5_

  - [x] 2.2 Install dev dependencies and configure ESLint
    - Install `vitest`, `@vue/test-utils`, `@nuxt/test-utils`, `happy-dom`, `typescript`, and `vue-tsc` as devDependencies
    - Install `@nuxt/eslint` as devDependency, add `'@nuxt/eslint'` to `modules`
    - Create `eslint.config.mjs` importing and applying the flat config from `@nuxt/eslint`
    - _Requirements: 2.3, 2.6_

  - [x] 2.3 Install `fast-check` as a dev dependency for property-based testing
    - Install `fast-check` as a devDependency
    - _Requirements: 7.1 (testing infrastructure)_

  - [x] 2.4 Verify dependency resolution
    - Run `npm install` and ensure all dependencies resolve without unresolved peer-dependency errors
    - _Requirements: 2.7_

- [x] 3. Create directory skeleton and CSS asset
  - [x] 3.1 Create all required directories with `.gitkeep` placeholders
    - Create `app/components/blocks/`, `app/components/editor/`, `app/composables/`, `app/stores/`, `app/pages/`
    - Create `types/`, `registry/`, `compiler/`, `tests/`, `server/`
    - Place `.gitkeep` in each empty directory
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [x] 3.2 Create `app/assets/css/main.css` with Tailwind and Nuxt UI imports
    - Create the file with `@import "tailwindcss";` and `@import "@nuxt/ui";`
    - _Requirements: 9.3 (theme application requires CSS setup)_

- [x] 4. Define base shared types
  - [x] 4.1 Create `types/shared.ts` with PropType, PropSchema, NodeId, and makeNodeId
    - Export `PropType` as the union `'string' | 'text' | 'number' | 'boolean' | 'enum' | 'color' | 'url' | 'image'`
    - Export `PropSchema` discriminated union with all variants (StringPropSchema, TextPropSchema, NumberPropSchema with min/max/step, BooleanPropSchema, EnumPropSchema with `options: [string, ...string[]]`, ColorPropSchema, UrlPropSchema, ImagePropSchema)
    - Export `NodeId` branded string type using unique symbol intersection
    - Export `makeNodeId()` function returning `crypto.randomUUID() as NodeId`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 4.2 Write property test for makeNodeId format validity
    - **Property 1: makeNodeId format validity**
    - **Validates: Requirements 4.4, 7.3**
    - Create `/tests/makeNodeId.property.test.ts`
    - Use `fast-check` with minimum 100 iterations
    - Assert each call to `makeNodeId()` matches UUID v4 regex pattern `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`

  - [x] 4.3 Write property test for makeNodeId uniqueness
    - **Property 2: makeNodeId uniqueness**
    - **Validates: Requirements 4.4, 7.4**
    - In `/tests/makeNodeId.property.test.ts`, add property test generating 100+ calls
    - Collect results in a Set and assert Set size equals call count

- [x] 5. Configure package scripts and Vitest
  - [x] 5.1 Add all required npm scripts to `package.json`
    - `dev`: `nuxi dev`
    - `build`: `nuxi build`
    - `generate`: `nuxi generate`
    - `lint`: `eslint .`
    - `lint:fix`: `eslint . --fix`
    - `typecheck`: `nuxt typecheck`
    - `test`: `vitest run`
    - `test:watch`: `vitest`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8_

  - [x] 5.2 Create `vitest.config.ts` with Nuxt environment
    - Use `defineVitestConfig` from `@nuxt/test-utils/config`
    - Set `test.environment` to `'nuxt'`
    - _Requirements: 8.1, 8.2, 8.3_

- [x] 6. Checkpoint - Verify tooling configuration
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Create placeholder pages and theme configuration
  - [x] 7.1 Create `app/pages/index.vue` with UButton navigation
    - Render a `UButton` with `to="/editor"` prop for client-side routing
    - Center the button on screen using Tailwind utilities
    - _Requirements: 6.1, 6.3_

  - [x] 7.2 Create `app/pages/editor.vue` stub page
    - Render the text "Editor coming soon" in a visible DOM element
    - _Requirements: 6.2, 6.4_

  - [x] 7.3 Create `app/app.config.ts` with Nuxt UI theme colors
    - Set `ui.colors.primary` to `'indigo'`
    - Set `ui.colors.neutral` to `'slate'`
    - _Requirements: 9.1, 9.2, 9.3_

- [x] 8. Create smoke test
  - [x] 8.1 Create `/tests/smoke.test.ts`
    - Import `makeNodeId` from `types/shared` module
    - Assert `makeNodeId()` returns a string matching UUID v4 format (36 chars, correct pattern)
    - Assert two successive calls return different values
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [x] 9. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests (smoke test) validate specific examples and edge cases
- The design specifies TypeScript throughout; all implementation uses TypeScript/Vue
- `fast-check` is the PBT library for property-based tests with minimum 100 iterations

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3"] },
    { "id": 2, "tasks": ["2.1", "2.2", "2.3", "3.1", "3.2"] },
    { "id": 3, "tasks": ["2.4"] },
    { "id": 4, "tasks": ["4.1", "5.1", "5.2"] },
    { "id": 5, "tasks": ["4.2", "4.3", "7.1", "7.2", "7.3", "8.1"] }
  ]
}
```
