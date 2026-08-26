import { describe, expect, it } from 'vitest'
import {
  getLandingYAtPosition,
  getMaxWalkXForObjects,
  hasCeilingCollisionAtPosition,
  hasCollisionAtPosition,
  hasSideCollisionAtPosition,
  isGroundedAtPosition,
} from 'libs/world/collision'

const pixels = 64

// A single solid tile at tile-coords (1, 0) -> world px (64,0) to (128,64).
const solidTile = { type: 'Solid', x: 1, y: 0 }

describe('hasCollisionAtPosition', () => {
  it('detects a collision when Mario overlaps a solid tile', () => {
    expect(hasCollisionAtPosition({
      objects: [solidTile],
      pixels,
      x: 64,
      y: 0,
      playerForm: 'small',
    })).toBe(true)
  })

  it('does not detect a collision far away from any object', () => {
    expect(hasCollisionAtPosition({
      objects: [solidTile],
      pixels,
      x: 1000,
      y: 0,
      playerForm: 'small',
    })).toBe(false)
  })

  it('ignores coins — they are not solid', () => {
    expect(hasCollisionAtPosition({
      objects: [{ type: 'Coin', x: 1, y: 0 }],
      pixels,
      x: 64,
      y: 0,
      playerForm: 'small',
    })).toBe(false)
  })
})

describe('isGroundedAtPosition', () => {
  it('is grounded when standing exactly on top of a tile', () => {
    // Tile top is at y=64 (tile y:0, height 64) — standing with feet at 64.
    expect(isGroundedAtPosition({
      objects: [solidTile],
      pixels,
      x: 64,
      y: 64,
      playerForm: 'small',
    })).toBe(true)
  })

  it('is not grounded when clearly airborne above the tile', () => {
    expect(isGroundedAtPosition({
      objects: [solidTile],
      pixels,
      x: 64,
      y: 200,
      playerForm: 'small',
    })).toBe(false)
  })
})

describe('getLandingYAtPosition', () => {
  it('lands on top of a solid tile when falling through its Y range', () => {
    const landingY = getLandingYAtPosition({
      objects: [solidTile],
      pixels,
      x: 64,
      fromY: 300,
      toY: 0,
      playerForm: 'small',
    })

    expect(landingY).toBe(64) // tile top = (y:0 * 64) + height(64)
  })

  it('returns null when there is no X overlap with any solid tile', () => {
    const landingY = getLandingYAtPosition({
      objects: [solidTile],
      pixels,
      x: 5000,
      fromY: 300,
      toY: 0,
      playerForm: 'small',
    })

    expect(landingY).toBeNull()
  })

  it('picks the highest landing surface among overlapping candidates', () => {
    const lowerTile = { type: 'Solid', x: 1, y: 0 } // top = 64
    const higherTile = { type: 'Solid', x: 1, y: 2 } // top = (2*64)+64 = 192

    const landingY = getLandingYAtPosition({
      objects: [lowerTile, higherTile],
      pixels,
      x: 64,
      fromY: 400,
      toY: 0,
      playerForm: 'small',
    })

    expect(landingY).toBe(192)
  })
})

describe('hasSideCollisionAtPosition', () => {
  const wall = { type: 'Solid', x: 2, y: 0 } // world px x:128-192, y:0-64

  it('detects a side collision when overlapping the wall horizontally and vertically', () => {
    expect(hasSideCollisionAtPosition({
      objects: [wall],
      pixels,
      x: 90,
      y: 0,
      playerForm: 'small',
    })).toBe(true)
  })

  it('does not detect a side collision when vertically clear of the wall', () => {
    expect(hasSideCollisionAtPosition({
      objects: [wall],
      pixels,
      x: 90,
      y: 500,
      playerForm: 'small',
    })).toBe(false)
  })
})

describe('hasCeilingCollisionAtPosition', () => {
  const blockAbove = { type: 'Solid', x: 1, y: 2 } // world px x:64-128, y:128-192

  it('detects a ceiling hit when jumping into a solid block from below', () => {
    expect(hasCeilingCollisionAtPosition({
      objects: [blockAbove],
      pixels,
      x: 64,
      y: 100,
      playerForm: 'small',
    })).toBe(true)
  })

  it('ignores Floor-type objects even if geometrically overlapping', () => {
    expect(hasCeilingCollisionAtPosition({
      objects: [{ type: 'Floor', x: 1, y: 2 }],
      pixels,
      x: 64,
      y: 100,
      playerForm: 'small',
    })).toBe(false)
  })
})

describe('getMaxWalkXForObjects', () => {
  it('returns Infinity when there is no floor', () => {
    expect(getMaxWalkXForObjects({ objects: [], pixels, playerForm: 'small' })).toBe(Infinity)
  })

  it('caps walking at the end of the floor, accounting for player width', () => {
    const floor = { type: 'Floor', x: 0, y: 0, size: 10 } // floor end px = 10*64 = 640
    const maxWalkX = getMaxWalkXForObjects({ objects: [floor], pixels, playerForm: 'small' })

    // small player width == pixels (64); formula: floorEnd - (width - 20)
    expect(maxWalkX).toBe(640 - (64 - 20))
  })

  it('uses the widest floor end across multiple segments', () => {
    const floors = [
      { type: 'Floor', x: 0, y: 0, size: 5 },
      { type: 'Floor', x: 20, y: 0, size: 5 }, // ends at (20+5)*64 = 1600
    ]
    const maxWalkX = getMaxWalkXForObjects({ objects: floors, pixels, playerForm: 'small' })

    expect(maxWalkX).toBe(1600 - (64 - 20))
  })
})
