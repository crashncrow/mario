import { describe, expect, it } from 'vitest'
import { normalizeLevelElements } from 'libs/levels/normalizeLevelElements'

describe('normalizeLevelElements', () => {
  it('returns an empty array for an empty input', () => {
    expect(normalizeLevelElements({})).toEqual([])
  })

  it('maps each known group to its PascalCase type and keeps entry fields', () => {
    const result = normalizeLevelElements({
      solid: [{ x: 1, y: 2 }],
      mystery: [{ x: 3, y: 4 }],
      coin: [{ x: 5, y: 6 }],
    })

    expect(result).toEqual([
      { type: 'Solid', x: 1, y: 2 },
      { type: 'Mystery', x: 3, y: 4 },
      { type: 'Coin', x: 5, y: 6 },
    ])
  })

  it('preserves extra fields on each entry (e.g. pipeId, direction)', () => {
    const result = normalizeLevelElements({
      pipe: [{ x: 7, y: 1, size: 3, pipeId: 'bonus-entry' }],
    })

    expect(result).toEqual([
      { type: 'Pipe', x: 7, y: 1, size: 3, pipeId: 'bonus-entry' },
    ])
  })

  it('falls back to the raw group name when it has no PascalCase mapping', () => {
    const result = normalizeLevelElements({
      customThing: [{ x: 0, y: 0 }],
    })

    expect(result).toEqual([{ type: 'customThing', x: 0, y: 0 }])
  })

  it('flattens multiple groups with multiple entries each, preserving order', () => {
    const result = normalizeLevelElements({
      solid: [{ x: 1, y: 1 }, { x: 2, y: 1 }],
      floor: [{ x: 0, y: 0, size: 10 }],
    })

    expect(result).toEqual([
      { type: 'Solid', x: 1, y: 1 },
      { type: 'Solid', x: 2, y: 1 },
      { type: 'Floor', x: 0, y: 0, size: 10 },
    ])
  })
})
