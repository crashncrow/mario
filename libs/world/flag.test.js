import { describe, expect, it } from 'vitest'
import { FLAG_HEIGHT_PX, FLAG_OFFSET_X_PX, FLAG_WIDTH_PX, getFlagBounds } from 'libs/world/flag'

describe('getFlagBounds', () => {
  it('positions the flag box relative to its tile with the fixed offset/size', () => {
    const pixels = 64
    const bounds = getFlagBounds({ x: 10, y: 1, pixels })

    expect(bounds).toEqual({
      left: (10 * pixels) + FLAG_OFFSET_X_PX,
      right: (10 * pixels) + FLAG_OFFSET_X_PX + FLAG_WIDTH_PX,
      bottom: 1 * pixels,
      top: (1 * pixels) + FLAG_HEIGHT_PX,
    })
  })

  it('anchors to world origin when x/y are 0', () => {
    const bounds = getFlagBounds({ x: 0, y: 0, pixels: 64 })

    expect(bounds.left).toBe(FLAG_OFFSET_X_PX)
    expect(bounds.right).toBe(FLAG_OFFSET_X_PX + FLAG_WIDTH_PX)
    expect(bounds.bottom).toBe(0)
    expect(bounds.top).toBe(FLAG_HEIGHT_PX)
  })
})
