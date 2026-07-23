import type { PropSchema } from './shared'

// ─── Category ────────────────────────────────────────────────────────────────

/**
 * The allowed categories for placeable building blocks.
 */
export type Category = 'layout' | 'content' | 'media' | 'form'

// ─── RegistryEntry ───────────────────────────────────────────────────────────

/**
 * Describes a single placeable building block's metadata, editable props,
 * slots, child acceptance rules, and compile hints.
 */
export interface RegistryEntry {
  /** PascalCase identifier matching /^[A-Z][a-zA-Z0-9]*$/, max 50 chars. Must equal its registry key. */
  type: string
  /** Human-readable display name, non-empty, max 50 chars. */
  label: string
  /** Block category for palette grouping. */
  category: Category
  /** Optional Lucide icon class for palette display. */
  icon?: string
  /** Editable properties exposed to the property panel. */
  props: Record<string, PropSchema>
  /** Named slots the component exposes, max 20 elements. */
  slots?: string[]
  /** Whether this block can contain child blocks. */
  acceptsChildren: boolean
  /** Allowed child type strings, max 50 elements. Only valid when acceptsChildren is true. */
  allowedChildren?: string[]
  /** Allowed parent type strings, max 50 elements. */
  allowedParents?: string[]
  /** Nuxt UI component tag name for compilation (e.g., 'UPageHero'). */
  compileAs?: string
}

// ─── Registry ────────────────────────────────────────────────────────────────

/**
 * A record mapping component type strings to their RegistryEntry definitions.
 */
export type Registry = Record<string, RegistryEntry>
