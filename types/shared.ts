// ─── PropType ────────────────────────────────────────────────────────────────

/**
 * The kinds of properties a component can expose to the editor.
 */
export type PropType =
  | 'string'
  | 'text'
  | 'number'
  | 'boolean'
  | 'enum'
  | 'color'
  | 'url'
  | 'image'

// ─── PropSchema ──────────────────────────────────────────────────────────────

/**
 * Base fields shared by all prop schema variants.
 */
interface PropSchemaBase {
  label?: string
}

interface StringPropSchema extends PropSchemaBase {
  type: 'string'
  default?: string
}

interface TextPropSchema extends PropSchemaBase {
  type: 'text'
  default?: string
}

interface NumberPropSchema extends PropSchemaBase {
  type: 'number'
  default?: number
  min?: number
  max?: number
  step?: number
}

interface BooleanPropSchema extends PropSchemaBase {
  type: 'boolean'
  default?: boolean
}

interface EnumPropSchema extends PropSchemaBase {
  type: 'enum'
  default?: string
  options: [string, ...string[]] // at least 1 element
}

interface ColorPropSchema extends PropSchemaBase {
  type: 'color'
  default?: string
}

interface UrlPropSchema extends PropSchemaBase {
  type: 'url'
  default?: string
}

interface ImagePropSchema extends PropSchemaBase {
  type: 'image'
  default?: string
}

/**
 * Discriminated union of all property schema variants, keyed on `type`.
 */
export type PropSchema =
  | StringPropSchema
  | TextPropSchema
  | NumberPropSchema
  | BooleanPropSchema
  | EnumPropSchema
  | ColorPropSchema
  | UrlPropSchema
  | ImagePropSchema

// ─── NodeId ──────────────────────────────────────────────────────────────────

declare const __nodeIdBrand: unique symbol

/**
 * A branded string type wrapping a UUID. Cannot be assigned from a plain
 * string without an explicit cast — provides compile-time safety.
 */
export type NodeId = string & { readonly [__nodeIdBrand]: typeof __nodeIdBrand }

/**
 * Creates a new NodeId using crypto.randomUUID().
 */
export function makeNodeId(): NodeId {
  return crypto.randomUUID() as NodeId
}
