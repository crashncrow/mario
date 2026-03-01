import { getEnemyTypeConfig } from 'libs/enemies/enemyTypes'
import { TILE_SIZE } from 'libs/world/constants'

const getDirectionMultiplier = direction => {
  if (direction === 'left' || direction === -1) return -1
  if (direction === 'right' || direction === 1) return 1
  return 1
}

export const createEnemyState = ({ enemy, index, id, pixels = TILE_SIZE }) => {
  const config = getEnemyTypeConfig(enemy.type)
  const directionMultiplier = getDirectionMultiplier(enemy.direction)

  return {
    ...enemy,
    id: id ?? `${enemy.type}_${enemy.x}_${enemy.y}_${index}`,
    x: enemy.x * pixels,
    y: enemy.y * pixels,
    state: enemy.state ?? 'walk',
    width: enemy.width ?? config?.width ?? TILE_SIZE,
    height: enemy.height ?? config?.height ?? TILE_SIZE,
    vx: (config?.speed ?? 0) * directionMultiplier,
    vy: 0,
    gravity: config?.gravity ?? 2600,
  }
}

export const createEnemiesState = ({ enemies, pixels = TILE_SIZE, createId }) => (
  enemies.map((enemy, index) => createEnemyState({
    enemy,
    index,
    id: createId ? createId(enemy, index) : undefined,
    pixels,
  }))
)
