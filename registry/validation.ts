import { z } from 'zod'

// ─── PropSchema Zod Schemas ─────────────────────────────────────────────────

/**
 * Zod schema for PropSchema validation — a discriminated union covering
 * all 8 prop types: string, text, number, boolean, enum, color, url, image.
 */
export const propSchemaZod = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('string'),
    label: z.string().optional(),
    default: z.string().optional(),
  }),
  z.object({
    type: z.literal('text'),
    label: z.string().optional(),
    default: z.string().optional(),
  }),
  z.object({
    type: z.literal('number'),
    label: z.string().optional(),
    default: z.number().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    step: z.number().optional(),
  }),
  z.object({
    type: z.literal('boolean'),
    label: z.string().optional(),
    default: z.boolean().optional(),
  }),
  z.object({
    type: z.literal('enum'),
    label: z.string().optional(),
    default: z.string().optional(),
    options: z.array(z.string()).min(1),
  }),
  z.object({
    type: z.literal('color'),
    label: z.string().optional(),
    default: z.string().optional(),
  }),
  z.object({
    type: z.literal('url'),
    label: z.string().optional(),
    default: z.string().optional(),
  }),
  z.object({
    type: z.literal('image'),
    label: z.string().optional(),
    default: z.string().optional(),
  }),
])

// ─── RegistryEntry Zod Schema ────────────────────────────────────────────────

/**
 * Zod schema for RegistryEntry validation with all field constraints
 * and cross-field refinements.
 */
export const registryEntryZod = z.object({
  type: z.string().min(1).max(50).regex(/^[A-Z][a-zA-Z0-9]*$/),
  label: z.string().min(1).max(50),
  category: z.enum(['layout', 'content', 'media', 'form']),
  icon: z.string().optional(),
  props: z.record(z.string(), propSchemaZod),
  slots: z.array(z.string()).max(20).optional(),
  acceptsChildren: z.boolean(),
  allowedChildren: z.array(z.string()).max(50).optional(),
  allowedParents: z.array(z.string()).max(50).optional(),
  compileAs: z.string().optional(),
}).superRefine((entry, ctx) => {
  // Cross-field constraint: allowedChildren requires acceptsChildren to be true
  if (!entry.acceptsChildren && entry.allowedChildren !== undefined) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `[${entry.type}] allowedChildren requires acceptsChildren to be true`,
    })
  }

  // Cross-field constraint: acceptsChildren:false conflicts with "default" slot
  if (!entry.acceptsChildren && entry.slots?.includes('default')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `[${entry.type}] acceptsChildren:false conflicts with declaring a "default" slot`,
    })
  }
})

// ─── validateRegistry ────────────────────────────────────────────────────────

/**
 * Iterates all entries in a registry record, validates each against the
 * Zod schema, and throws descriptive errors including the entry type/key.
 * Also verifies that each entry's `type` field matches its registry key.
 */
export function validateRegistry(registry: Record<string, unknown>): void {
  for (const [key, entry] of Object.entries(registry)) {
    const result = registryEntryZod.safeParse(entry)
    if (!result.success) {
      const issues = result.error.issues
        .map(i => `${i.path.join('.') || '<root>'}: ${i.message}`)
        .join('; ')
      throw new Error(`Registry validation failed for "${key}": ${issues}`)
    }
    // Verify type field matches its registry key
    if ((entry as { type?: string }).type !== key) {
      throw new Error(
        `Registry key "${key}" does not match entry.type "${(entry as { type?: string }).type}"`,
      )
    }
  }
}
