import useGameLoop from 'hooks/useGameLoop'

const MUSHROOM_SIZE = 64
const MUSHROOM_HORIZONTAL_SPEED = 300
const MUSHROOM_GRAVITY = 2600
const MUSHROOM_EMERGE_SPEED = 180

const overlapsX = (x, width, objLeft, objRight) => (
  x + 6 < objRight &&
  x + width - 6 > objLeft
)

const getLandingY = ({ objects, pixels, x, fromY, toY }) => {
  let landingY = null

  objects.forEach(obj => {
    const objLeft = obj.x * pixels
    const objRight = objLeft + obj.width
    const objTop = (obj.y * pixels) + obj.height

    if (!overlapsX(x, MUSHROOM_SIZE, objLeft, objRight)) return
    if (objTop <= fromY && objTop >= toY) {
      landingY = landingY === null ? objTop : Math.max(landingY, objTop)
    }
  })

  return landingY
}

const hasSideCollision = ({ objects, pixels, x, y }) => {
  const mushroomLeft = x + 6
  const mushroomRight = x + MUSHROOM_SIZE - 6
  // Use a narrower central band to avoid lateral bounces by top/bottom edge grazing.
  const mushroomBottom = y + 10
  const mushroomTop = y + MUSHROOM_SIZE - 10

  return objects.some(obj => {
    if (obj.type === 'Floor') return false

    const objLeft = obj.x * pixels
    const objRight = objLeft + obj.width
    const objBottom = obj.y * pixels
    const objTop = objBottom + obj.height

    return (
      mushroomLeft < objRight &&
      mushroomRight > objLeft &&
      mushroomBottom < objTop &&
      mushroomTop > objBottom
    )
  })
}

const collectByMario = ({ mushrooms, marioX, marioY, addScore }) => {
  const marioLeft = marioX + 12
  const marioRight = marioX + MUSHROOM_SIZE - 22
  const marioBottom = marioY
  const marioTop = marioY + MUSHROOM_SIZE

  let changed = false

  const next = mushrooms.filter(mushroom => {
    if (mushroom.phase === 'emerging') return true

    const itemLeft = mushroom.x + 6
    const itemRight = mushroom.x + MUSHROOM_SIZE - 6
    const itemBottom = mushroom.y + 2
    const itemTop = mushroom.y + MUSHROOM_SIZE - 2

    const overlaps =
      marioLeft < itemRight &&
      marioRight > itemLeft &&
      marioBottom < itemTop &&
      marioTop > itemBottom

    if (!overlaps) return true

    changed = true
    addScore(prev => prev + 1000)
    return false
  })

  return { next, changed }
}

export default function useMushroomPhysics({
  enabled,
  objects,
  pixels,
  marioLeft,
  marioBottom,
  mushroomsRef,
  setMushrooms,
  setScore,
}) {
  useGameLoop(dt => {
    if (!enabled || !Number.isFinite(dt) || dt <= 0) return

    const current = mushroomsRef.current
    if (!current.length) return

    const solidObjects = objects
      .filter(obj => obj.type !== 'Floor' || obj.y === 0 || obj.size > 0)

    let mutated = false
    const updated = current.map(mushroom => {
      if (mushroom.phase === 'emerging') {
        const targetY = mushroom.emergeToY ?? mushroom.y
        const nextY = Math.min(targetY, mushroom.y + (MUSHROOM_EMERGE_SPEED * dt))
        const emerged = nextY >= targetY

        if (nextY !== mushroom.y || emerged) {
          mutated = true
        }

        return {
          ...mushroom,
          y: nextY,
          phase: emerged ? 'active' : 'emerging',
          vy: 0,
        }
      }

      let nextX = mushroom.x
      let nextY = mushroom.y
      let nextVx = mushroom.vx
      let nextVy = mushroom.vy - (MUSHROOM_GRAVITY * dt)

      const targetY = Math.max(0, mushroom.y + (nextVy * dt))

      if (targetY < mushroom.y) {
        const landingY = getLandingY({
          objects: solidObjects,
          pixels,
          x: nextX,
          fromY: mushroom.y,
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

      const targetX = mushroom.x + (nextVx * dt)
      if (hasSideCollision({ objects: solidObjects, pixels, x: targetX, y: nextY })) {
        nextVx = -nextVx
      } else {
        nextX = targetX
      }

      if (
        nextX !== mushroom.x ||
        nextY !== mushroom.y ||
        nextVx !== mushroom.vx ||
        nextVy !== mushroom.vy
      ) {
        mutated = true
      }

      return {
        ...mushroom,
        x: nextX,
        y: nextY,
        vx: nextVx,
        vy: nextVy,
      }
    })

    const { next: collected, changed: collectedAny } = collectByMario({
      mushrooms: updated,
      marioX: marioLeft,
      marioY: marioBottom,
      addScore: setScore,
    })

    if (!mutated && !collectedAny) return

    mushroomsRef.current = collected
    setMushrooms(collected)
  }, enabled)
}

export { MUSHROOM_HORIZONTAL_SPEED, MUSHROOM_SIZE }
