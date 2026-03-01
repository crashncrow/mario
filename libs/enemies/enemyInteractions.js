import { getPlayerBounds } from 'libs/playerDimensions'

const STOMP_BAND_PX = 10

export const getMarioBounds = ({ x, y, pixels, playerForm }) => (
  getPlayerBounds({ x, y, pixels, playerForm })
)

export const getEnemyBounds = enemy => ({
  left: enemy.x + 6,
  right: enemy.x + enemy.width - 6,
  bottom: enemy.y + 2,
  top: enemy.y + enemy.height - 2,
})

export const hasBoundsOverlap = (a, b) => (
  a.left < b.right &&
  a.right > b.left &&
  a.bottom < b.top &&
  a.top > b.bottom
)

export const touchesEnemyTop = ({ marioBounds, previousMarioBottom, marioVy, enemyBounds }) => (
  marioVy <= 0 &&
  marioBounds.left < enemyBounds.right &&
  marioBounds.right > enemyBounds.left &&
  previousMarioBottom >= (enemyBounds.top - STOMP_BAND_PX) &&
  marioBounds.bottom <= (enemyBounds.top + STOMP_BAND_PX)
)

export const hasMarioEnemyContact = ({ marioX, marioY, pixels, playerForm, enemies }) => {
  const marioBounds = getMarioBounds({ x: marioX, y: marioY, pixels, playerForm })

  return enemies.some(enemy => {
    const enemyBounds = getEnemyBounds(enemy)

    return (
      hasBoundsOverlap(marioBounds, enemyBounds) ||
      (
        Math.abs(marioBounds.bottom - enemyBounds.top) <= STOMP_BAND_PX &&
        marioBounds.left < enemyBounds.right &&
        marioBounds.right > enemyBounds.left
      )
    )
  })
}

export const resolveMarioEnemyCollision = ({
  marioX,
  marioY,
  previousMarioY,
  marioVy,
  pixels,
  playerForm,
  enemies,
  getEnemyTypeConfig,
  now = Date.now(),
}) => {
  const marioBounds = getMarioBounds({ x: marioX, y: marioY, pixels, playerForm })
  const previousMarioBottom = previousMarioY
  const marioCenterX = (marioBounds.left + marioBounds.right) / 2

  let hitEnemy = false
  let stomped = false
  let nextVy = marioVy
  let nextY = marioY
  let nextEnemies = enemies
  let scoreDelta = 0

  for (let i = 0; i < enemies.length; i += 1) {
    const enemy = enemies[i]
    const enemyConfig = getEnemyTypeConfig(enemy.type)
    const enemyBounds = getEnemyBounds(enemy)
    const overlaps = hasBoundsOverlap(marioBounds, enemyBounds)
    const stompedEnemy = touchesEnemyTop({
      marioBounds,
      previousMarioBottom,
      marioVy,
      enemyBounds,
    })

    if (!overlaps && !stompedEnemy) continue

    const isShellEnemy = enemyConfig?.shellLike === true

    if (isShellEnemy && (enemy.state === 'shell' || enemy.state === 'shell-moving')) {
      if (enemy.state === 'shell-moving' && stompedEnemy) {
        nextEnemies = enemies.map(item => (
          item.id === enemy.id
            ? { ...item, state: 'shell', vx: 0 }
            : item
        ))
        stomped = true
        nextVy = 900
        nextY = enemyBounds.top
        break
      }

      if (enemy.state === 'shell-moving') {
        hitEnemy = true
        break
      }

      const enemyCenterX = (enemyBounds.left + enemyBounds.right) / 2
      const direction = marioCenterX < enemyCenterX ? 1 : -1
      nextEnemies = enemies.map(item => (
        item.id === enemy.id
          ? { ...item, state: 'shell-moving', vx: (enemyConfig?.shellSpeed ?? 480) * direction }
          : item
      ))
      stomped = stompedEnemy
      if (stompedEnemy) {
        nextVy = 900
        nextY = enemyBounds.top
      }
    } else if (stompedEnemy && enemyConfig?.stompable) {
      stomped = true
      nextVy = 900
      nextY = enemyBounds.top
      if (isShellEnemy) {
        nextEnemies = enemies.map(item => (
          item.id === enemy.id
            ? { ...item, state: 'shell', vx: 0 }
            : item
        ))
      } else {
        nextEnemies = enemies.map(item => (
          item.id === enemy.id
            ? { ...item, state: 'dead', deadAt: now, vx: 0, vy: 0 }
            : item
        ))
      }
      scoreDelta += enemyConfig?.score ?? 0
    } else {
      hitEnemy = true
    }
    break
  }

  return {
    hitEnemy,
    stomped,
    nextVy,
    nextY,
    nextEnemies,
    scoreDelta,
    enemiesChanged: nextEnemies !== enemies,
  }
}
