# Requirements Document

## Introduction

The Component Registry is the single source of truth describing every placeable building block in the Nuxt Visual Builder. It defines each component's editable props, slots, child acceptance rules, and compile hints. The registry is consumed by the render engine, the auto-generated property panel, and the compiler — none of which should need to hardcode component knowledge.

The primary building blocks are **Nuxt UI page-building components** (`UPageHero`, `UPageSection`, `UPageColumns`, etc.). A small set of custom gap-filler blocks (`RichText`, `Image`, `Spacer`) covers functionality that Nuxt UI does not provide out-of-the-box. Block wrappers in `/app/components/blocks/` are thin pass-through wrappers that delegate rendering to the real Nuxt UI component.

## Glossary

- **Registry**: A record mapping component type strings to their RegistryEntry definitions
- **RegistryEntry**: A data object describing a single placeable building block's metadata, props, slots, and constraints
- **PropSchema**: A discriminated union type (defined in `/types/shared.ts`) describing the schema for a single editable property
- **Component_Map**: A runtime record mapping type strings to their actual Vue component references for use with `<component :is>`
- **Block_Component**: A Vue single-file component under `/app/components/blocks/` that renders a placeable building block — either a thin Nuxt UI wrapper or a custom gap-filler
- **Nuxt_UI_Block**: A Block_Component that wraps a real Nuxt UI component (e.g., `UPageHero`, `UButton`) and passes registered props through
- **Custom_Block**: A Block_Component that implements functionality not available from Nuxt UI (RichText, Image, Spacer)
- **Entries_Module**: The pure-data module at `/registry/entries.ts` containing registry entries with zero `.vue` imports
- **Registry_Module**: The Vue-aware module at `/registry/index.ts` that combines entries with component imports
- **UseRegistry_Composable**: The Vue composable at `/app/composables/useRegistry.ts` exposing registry data to Vue components
- **Zod_Validator**: A Zod schema that validates RegistryEntry objects at module load time in development mode

## Requirements

### Requirement 1: Registry Type Definitions

**User Story:** As a developer, I want a well-typed RegistryEntry interface and Registry type, so that all systems consuming the registry share a single contract.

#### Acceptance Criteria

1. THE Registry_Module SHALL export a `RegistryEntry` interface from `/types/registry.ts` containing: `type` (string, PascalCase, maximum 50 characters), `label` (string, maximum 50 characters), `category` (one of 'layout', 'content', 'media', 'form'), `icon` (optional string), `props` (Record<string, PropSchema>), `slots` (optional string array with a maximum of 20 elements), `acceptsChildren` (boolean), `allowedChildren` (optional string array with a maximum of 50 elements), `allowedParents` (optional string array with a maximum of 50 elements), and `compileAs` (optional string)
2. THE Registry_Module SHALL export a `Registry` type defined as `Record<string, RegistryEntry>` from `/types/registry.ts`
3. THE Registry_Module SHALL require the `type` field of each RegistryEntry to be a PascalCase string (matching the pattern `/^[A-Z][a-zA-Z0-9]*$/`) that is identical to its key in the Registry record
4. THE Registry_Module SHALL import `PropSchema` from `/types/shared.ts` for the `props` field definition
5. IF `acceptsChildren` is set to `false` on a RegistryEntry, THEN THE Registry_Module SHALL disallow the presence of the `allowedChildren` field on that entry

### Requirement 2: Zod Validation of Registry Entries

**User Story:** As a developer, I want registry entries to be validated at load time with clear error messages, so that malformed entries are caught early during development.

#### Acceptance Criteria

1. WHEN the registry module loads in development mode (detected via `import.meta.dev` or `process.env.NODE_ENV !== 'production'`), THE Zod_Validator SHALL validate every RegistryEntry in the registry against its Zod schema before the module exports become available
2. IF a RegistryEntry has a missing or empty `label` field, THEN THE Zod_Validator SHALL throw an error that includes the entry's `type` and indicates the label is missing or empty
3. IF a RegistryEntry has a `props` field containing a PropSchema with a `type` value not in the set ('string', 'text', 'number', 'boolean', 'enum', 'color', 'url', 'image'), THEN THE Zod_Validator SHALL throw an error that includes the entry's `type` and the invalid prop key name
4. IF a RegistryEntry has `acceptsChildren` set to false but declares a non-empty `slots` array containing a "default" slot, THEN THE Zod_Validator SHALL throw an error that includes the entry's `type` and indicates the conflict between `acceptsChildren: false` and the default slot declaration
5. IF a RegistryEntry has `allowedChildren` defined but `acceptsChildren` is false, THEN THE Zod_Validator SHALL throw an error that includes the entry's `type` and indicates that `allowedChildren` requires `acceptsChildren` to be true
6. WHEN validation passes for all entries, THE Zod_Validator SHALL allow the module to load without throwing any errors
7. WHILE the application is running in production mode, THE Zod_Validator SHALL skip all registry validation to avoid runtime overhead
8. IF a RegistryEntry has a missing or empty `type` field, THEN THE Zod_Validator SHALL throw an error that includes the entry's key in the registry record to identify the malformed entry
9. IF a RegistryEntry has a `category` field with a value not in the set ('layout', 'content', 'media', 'form'), THEN THE Zod_Validator SHALL throw an error that includes the entry's `type` and the invalid category value

### Requirement 3: Nuxt UI Page-Building Block Set (Primary)

**User Story:** As a visual builder user, I want Nuxt UI page-building components as my primary placeable blocks, so that I can compose professional landing pages using the same components that Nuxt UI provides.

#### Acceptance Criteria

1. THE Block_Component set SHALL include Nuxt_UI_Block entries for the following types: PageHero, PageSection, PageColumns, PageGrid, PageCTA, PageFeature, PageCard, Button, Card, and Separator
2. WHEN a Nuxt_UI_Block registry entry is defined, THE registry entry SHALL set `compileAs` to the actual Nuxt UI component tag name (e.g., PageHero sets `compileAs: 'UPageHero'`, Button sets `compileAs: 'UButton'`)
3. THE Nuxt_UI_Block registry entries SHALL expose only the most editor-friendly props from each Nuxt UI component as PropSchema fields, keeping the property panel manageable rather than exposing all available props
4. THE Nuxt_UI_Block wrapper components SHALL live under `/app/components/blocks/` and SHALL be thin wrappers that pass all registered props through to the actual Nuxt UI component
5. WHEN a Nuxt_UI_Block renders in the editor canvas, THE Block_Component SHALL render the actual Nuxt UI component so that the editor preview matches production output
6. THE Nuxt_UI_Block registry entries SHALL each include an `icon` field with an appropriate Lucide icon name for palette display

### Requirement 4: PageHero Block

**User Story:** As a visual builder user, I want a PageHero block that wraps UPageHero, so that I can create prominent hero sections with titles, descriptions, and optional call-to-action links.

#### Acceptance Criteria

1. THE PageHero RegistryEntry SHALL set `compileAs` to `'UPageHero'`
2. THE PageHero RegistryEntry SHALL expose a `title` prop of string type with default `'Your Page Title'`
3. THE PageHero RegistryEntry SHALL expose a `description` prop of text type with default `'A compelling description for your hero section'`
4. THE PageHero RegistryEntry SHALL expose a `headline` prop of string type with default `''`
5. THE PageHero RegistryEntry SHALL expose an `orientation` prop of enum type with options `'vertical'`, `'horizontal'` and default `'vertical'`
6. THE PageHero RegistryEntry SHALL have category `'layout'`
7. THE PageHero RegistryEntry SHALL have `acceptsChildren` set to false
8. WHEN the PageHero Block_Component renders, THE Block_Component SHALL pass `title`, `description`, `headline`, and `orientation` props through to the `UPageHero` component
9. WHEN the PageHero Block_Component renders with no props, THE Block_Component SHALL display the default title and description text within a UPageHero component without error

### Requirement 5: PageSection Block

**User Story:** As a visual builder user, I want a PageSection block that wraps UPageSection, so that I can create titled content sections with descriptions and optional child content.

#### Acceptance Criteria

1. THE PageSection RegistryEntry SHALL set `compileAs` to `'UPageSection'`
2. THE PageSection RegistryEntry SHALL expose a `title` prop of string type with default `'Section Title'`
3. THE PageSection RegistryEntry SHALL expose a `description` prop of text type with default `''`
4. THE PageSection RegistryEntry SHALL expose a `headline` prop of string type with default `''`
5. THE PageSection RegistryEntry SHALL expose an `orientation` prop of enum type with options `'vertical'`, `'horizontal'` and default `'vertical'`
6. THE PageSection RegistryEntry SHALL expose a `reverse` prop of boolean type with default `false`
7. THE PageSection RegistryEntry SHALL have category `'layout'`
8. THE PageSection RegistryEntry SHALL have `acceptsChildren` set to true
9. WHEN the PageSection Block_Component renders, THE Block_Component SHALL pass all registered props through to the `UPageSection` component and render a default `<slot>` passing through to UPageSection's default slot
10. WHEN the PageSection Block_Component has no children, THE Block_Component SHALL render successfully showing the title and description text

### Requirement 6: PageColumns and PageGrid Blocks

**User Story:** As a visual builder user, I want PageColumns and PageGrid blocks, so that I can create responsive multi-column and grid layouts using Nuxt UI's built-in layout components.

#### Acceptance Criteria

1. THE PageColumns RegistryEntry SHALL set `compileAs` to `'UPageColumns'`
2. THE PageColumns RegistryEntry SHALL have category `'layout'`
3. THE PageColumns RegistryEntry SHALL have `acceptsChildren` set to true
4. THE PageColumns RegistryEntry SHALL have an empty `props` record (no editable props — layout is handled by Nuxt UI internally)
5. THE PageGrid RegistryEntry SHALL set `compileAs` to `'UPageGrid'`
6. THE PageGrid RegistryEntry SHALL have category `'layout'`
7. THE PageGrid RegistryEntry SHALL have `acceptsChildren` set to true
8. THE PageGrid RegistryEntry SHALL have an empty `props` record
9. WHEN the PageColumns Block_Component renders, THE Block_Component SHALL render a `UPageColumns` component with a default `<slot>` for child content
10. WHEN the PageGrid Block_Component renders, THE Block_Component SHALL render a `UPageGrid` component with a default `<slot>` for child content

### Requirement 7: PageCTA Block

**User Story:** As a visual builder user, I want a PageCTA block that wraps UPageCTA, so that I can create call-to-action sections with titles and descriptions.

#### Acceptance Criteria

1. THE PageCTA RegistryEntry SHALL set `compileAs` to `'UPageCTA'`
2. THE PageCTA RegistryEntry SHALL expose a `title` prop of string type with default `'Ready to Get Started?'`
3. THE PageCTA RegistryEntry SHALL expose a `description` prop of text type with default `'Start building your next project today.'`
4. THE PageCTA RegistryEntry SHALL expose a `headline` prop of string type with default `''`
5. THE PageCTA RegistryEntry SHALL have category `'content'`
6. THE PageCTA RegistryEntry SHALL have `acceptsChildren` set to false
7. WHEN the PageCTA Block_Component renders, THE Block_Component SHALL pass `title`, `description`, and `headline` props through to the `UPageCTA` component
8. WHEN the PageCTA Block_Component renders with no props, THE Block_Component SHALL display the default CTA text within a UPageCTA component without error

### Requirement 8: PageFeature Block

**User Story:** As a visual builder user, I want a PageFeature block that wraps UPageFeature, so that I can showcase individual features with icons, titles, and descriptions.

#### Acceptance Criteria

1. THE PageFeature RegistryEntry SHALL set `compileAs` to `'UPageFeature'`
2. THE PageFeature RegistryEntry SHALL expose a `title` prop of string type with default `'Feature Title'`
3. THE PageFeature RegistryEntry SHALL expose a `description` prop of text type with default `'Describe this feature and its benefits.'`
4. THE PageFeature RegistryEntry SHALL expose an `icon` prop of string type with default `'i-lucide-star'`
5. THE PageFeature RegistryEntry SHALL expose an `orientation` prop of enum type with options `'vertical'`, `'horizontal'` and default `'vertical'`
6. THE PageFeature RegistryEntry SHALL have category `'content'`
7. THE PageFeature RegistryEntry SHALL have `acceptsChildren` set to false
8. WHEN the PageFeature Block_Component renders, THE Block_Component SHALL pass `title`, `description`, `icon`, and `orientation` props through to the `UPageFeature` component

### Requirement 9: PageCard and Card Blocks

**User Story:** As a visual builder user, I want PageCard and Card blocks, so that I can create card-style content containers — PageCard for page-level cards with links, and Card for general-purpose containers.

#### Acceptance Criteria

1. THE PageCard RegistryEntry SHALL set `compileAs` to `'UPageCard'`
2. THE PageCard RegistryEntry SHALL expose a `title` prop of string type with default `'Card Title'`
3. THE PageCard RegistryEntry SHALL expose a `description` prop of text type with default `'Card description goes here.'`
4. THE PageCard RegistryEntry SHALL expose a `to` prop of url type with default `''`
5. THE PageCard RegistryEntry SHALL have category `'content'`
6. THE PageCard RegistryEntry SHALL have `acceptsChildren` set to false
7. THE Card RegistryEntry SHALL set `compileAs` to `'UCard'`
8. THE Card RegistryEntry SHALL have category `'content'`
9. THE Card RegistryEntry SHALL have `acceptsChildren` set to true
10. THE Card RegistryEntry SHALL have an empty `props` record (content goes in the default slot)
11. WHEN the PageCard Block_Component renders, THE Block_Component SHALL pass `title`, `description`, and `to` props through to the `UPageCard` component
12. WHEN the Card Block_Component renders, THE Block_Component SHALL render a `UCard` component with a default `<slot>` for child content

### Requirement 10: Button Block

**User Story:** As a visual builder user, I want a Button block that wraps UButton, so that I can add interactive button/link elements styled with Nuxt UI's design system.

#### Acceptance Criteria

1. THE Button RegistryEntry SHALL set `compileAs` to `'UButton'`
2. THE Button RegistryEntry SHALL expose a `label` prop of string type with default `'Click Me'`
3. THE Button RegistryEntry SHALL expose a `to` prop of url type with default `'#'`
4. THE Button RegistryEntry SHALL expose a `color` prop of enum type with options `'primary'`, `'secondary'`, `'neutral'`, `'success'`, `'warning'`, `'error'` and default `'primary'`
5. THE Button RegistryEntry SHALL expose a `variant` prop of enum type with options `'solid'`, `'outline'`, `'soft'`, `'subtle'`, `'ghost'`, `'link'` and default `'solid'`
6. THE Button RegistryEntry SHALL expose a `size` prop of enum type with options `'xs'`, `'sm'`, `'md'`, `'lg'`, `'xl'` and default `'md'`
7. THE Button RegistryEntry SHALL have category `'content'`
8. THE Button RegistryEntry SHALL have `acceptsChildren` set to false
9. WHEN the Button Block_Component renders, THE Block_Component SHALL pass `label`, `to`, `color`, `variant`, and `size` props through to the `UButton` component

### Requirement 11: Separator Block

**User Story:** As a visual builder user, I want a Separator block that wraps USeparator, so that I can add horizontal or vertical dividers between content sections.

#### Acceptance Criteria

1. THE Separator RegistryEntry SHALL set `compileAs` to `'USeparator'`
2. THE Separator RegistryEntry SHALL expose an `orientation` prop of enum type with options `'horizontal'`, `'vertical'` and default `'horizontal'`
3. THE Separator RegistryEntry SHALL expose a `label` prop of string type with default `''`
4. THE Separator RegistryEntry SHALL have category `'layout'`
5. THE Separator RegistryEntry SHALL have `acceptsChildren` set to false
6. WHEN the Separator Block_Component renders, THE Block_Component SHALL pass `orientation` and `label` props through to the `USeparator` component

### Requirement 12: Custom Gap-Filler Blocks (RichText, Image, Spacer)

**User Story:** As a visual builder user, I want RichText, Image, and Spacer blocks for functionality that Nuxt UI does not provide, so that I can add arbitrary text/HTML content, standalone images, and vertical spacing to pages.

#### Acceptance Criteria

1. THE RichText Block_Component SHALL be a Custom_Block (no `compileAs` to a Nuxt UI component) implementing its own rendering logic
2. THE RichText RegistryEntry SHALL expose a `body` prop of text type with default `'Enter your content here.'`
3. THE RichText RegistryEntry SHALL expose an `align` prop of enum type with options `'left'`, `'center'`, `'right'` and default `'left'`
4. THE RichText RegistryEntry SHALL have category `'content'`
5. THE RichText RegistryEntry SHALL have `acceptsChildren` set to false
6. WHEN the RichText Block_Component renders, THE Block_Component SHALL render the `body` prop value as HTML content within a block-level container, preserving line breaks, and applying the `align` prop as text alignment
7. THE Image Block_Component SHALL be a Custom_Block implementing its own rendering logic
8. THE Image RegistryEntry SHALL expose a `src` prop of image type with default `'https://placehold.co/800x400'`
9. THE Image RegistryEntry SHALL expose an `alt` prop of string type with default `''`
10. THE Image RegistryEntry SHALL expose a `rounded` prop of boolean type with default `false`
11. THE Image RegistryEntry SHALL have category `'media'`
12. THE Image RegistryEntry SHALL have `acceptsChildren` set to false
13. WHEN the Image Block_Component renders, THE Block_Component SHALL output an `<img>` element with `src` bound to the `src` prop, `alt` bound to the `alt` prop, and a maximum width of 100% of its container
14. IF the `rounded` prop is true, THEN THE Image Block_Component SHALL apply a visible border-radius to the rendered `<img>` element
15. THE Spacer Block_Component SHALL be a Custom_Block implementing its own rendering logic
16. THE Spacer RegistryEntry SHALL expose a `size` prop of enum type with options `'sm'`, `'md'`, `'lg'` and default `'md'`
17. THE Spacer RegistryEntry SHALL have category `'layout'`
18. THE Spacer RegistryEntry SHALL have `acceptsChildren` set to false
19. WHEN the Spacer Block_Component renders, THE Block_Component SHALL output an empty block-level element whose height varies by `size` value, where `'sm'` is the shortest and `'lg'` is the tallest
20. THE Custom_Block components SHALL use Tailwind CSS v4 utility classes for styling

### Requirement 13: Registry Purity Split

**User Story:** As a developer, I want the registry entries separated from Vue component imports, so that the compiler, CLI, and server routes can import registry metadata without triggering `.vue` file resolution.

#### Acceptance Criteria

1. THE Entries_Module at `/registry/entries.ts` SHALL export all RegistryEntry data as plain object literals containing only serializable values and zero function references
2. THE Entries_Module SHALL contain zero `.vue` file imports and zero imports that transitively resolve `.vue` files
3. WHEN the Entries_Module is imported from a plain Node.js or tsx script running outside Vite, THE Entries_Module SHALL load and evaluate without throwing errors within 2 seconds
4. THE Registry_Module at `/registry/index.ts` SHALL import entries from the Entries_Module and Vue components from `/app/components/blocks/`, and SHALL export a `registry` object re-exporting all entries keyed by type string
5. THE Registry_Module SHALL export a `componentMap` of type `Record<string, Component>` mapping each entry `type` to its Vue component, where every key in `componentMap` has a corresponding entry in the registry and every entry in the registry has a corresponding key in `componentMap`
6. THE Registry_Module SHALL export helper functions: `getEntry(type: string)` returning `RegistryEntry | undefined`, `defaultPropsFor(type: string)` returning `Record<string, unknown>`, and `entriesByCategory()` returning `Record<string, RegistryEntry[]>`
7. WHEN `defaultPropsFor` is called with a valid type, THE Registry_Module SHALL return an object with one key per entry in the entry's `props` record, each set to its PropSchema `default` value if defined, or `undefined` if the PropSchema declares no default
8. IF `defaultPropsFor` or `getEntry` is called with a type string that does not match any registered entry, THEN THE Registry_Module SHALL return `undefined`
9. WHEN `entriesByCategory` is called, THE Registry_Module SHALL return an object keyed by category string (from the set: `layout`, `content`, `media`, `form`) with each value being an array of all RegistryEntry objects belonging to that category

### Requirement 14: useRegistry Composable

**User Story:** As a Vue component developer, I want a composable that exposes the registry, component map, and helpers, so that I can access registry data reactively in Vue components.

#### Acceptance Criteria

1. THE UseRegistry_Composable SHALL be located at `/app/composables/useRegistry.ts`
2. WHEN a Vue component calls `useRegistry()`, THE UseRegistry_Composable SHALL return an object containing the properties: `registry`, `componentMap`, `getEntry`, `defaultPropsFor`, and `entriesByCategory`, each re-exported from the `/registry/index.ts` module
3. THE UseRegistry_Composable SHALL expose `registry` as the complete `Registry` record (all registered `RegistryEntry` objects keyed by type string)
4. THE UseRegistry_Composable SHALL expose `componentMap` as a `Record<string, Component>` mapping each registered type string to its corresponding Vue component
5. THE UseRegistry_Composable SHALL expose `getEntry`, `defaultPropsFor`, and `entriesByCategory` as callable functions that retain the same signatures and behavior as their `/registry/index.ts` counterparts
6. WHEN the UseRegistry_Composable is called within a Vue component's `setup` context, THE UseRegistry_Composable SHALL return successfully without throwing an error
7. IF `getEntry` is called via the UseRegistry_Composable with a type string that does not exist in the registry, THEN THE UseRegistry_Composable SHALL return `undefined` for that entry rather than throwing an error

### Requirement 15: Registry Consistency Verification

**User Story:** As a developer, I want automated tests verifying that every component map entry has a matching registry entry and vice-versa, so that mismatches are caught before runtime.

#### Acceptance Criteria

1. WHEN the test suite runs, THE test SHALL verify that every key in `componentMap` has a corresponding key with an identical string in the `registry`, and report each unmatched key as a distinct assertion failure
2. WHEN the test suite runs, THE test SHALL verify that every key in the `registry` has a corresponding key with an identical string in `componentMap`, and report each unmatched key as a distinct assertion failure
3. WHEN `defaultPropsFor('PageHero')` is called, THE test SHALL verify the returned object is a plain object keyed by prop name (title, description, headline, orientation) where each value equals the `default` field declared in that prop's `PropSchema` within the PageHero registry entry
4. WHEN a RegistryEntry missing the required `label` field is passed to the Zod validator, THE test SHALL verify that the validator throws an error indicating the validation failure
5. WHEN the test reads the source text of `/registry/entries.ts`, THE test SHALL verify that the file contains zero import statements referencing any path ending in `.vue`
6. IF a new key is added to `componentMap` without a matching `registry` entry, THEN THE test SHALL fail with an assertion identifying the orphaned componentMap key
7. IF a new key is added to the `registry` without a matching `componentMap` entry, THEN THE test SHALL fail with an assertion identifying the orphaned registry key
8. WHEN the test suite runs, THE test SHALL verify that every Nuxt_UI_Block RegistryEntry has a non-empty `compileAs` field that starts with `'U'` (indicating a Nuxt UI component tag)
