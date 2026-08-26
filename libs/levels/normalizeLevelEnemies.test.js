import { describe, expect, it } from 'vitest'
import { normalizeLevelEnemies } from 'libs/levels/normalizeLevelEnemies'

describe('normalizeLevelEnemies', () => {
  it('returns an empty array for an empty input', () => {
    expect(normalizeLevelEnemies({})).toEqual([])
  })

  it('uses the raw group key as the type (no PascalCase mapping)', () => {
    const result = normalizeLevelEnemies({
      goomba: [{ x: 23, y: 1, direction: 'left' }],
      koopa: [{ x: 19, y: 1 }],
    })

    expect(result).toEqual([
      { type: 'goomba', x: 23, y: 1, direction: 'left' },
      { type: 'koopa', x: 19, y: 1 },
    ])
  })

  it('flattens multiple entries per group in order', () => {
    const result = normalizeLevelEnemies({
      goomba: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }],
    })

    expect(result).toHaveLength(3)
    expect(result.map(e => e.x)).toEqual([1, 2, 3])
    expect(result.every(e => e.type === 'goomba')).toBe(true)
  })
})
