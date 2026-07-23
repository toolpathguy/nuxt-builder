import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { validateRegistry } from '../registry/validation'
import { entries } from '../registry/entries'
import { registry, componentMap, defaultPropsFor } from '../registry'

describe('Feature: 02-component-registry - Unit Tests', () => {
  describe('Registry consistency and validation', () => {
    it('componentMap and registry key sets are identical', () => {
      const registryKeys = Object.keys(registry).sort()
      const componentKeys = Object.keys(componentMap).sort()

      // Report each mismatch
      const missingInComponentMap = registryKeys.filter(k => !componentKeys.includes(k))
      const missingInRegistry = componentKeys.filter(k => !registryKeys.includes(k))

      expect(missingInComponentMap, `Keys in registry but missing from componentMap: ${missingInComponentMap.join(', ')}`).toEqual([])
      expect(missingInRegistry, `Keys in componentMap but missing from registry: ${missingInRegistry.join(', ')}`).toEqual([])
      expect(registryKeys).toEqual(componentKeys)
    })

    it('defaultPropsFor("PageHero") returns correct defaults', () => {
      const defaults = defaultPropsFor('PageHero')
      expect(defaults).toEqual({
        title: 'Your Page Title',
        description: 'A compelling description for your hero section',
        headline: '',
        orientation: 'vertical',
      })
    })

    it('Zod validator throws for entry with missing label', () => {
      const invalidRegistry = {
        TestEntry: {
          type: 'TestEntry',
          label: '',
          category: 'layout',
          props: {},
          acceptsChildren: false,
        },
      }

      expect(() => validateRegistry(invalidRegistry)).toThrow(/TestEntry/)
    })

    it('entries.ts source has zero .vue import statements', () => {
      const source = readFileSync(resolve(__dirname, '../registry/entries.ts'), 'utf-8')
      const vueImports = source.match(/import .+\.vue['"]/g)
      expect(vueImports).toBeNull()
    })

    it('all Nuxt UI block entries have non-empty compileAs starting with U', () => {
      for (const [key, entry] of Object.entries(entries)) {
        if (entry.compileAs !== undefined) {
          expect(entry.compileAs.length, `${key} has empty compileAs`).toBeGreaterThan(0)
          expect(entry.compileAs[0], `${key} compileAs does not start with U`).toBe('U')
        }
      }
    })
  })

  describe('Entries module purity', () => {
    it('entries.ts loads without errors', () => {
      // The import at the top of this file already proves entries.ts loads.
      // We verify the imported object is a non-empty record.
      expect(entries).toBeDefined()
      expect(typeof entries).toBe('object')
      expect(Object.keys(entries).length).toBeGreaterThan(0)
    })

    it('all entries are serializable (no function references)', () => {
      for (const [key, entry] of Object.entries(entries)) {
        const serialized = JSON.parse(JSON.stringify(entry))
        expect(serialized, `Entry "${key}" is not serializable`).toEqual(entry)
      }
    })
  })
})
