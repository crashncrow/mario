import { TILE_SIZE } from 'libs/worldConstants'

export const getObjectWidth = obj => {
  if (typeof obj.width === 'number') return obj.width
  if (obj.type === 'Floor') return (obj.size ?? 1) * TILE_SIZE
  if (obj.type === 'Pipe') return TILE_SIZE * 2
  return TILE_SIZE
}

export const getObjectHeight = obj => {
  if (typeof obj.height === 'number') return obj.height
  if (obj.type === 'Pipe') return ((obj.size ?? 1) + 1) * TILE_SIZE
  if (obj.type === 'Floor') return TILE_SIZE
  return TILE_SIZE
}
