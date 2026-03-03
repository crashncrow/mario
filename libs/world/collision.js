import { getObjectHeight, getObjectWidth } from 'libs/world/objectDimensions'
import { getPlayerBounds, getPlayerDimensions } from 'libs/playerDimensions'

const isSolidObject = obj => obj.type !== 'Coin'

export const hasCollisionAtPosition = ({ objects, pixels, x, y, playerForm }) => {
  const playerBounds = getPlayerBounds({ x, y, pixels, playerForm })

  return objects.some(obj => (
    isSolidObject(obj) &&
    playerBounds.left - 2 < obj.x * pixels + getObjectWidth(obj) &&
    playerBounds.right + 2 > obj.x * pixels &&
    y >= obj.y * pixels &&
    y <= obj.y * pixels + getObjectHeight(obj)
  ))
}

export const isGroundedAtPosition = ({ objects, pixels, x, y, playerForm }) => (
  hasCollisionAtPosition({ objects, pixels, x, y: Math.max(0, y - 2), playerForm })
)

export const getLandingYAtPosition = ({ objects, pixels, x, fromY, toY, playerForm }) => {
  let landingY = null
  const playerBounds = getPlayerBounds({ x, y: fromY, pixels, playerForm })

  objects.forEach(obj => {
    if (!isSolidObject(obj)) return

    const objLeft = obj.x * pixels
    const objRight = objLeft + getObjectWidth(obj)
    const objTop = (obj.y * pixels) + getObjectHeight(obj)

    const overlapsX =
      playerBounds.left - 2 < objRight &&
      playerBounds.right + 2 > objLeft

    if (!overlapsX) return

    if (objTop <= fromY && objTop >= toY) {
      landingY = landingY === null ? objTop : Math.max(landingY, objTop)
    }
  })

  return landingY
}

export const hasSideCollisionAtPosition = ({ objects, pixels, x, y, playerForm }) => {
  const marioBounds = getPlayerBounds({ x, y, pixels, playerForm })
  const marioLeft = marioBounds.left - 2
  const marioRight = marioBounds.right + 2
  const marioBottom = y + 2
  const marioTop = marioBounds.top - 2

  return objects.some(obj => {
    if (!isSolidObject(obj)) return false

    const objLeft = obj.x * pixels
    const objRight = objLeft + getObjectWidth(obj)
    const objBottom = obj.y * pixels
    const objTop = objBottom + getObjectHeight(obj)

    return (
      marioLeft < objRight &&
      marioRight > objLeft &&
      marioBottom < objTop &&
      marioTop > objBottom
    )
  })
}

export const hasCeilingCollisionAtPosition = ({ objects, pixels, x, y, playerForm }) => {
  const marioBounds = getPlayerBounds({ x, y, pixels, playerForm })
  const headBottom = marioBounds.top - 4
  const headTop = marioBounds.top

  return objects.some(obj => {
    if (obj.type === 'Floor' || !isSolidObject(obj)) return false

    const objLeft = obj.x * pixels
    const objRight = objLeft + getObjectWidth(obj)
    const objBottom = obj.y * pixels
    const objTop = objBottom + getObjectHeight(obj)

    return (
      marioBounds.left < objRight &&
      marioBounds.right > objLeft &&
      headBottom < objTop &&
      headTop > objBottom
    )
  })
}

export const getMaxWalkXForObjects = ({ objects, pixels, playerForm }) => {
  const floorSegments = objects.filter(obj => obj.type === 'Floor')
  if (floorSegments.length === 0) return Infinity
  const { width } = getPlayerDimensions({ pixels, playerForm })

  const floorEndPx = floorSegments.reduce((max, obj) => {
    const end = (obj.x * pixels) + getObjectWidth(obj)
    return Math.max(max, end)
  }, 0)

  return Math.max(0, floorEndPx - (width - 20))
}
