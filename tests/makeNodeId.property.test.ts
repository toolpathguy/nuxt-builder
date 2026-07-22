// @vitest-environment node
import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import { makeNodeId } from '../types/shared'

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('Feature: 01-project-setup', () => {
  /**
   * Property 1: makeNodeId format validity
   * Validates: Requirements 4.4, 7.3
   */
  it('Property 1: makeNodeId format validity', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        const id = makeNodeId()
        expect(id).toMatch(UUID_V4_REGEX)
      }),
      { numRuns: 100 }
    )
  })

  /**
   * Property 2: makeNodeId uniqueness
   * Validates: Requirements 4.4, 7.4
   */
  it('Property 2: makeNodeId uniqueness', () => {
    fc.assert(
      fc.property(fc.integer({ min: 100, max: 200 }), (count) => {
        const ids = new Set(Array.from({ length: count }, () => makeNodeId()))
        expect(ids.size).toBe(count)
      }),
      { numRuns: 100 }
    )
  })
})
