import useGameLoop from 'hooks/useGameLoop'
import { getEnemyTypeConfig } from 'libs/enemyTypes'
import { getEnemyBounds, hasBoundsOverlap } from 'libs/enemyInteractions'

const ENEMY_GRAVITY = 2600
const ENEMY_SIDE_INSET_X = 6
const ENEMY_SIDE_INSET_Y = 10
const ENEMY_DEAD_LIFETIME_MS = 250

const overlapsX = (entity, objLeft, objRight) => (
  entity.x + ENEMY_SIDE_INSET_X < objRight &&
  entity.x + entity.width - ENEMY_SIDE_INSET_X > objLeft
)

const getLandingY = ({ objects, pixels, entity, fromY, toY }) => {
  let landingY = null

  objects.forEach(obj => {
    const objLeft = obj.x * pixels
    const objRight = objLeft + obj.width
    const objTop = (obj.y * pixels) + obj.height

    if (!overlapsX(entity, objLeft, objRight)) return
    if (objTop <= fromY && objTop >= toY) {
      landingY = landingY === null ? objTop : Math.max(landingY, objTop)
    }
  })

  return landingY
}

const hasSideCollision = ({ objects, pixels, entity, x, y }) => {
  const entityLeft = x + ENEMY_SIDE_INSET_X
  const entityRight = x + entity.width - ENEMY_SIDE_INSET_X
  const entityBottom = y + ENEMY_SIDE_INSET_Y
  const entityTop = y + entity.height - ENEMY_SIDE_INSET_Y

  return objects.some(obj => {
    if (obj.type === 'Floor') return false

    const objLeft = obj.x * pixels
    const objRight = objLeft + obj.width
    const objBottom = obj.y * pixels
    const objTop = objBottom + obj.height

    return (
      entityLeft < objRight &&
      entityRight > objLeft &&
      entityBottom < objTop &&
      entityTop > objBottom
    )
  })
}

export default function useEnemyPhysics({
  enabled,
  objects,
  pixels,
  enemiesRef,
  setEnemies,
  setScore,
}) {
  useGameLoop(dt => {
    if (!enabled || !Number.isFinite(dt) || dt <= 0) return

    const current = enemiesRef.current
    if (!current.length) return

    const solidObjects = objects
      .filter(obj => obj.type !== 'Floor' || obj.y === 0 || obj.size > 0)

    let mutated = false
    const updated = current.map(enemy => {
      if (enemy.state === 'dead') return enemy

      let nextX = enemy.x
      let nextY = enemy.y
      let nextVx = enemy.vx
      let nextVy = enemy.vy - ((enemy.gravity ?? ENEMY_GRAVITY) * dt)

      const targetY = Math.max(0, enemy.y + (nextVy * dt))

      if (targetY < enemy.y) {
        const landingY = getLandingY({
          objects: solidObjects,
          pixels,
          entity: enemy,
          fromY: enemy.y,
          toY: targetY,
        })

        if (landingY !== null) {
          nextY = landingY
          nextVy = 0
        } else {
          nextY = targetY
        }
      } else {
        nextY = targetY
      }

      const targetX = enemy.x + (nextVx * dt)
      if (hasSideCollision({ objects: solidObjects, pixels, entity: enemy, x: targetX, y: nextY })) {
        nextVx = -nextVx
      } else {
        nextX = targetX
      }

      if (
        nextX !== enemy.x ||
        nextY !== enemy.y ||
        nextVx !== enemy.vx ||
        nextVy !== enemy.vy
      ) {
        mutated = true
      }

      return {
        ...enemy,
        x: nextX,
        y: nextY,
        vx: nextVx,
        vy: nextVy,
      }
    })

    let nextEnemies = updated
    const movingShells = updated.filter(enemy => enemy.state === 'shell-moving')

    if (movingShells.length > 0) {
      const removedIds = new Set()
      let scoreDelta = 0

      movingShells.forEach(shell => {
        const shellBounds = getEnemyBounds(shell)

        updated.forEach(enemy => {
          if (enemy.id === shell.id || removedIds.has(enemy.id)) return

          const enemyBounds = getEnemyBounds(enemy)
          if (!hasBoundsOverlap(shellBounds, enemyBounds)) return

          removedIds.add(enemy.id)
          scoreDelta += getEnemyTypeConfig(enemy.type)?.score ?? 0
        })
      })

      if (removedIds.size > 0) {
        nextEnemies = updated.map(enemy => (
          removedIds.has(enemy.id)
            ? { ...enemy, state: 'dead', deadAt: Date.now(), vx: 0, vy: 0 }
            : enemy
        ))
        mutated = true
        if (scoreDelta > 0) {
          setScore(prev => prev + scoreDelta)
        }
      }
    }

    const now = Date.now()
    const aliveEnemies = nextEnemies.filter(enemy => (
      enemy.state !== 'dead' ||
      !enemy.deadAt ||
      now - enemy.deadAt < ENEMY_DEAD_LIFETIME_MS
    ))
    if (aliveEnemies.length !== nextEnemies.length) {
      nextEnemies = aliveEnemies
      mutated = true
    }

    if (!mutated) return

    enemiesRef.current = nextEnemies
    setEnemies(nextEnemies)
  }, enabled)
}

export const DEFAULT_ENEMY_GRAVITY = ENEMY_GRAVITY
