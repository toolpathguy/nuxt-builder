import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { validateRegistry, registryEntryZod } from '../registry/validation'
import { entries } from '../registry/entries'
import { registry, componentMap, getEntry, defaultPropsFor, entriesByCategory } from '../registry'

describe('Feature: 02-component-registry', () => {
  /**
   * Property 1: Validator rejects invalid entries with identifying information
   * Validates: Requirements 1.5, 2.2, 2.3, 2.4, 2.5, 2.8, 2.9
   */
  it('Property 1: Validator rejects invalid entries with identifying information', () => {
    // Generator for a valid base entry
    const validType = fc.stringMatching(/^[A-Z][a-zA-Z0-9]{0,9}$/)
    const validLabel = fc.string({ minLength: 1, maxLength: 50 })
    const validCategory = fc.constantFrom('layout' as const, 'content' as const, 'media' as const, 'form' as const)

    // Strategy: create entries that are almost valid but break one constraint at a time
    const invalidEntry = fc.oneof(
      // Missing label (empty string)
      validType.map(type => ({
        key: type,
        entry: {
          type,
          label: '',
          category: 'layout',
          props: {},
          acceptsChildren: false,
        },
      })),
      // Invalid prop type
      validType.chain(type =>
        fc.string({ minLength: 1, maxLength: 10 }).map(propKey => ({
          key: type,
          entry: {
            type,
            label: 'Valid Label',
            category: 'content',
            props: { [propKey]: { type: 'invalid_type' } },
            acceptsChildren: false,
          },
        })),
      ),
      // Invalid category
      validType.map(type => ({
        key: type,
        entry: {
          type,
          label: 'Valid Label',
          category: 'not_a_category',
          props: {},
          acceptsChildren: false,
        },
      })),
      // allowedChildren with acceptsChildren:false
      validType.map(type => ({
        key: type,
        entry: {
          type,
          label: 'Valid Label',
          category: 'layout',
          props: {},
          acceptsChildren: false,
          allowedChildren: ['SomeChild'],
        },
      })),
      // "default" slot with acceptsChildren:false
      validType.map(type => ({
        key: type,
        entry: {
          type,
          label: 'Valid Label',
          category: 'media',
          props: {},
          acceptsChildren: false,
          slots: ['default'],
        },
      })),
    )

    fc.assert(
      fc.property(invalidEntry, ({ key, entry }) => {
        // validateRegistry should throw with identifying info (the key or type)
        expect(() => validateRegistry({ [key]: entry })).toThrow(key)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 2: Valid entries pass validation without errors
   * Validates: Requirements 2.6
   */
  it('Property 2: Valid entries pass validation without errors', () => {
    const validType = fc.stringMatching(/^[A-Z][a-zA-Z0-9]{0,9}$/)
    const validLabel = fc.string({ minLength: 1, maxLength: 50 })
    const validCategory = fc.constantFrom('layout' as const, 'content' as const, 'media' as const, 'form' as const)

    const propSchema = fc.oneof(
      fc.record({ type: fc.constant('string' as const), default: fc.option(fc.string(), { nil: undefined }) }),
      fc.record({ type: fc.constant('text' as const), default: fc.option(fc.string(), { nil: undefined }) }),
      fc.record({ type: fc.constant('number' as const), default: fc.option(fc.integer(), { nil: undefined }) }),
      fc.record({ type: fc.constant('boolean' as const), default: fc.option(fc.boolean(), { nil: undefined }) }),
      fc.record({ type: fc.constant('enum' as const), options: fc.array(fc.string({ minLength: 1 }), { minLength: 1, maxLength: 5 }), default: fc.option(fc.string(), { nil: undefined }) }),
      fc.record({ type: fc.constant('color' as const), default: fc.option(fc.string(), { nil: undefined }) }),
      fc.record({ type: fc.constant('url' as const), default: fc.option(fc.string(), { nil: undefined }) }),
      fc.record({ type: fc.constant('image' as const), default: fc.option(fc.string(), { nil: undefined }) }),
    )

    const validProps = fc.dictionary(
      fc.string({ minLength: 1, maxLength: 20 }),
      propSchema,
      { minKeys: 0, maxKeys: 5 },
    )

    const validEntry = fc.tuple(validType, validLabel, validCategory, validProps, fc.boolean()).map(
      ([type, label, category, props, acceptsChildren]) => {
        const entry: Record<string, unknown> = {
          type,
          label,
          category,
          props,
          acceptsChildren,
        }
        // Only add allowedChildren when acceptsChildren is true
        // Never add "default" slot when acceptsChildren is false
        return entry
      },
    )

    fc.assert(
      fc.property(validEntry, (entry) => {
        const result = registryEntryZod.safeParse(entry)
        expect(result.success).toBe(true)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 3: Registry and componentMap bijection
   * Validates: Requirements 13.5, 15.1, 15.2, 15.6, 15.7
   */
  it('Property 3: Registry and componentMap bijection', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const registryKeys = Object.keys(registry).sort()
        const componentMapKeys = Object.keys(componentMap).sort()
        expect(registryKeys).toEqual(componentMapKeys)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 4: defaultPropsFor returns correct defaults for all entries
   * Validates: Requirements 13.7, 15.3
   */
  it('Property 4: defaultPropsFor returns correct defaults for all entries', () => {
    fc.assert(
      fc.property(fc.constantFrom(...Object.keys(registry)), (type) => {
        const defaults = defaultPropsFor(type)
        const entry = registry[type]
        expect(defaults).toBeDefined()
        // Keys must match exactly
        expect(Object.keys(defaults!).sort()).toEqual(Object.keys(entry.props).sort())
        // Values must equal the default field of each PropSchema
        for (const [key, schema] of Object.entries(entry.props)) {
          expect(defaults![key]).toEqual(schema.default ?? undefined)
        }
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 5: entriesByCategory groups all entries correctly
   * Validates: Requirements 13.9
   */
  it('Property 5: entriesByCategory groups all entries correctly', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const grouped = entriesByCategory()
        const allEntries = Object.values(registry)

        // Every entry appears in its category group
        for (const entry of allEntries) {
          expect(grouped[entry.category]).toBeDefined()
          expect(grouped[entry.category]).toContainEqual(entry)
        }

        // No entry appears in a wrong category
        for (const [category, categoryEntries] of Object.entries(grouped)) {
          for (const entry of categoryEntries) {
            expect(entry.category).toBe(category)
          }
        }

        // Union of all groups covers all entries
        const totalGrouped = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0)
        expect(totalGrouped).toBe(allEntries.length)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 6: Non-existent type strings return undefined
   * Validates: Requirements 13.8, 14.7
   */
  it('Property 6: Non-existent type strings return undefined', () => {
    const existingKeys = new Set(Object.keys(registry))

    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => !existingKeys.has(s)),
        (randomType) => {
          expect(getEntry(randomType)).toBeUndefined()
          expect(defaultPropsFor(randomType)).toBeUndefined()
        },
      ),
      { numRuns: 100 },
    )
  })

  /**
   * Property 7: Entries module produces serializable data
   * Validates: Requirements 13.1
   */
  it('Property 7: Entries module produces serializable data', () => {
    fc.assert(
      fc.property(fc.constantFrom(...Object.keys(entries)), (key) => {
        const entry = entries[key]
        const serialized = JSON.parse(JSON.stringify(entry))
        expect(serialized).toEqual(entry)
      }),
      { numRuns: 100 },
    )
  })

  /**
   * Property 8: Nuxt UI blocks have valid compileAs and icon
   * Validates: Requirements 3.2, 3.6, 15.8
   */
  it('Property 8: Nuxt UI blocks have valid compileAs and icon', () => {
    const entriesWithCompileAs = Object.values(entries).filter(e => e.compileAs !== undefined)

    fc.assert(
      fc.property(fc.constantFrom(...entriesWithCompileAs), (entry) => {
        // compileAs starts with 'U'
        expect(entry.compileAs).toBeDefined()
        expect(entry.compileAs!.startsWith('U')).toBe(true)
        expect(entry.compileAs!.length).toBeGreaterThan(0)
        // icon must be non-empty
        expect(entry.icon).toBeDefined()
        expect(entry.icon!.length).toBeGreaterThan(0)
      }),
      { numRuns: 100 },
    )
  })
})
