# Requirements Document

## Introduction

Scaffold the Nuxt 4 + TypeScript workspace that all subsequent builder features depend on. This includes initializing the framework with strict TypeScript, installing all runtime and dev dependencies, creating the directory skeleton (Nuxt 4 `app/` convention), defining base shared types, configuring tooling (lint, test, typecheck), and providing placeholder pages and a smoke test to prove the foundation is operational. No builder features are implemented — only the clean, verified skeleton.

Reference: #[[file:MD Instructions/01-project-setup.md]]

## Glossary

- **Scaffold**: The process of initializing a new Nuxt 4 project with all required configuration, dependencies, and directory structure.
- **Nuxt_Config**: The `nuxt.config.ts` file that controls framework behavior including modules, TypeScript settings, and SSR mode.
- **App_Config**: The `app.config.ts` file used for Nuxt UI theming configuration (primary color, neutral palette).
- **Directory_Skeleton**: The set of folders required by the project architecture, created with `.gitkeep` placeholders where empty.
- **Shared_Types**: The TypeScript types in `/types/shared.ts` that define `PropType`, `PropSchema`, `NodeId`, and `makeNodeId()`.
- **PropType**: A string literal union representing the kinds of properties a component can expose: `'string' | 'text' | 'number' | 'boolean' | 'enum' | 'color' | 'url' | 'image'`.
- **PropSchema**: A discriminated union type keyed on the `type` field (a `PropType` value), where each variant carries fields specific to that prop kind.
- **NodeId**: A branded string type wrapping a UUID, used to uniquely identify nodes in the page document tree.
- **Smoke_Test**: A minimal Vitest test that imports `makeNodeId` and asserts it returns a non-empty string, proving the test pipeline works.
- **Vitest_Config**: The `vitest.config.ts` file configured via `defineVitestConfig` from `@nuxt/test-utils/config` with environment set to `'nuxt'`.
- **Package_Scripts**: The `scripts` section of `package.json` providing `dev`, `build`, `generate`, `lint`, `typecheck`, `test`, and `test:watch` commands.

## Requirements

### Requirement 1: Initialize Nuxt 4 Framework

**User Story:** As a developer, I want the project initialized as a Nuxt 4 application with strict TypeScript, so that all subsequent tasks build on a type-safe, SSR-capable foundation.

#### Acceptance Criteria

1. THE Scaffold SHALL initialize a Nuxt 4 project (v4.5 or later) in the repository root with a `nuxt.config.ts` file and a `tsconfig.json` file present.
2. THE Nuxt_Config SHALL set `typescript.strict` to `true` and `typescript.typeCheck` to `true`.
3. THE Nuxt_Config SHALL set `ssr` to `true`.
4. THE Nuxt_Config SHALL NOT include `future.compatibilityVersion` set to `5`, either by omitting the key or by setting it to a value less than `5`.
5. THE Scaffold SHALL always complete successfully without halting due to internal errors, and WHEN the scaffold is complete, THE project SHALL compile successfully via `npx nuxi build` with zero TypeScript errors.
6. THE Scaffold SHALL produce a valid `package.json` with Nuxt 4 listed as a dependency and a corresponding lockfile in the repository root.

### Requirement 2: Install and Register Dependencies

**User Story:** As a developer, I want all required runtime and development dependencies installed and registered, so that UI, state, validation, testing, drag-and-drop, and linting tools are available from the start.

#### Acceptance Criteria

1. THE Scaffold SHALL install `@nuxt/ui` with a version constraint of `^4` in `package.json` `dependencies` and add `'@nuxt/ui'` to the `modules` array in `nuxt.config.ts`.
2. THE Scaffold SHALL install `@pinia/nuxt` and `pinia` in `package.json` `dependencies` and add `'@pinia/nuxt'` to the `modules` array in `nuxt.config.ts`.
3. THE Scaffold SHALL install `vitest`, `@vue/test-utils`, `@nuxt/test-utils`, and `happy-dom` in `package.json` `devDependencies`.
4. THE Scaffold SHALL install `zod` with a version constraint of `^4` in `package.json` `dependencies`.
5. THE Scaffold SHALL install `@formkit/drag-and-drop` in `package.json` `dependencies`.
6. THE Scaffold SHALL install `@nuxt/eslint` in `package.json` `devDependencies`, add `'@nuxt/eslint'` to the `modules` array in `nuxt.config.ts`, and generate an `eslint.config.mjs` file that imports and applies the flat config provided by `@nuxt/eslint`.
7. WHEN the scaffold has completed dependency setup from AC1–AC6 and `npm install` is executed in the project root, THE Scaffold SHALL resolve all dependencies without unresolved peer-dependency errors.

### Requirement 3: Create Directory Skeleton

**User Story:** As a developer, I want the full directory structure created upfront, so that all tasks have a consistent, predictable place for their files.

#### Acceptance Criteria

1. THE Scaffold SHALL create the following directories relative to the project root: `app/components/blocks`, `app/components/editor`, `app/composables`, `app/stores`, `app/pages`.
2. THE Scaffold SHALL create the following directories relative to the project root: `types`, `registry`, `compiler`, `tests`, `specs`, `server`.
3. IF any directory listed in criteria 1 or 2 already exists, THEN THE Scaffold SHALL skip that directory without error and without modifying its existing contents.
4. WHEN a directory in the skeleton contains no files after creation, THE Scaffold SHALL place a `.gitkeep` file in that directory so that version control tracks the empty folder.
5. IF directory creation fails due to a filesystem error, THEN THE Scaffold SHALL report an error message indicating which directory could not be created and halt further scaffold execution.

### Requirement 4: Define Base Shared Types

**User Story:** As a developer, I want base shared types defined in `/types/shared.ts`, so that the registry, page document, and editor have a common type vocabulary from day one.

#### Acceptance Criteria

1. THE Shared_Types SHALL export a `PropType` type defined as the union `'string' | 'text' | 'number' | 'boolean' | 'enum' | 'color' | 'url' | 'image'`.
2. THE Shared_Types SHALL export a `PropSchema` discriminated union keyed on the `type` field, where each variant includes a `type` literal matching its `PropType`, an optional `default` field whose type corresponds to the variant (e.g., `number` for the `number` variant, `boolean` for the `boolean` variant, `string` for all other variants), and an optional `label: string` field; additionally the `enum` variant SHALL include an `options: string[]` field with at least 1 element, and the `number` variant SHALL include optional `min: number`, `max: number`, and `step: number` fields; the remaining variants (`string`, `text`, `boolean`, `color`, `url`, `image`) carry no additional fields beyond `type`, `default`, and `label`.
3. THE Shared_Types SHALL export a `NodeId` branded string type using a TypeScript intersection of `string` with a readonly tag property (e.g., `string & { readonly __brand: unique symbol }`) such that a plain `string` value cannot be assigned to a `NodeId` variable without an explicit cast, producing a compile-time type error.
4. THE Shared_Types SHALL export a `makeNodeId()` function that returns a new `NodeId` generated via `crypto.randomUUID()`.
5. WHEN a TypeScript file imports any type or function from Shared_Types, THE Shared_Types SHALL compile without errors under `strict: true` mode in `tsconfig.json`.

### Requirement 5: Configure Package Scripts

**User Story:** As a developer, I want standardized npm scripts, so that dev, build, lint, typecheck, and test workflows are one command away.

#### Acceptance Criteria

1. THE Package_Scripts SHALL include a `dev` script that starts the Nuxt development server using `nuxi dev`.
2. THE Package_Scripts SHALL include a `build` script that produces a production build using `nuxi build`.
3. THE Package_Scripts SHALL include a `generate` script that pre-renders static pages using `nuxi generate`.
4. THE Package_Scripts SHALL include a `lint` script that runs ESLint in report-only mode (no auto-fix) against the project source files and exits with a non-zero code when violations are found.
5. THE Package_Scripts SHALL include a `lint:fix` script that runs ESLint with auto-fix enabled against the project source files.
6. THE Package_Scripts SHALL include a `typecheck` script that runs `nuxt typecheck` and exits with a non-zero code when type errors are found; `typecheck` SHALL NOT invoke Vitest or any test runner.
7. THE Package_Scripts SHALL include a `test` script that runs `vitest run` in single-execution mode (not watch mode), SHALL NOT default to or fall back to watch mode, and SHALL exit with a non-zero code when any test fails.
8. THE Package_Scripts SHALL include a `test:watch` script that runs Vitest in watch mode; this SHALL be the only script that invokes Vitest in watch mode.

### Requirement 6: Create Placeholder Pages

**User Story:** As a developer, I want placeholder index and editor pages, so that the app is routable from first run and Nuxt UI rendering is verified.

#### Acceptance Criteria

1. THE Scaffold SHALL create `/app/pages/index.vue` containing a `UButton` component with its `to` prop set to `/editor` for client-side Nuxt routing.
2. THE Scaffold SHALL create `/app/pages/editor.vue` as a stub page rendering the exact text "Editor coming soon" within a visible DOM element.
3. WHEN a user navigates to `/`, THE index page SHALL render a `UButton` that is visible in the DOM without requiring user interaction, and clicking it SHALL navigate the browser to the `/editor` route without a full page reload.
4. WHEN a user navigates to `/editor`, THE editor page SHALL render the text "Editor coming soon" without errors and return an HTTP 200 status.

### Requirement 7: Create Smoke Test

**User Story:** As a developer, I want a smoke test that proves Vitest is wired up and can import project types, so that the test pipeline is verified from the start.

#### Acceptance Criteria

1. THE Smoke_Test SHALL be located at `/tests/smoke.test.ts`.
2. THE Smoke_Test SHALL import `makeNodeId` from the `types/shared` module using the project's path resolution.
3. WHEN the Smoke_Test executes, THE Smoke_Test SHALL assert that `makeNodeId()` returns a string matching the UUID v4 format (36 characters, pattern `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`).
4. WHEN the Smoke_Test executes, THE Smoke_Test SHALL assert that two successive calls to `makeNodeId()` return different values.

### Requirement 8: Configure Vitest Environment

**User Story:** As a developer, I want Vitest configured with the Nuxt environment, so that component tests in later tasks can use `mountSuspended` with Nuxt UI components without failing.

#### Acceptance Criteria

1. THE Vitest_Config SHALL use `defineVitestConfig` from `@nuxt/test-utils/config` and export the result as the default export of `vitest.config.ts` at the project root.
2. THE Vitest_Config SHALL set the test environment to `'nuxt'`.
3. WHEN a test file imports `mountSuspended` from `@nuxt/test-utils/runtime` and mounts a Nuxt UI component, THE Vitest_Config SHALL provide the Nuxt context so the test executes without environment-related errors.

### Requirement 9: Configure Theme

**User Story:** As a developer, I want a neutral base theme configured via `app.config.ts`, so that the editor has a consistent visual appearance from the start.

#### Acceptance Criteria

1. THE App_Config SHALL configure a primary color from Nuxt UI's built-in color palette (e.g., "indigo") using Nuxt UI's theming system.
2. THE App_Config SHALL configure a neutral color from Nuxt UI's built-in color palette (e.g., "slate") using Nuxt UI's theming system.
3. WHEN the application renders any Nuxt UI component, THE App_Config theme SHALL be applied such that the component reflects the configured primary and neutral colors without additional per-component styling.
