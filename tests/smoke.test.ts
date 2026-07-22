// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { makeNodeId } from '../types/shared'

const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

describe('Smoke test', () => {
  it('makeNodeId() returns a valid UUID v4 string', () => {
    const id = makeNodeId()
    expect(id).toHaveLength(36)
    expect(id).toMatch(UUID_V4_REGEX)
  })

  it('makeNodeId() returns unique values on successive calls', () => {
    const id1 = makeNodeId()
    const id2 = makeNodeId()
    expect(id1).not.toBe(id2)
  })
})
