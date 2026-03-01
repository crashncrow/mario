import { getEnemyTypeConfig } from 'libs/enemies/enemyTypes'
import { TILE_SIZE } from 'libs/world/constants'

export const createEnemyState = ({ enemy, index, id, pixels = TILE_SIZE }) => {
  const config = getEnemyTypeConfig(enemy.type)

  return {
    ...enemy,
    id: id ?? `${enemy.type}_${enemy.x}_${enemy.y}_${index}`,
    x: enemy.x * pixels,
    y: enemy.y * pixels,
    state: enemy.state ?? 'walk',
    width: enemy.width ?? config?.width ?? TILE_SIZE,
    height: enemy.height ?? config?.height ?? TILE_SIZE,
    vx: config?.speed ?? 0,
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
