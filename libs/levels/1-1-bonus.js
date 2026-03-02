import { normalizeLevelElements } from 'libs/levels/normalizeLevelElements'
import { normalizeLevelEnemies } from 'libs/levels/normalizeLevelEnemies'
import { TILE_SIZE } from 'libs/world/constants'

const elementsByType = {
  mystery: [
    // { x: 6, y: 4, content: 'coin' },
    // { x: 7, y: 4, content: 'coin' },
    // { x: 8, y: 4, content: 'coin' },
    // { x: 9, y: 4, content: 'coin' },
    // { x: 10, y: 4, content: 'coin' },
  ],

  brick: [
    { x: 0, y: 1 },
    { x: 0, y: 2 },
    { x: 0, y: 3 },
    { x: 0, y: 4 },
    { x: 0, y: 5 },
    { x: 0, y: 6 },
    { x: 0, y: 7 },
    { x: 0, y: 8 },
    { x: 0, y: 9 },
    { x: 0, y: 10 },
    { x: 0, y: 11 },

    { x: 4, y: 1 },
    { x: 5, y: 1 },
    { x: 6, y: 1 },
    { x: 7, y: 1 },
    { x: 8, y: 1 },
    { x: 9, y: 1 },
    { x: 10, y: 1 },

    { x: 4, y: 2 },
    { x: 5, y: 2 },
    { x: 6, y: 2 },
    { x: 7, y: 2 },
    { x: 8, y: 2 },
    { x: 9, y: 2 },
    { x: 10, y: 2 },

    { x: 4, y: 3 },
    { x: 5, y: 3 },
    { x: 6, y: 3 },
    { x: 7, y: 3 },
    { x: 8, y: 3 },
    { x: 9, y: 3 },
    { x: 10, y: 3 },

    { x: 4, y: 11 },
    { x: 5, y: 11 },
    { x: 6, y: 11 },
    { x: 7, y: 11 },
    { x: 8, y: 11 },
    { x: 9, y: 11 },
    { x: 10, y: 11 },
  ],
  pipe: [
    // { x: 1, y: 1, size: 3 },
    { x: 15, y: 1, size: 5 },
  ],
  floor: [
    { x: 0, y: 0, size: 18 },
  ],
}

const enemiesByType = {
  goomba: [],
  koopa: [],
  buzzy: [],
}

const level1_1_bonus = {
  id: '1-1-bonus',
  world: 1,
  stage: 1,
  label: '1 - 1 Bonus',
  type: 'sublevel',
  background: 'black',
  theme: 'underground',
  decorations: {
    clouds: [],
    mountains: [],
    plants: [],
  },
  elements: normalizeLevelElements(elementsByType),
  enemies: normalizeLevelEnemies(enemiesByType),
  spawns: {
    entry: { x: 2, y: 1 },
    exit: { x: 17, y: 1 },
  },
  transitions: [
    {
      type: 'pipe',
      x: 17,
      y: 1,
      direction: 'up',
      targetLevelId: '1-1',
      targetSpawnId: 'return-from-bonus',
      returnToParent: true,
    },
  ],
  startLeft: 2 * TILE_SIZE,
  startBottom: TILE_SIZE,
  initialTime: 400,
  flag: {
    x: 999,
    y: 2,
  },
  castle: {
    x: 1003,
  },
}

export default level1_1_bonus
