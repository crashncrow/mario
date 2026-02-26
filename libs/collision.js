export const hasCollisionAtPosition = ({ objects, pixels, x, y }) => (
  objects.some(obj => (
    x + 10 < obj.x * pixels + obj.width &&
    x + pixels - 20 > obj.x * pixels &&
    y >= obj.y * pixels &&
    y <= obj.y * pixels + obj.height
  ))
)

export const isGroundedAtPosition = ({ objects, pixels, x, y }) => (
  hasCollisionAtPosition({ objects, pixels, x, y: Math.max(0, y - 2) })
)

export const getLandingYAtPosition = ({ objects, pixels, x, fromY, toY }) => {
  let landingY = null

  objects.forEach(obj => {
    const objLeft = obj.x * pixels
    const objRight = objLeft + obj.width
    const objTop = (obj.y * pixels) + obj.height

    const overlapsX =
      x + 10 < objRight &&
      x + pixels - 20 > objLeft

    if (!overlapsX) return

    if (objTop <= fromY && objTop >= toY) {
      landingY = landingY === null ? objTop : Math.max(landingY, objTop)
    }
  })

  return landingY
}

export const hasSideCollisionAtPosition = ({ objects, pixels, x, y }) => {
  const marioLeft = x + 10
  const marioRight = x + pixels - 20
  const marioBottom = y + 2
  const marioTop = y + pixels - 2

  return objects.some(obj => {
    const objLeft = obj.x * pixels
    const objRight = objLeft + obj.width
    const objBottom = obj.y * pixels
    const objTop = objBottom + obj.height

    return (
      marioLeft < objRight &&
      marioRight > objLeft &&
      marioBottom < objTop &&
      marioTop > objBottom
    )
  })
}

export const hasCeilingCollisionAtPosition = ({ objects, pixels, x, y }) => {
  const marioLeft = x + 12
  const marioRight = x + pixels - 22
  const headBottom = y + pixels - 4
  const headTop = y + pixels

  return objects.some(obj => {
    if (obj.type === 'Floor') return false

    const objLeft = obj.x * pixels
    const objRight = objLeft + obj.width
    const objBottom = obj.y * pixels
    const objTop = objBottom + obj.height

    return (
      marioLeft < objRight &&
      marioRight > objLeft &&
      headBottom < objTop &&
      headTop > objBottom
    )
  })
}

export const getMaxWalkXForObjects = ({ objects, pixels }) => {
  const floorSegments = objects.filter(obj => obj.type === 'Floor')
  if (floorSegments.length === 0) return Infinity

  const floorEndPx = floorSegments.reduce((max, obj) => {
    const end = (obj.x * pixels) + obj.width
    return Math.max(max, end)
  }, 0)

  return Math.max(0, floorEndPx - (pixels - 20))
}
