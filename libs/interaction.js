export const bumpInteractiveBlockAtPosition = ({ objects, pixels, x, y }) => {
  let bumped = false

  const nextObjects = objects.map(obj => {
    const isInteractive = obj.type === 'Box' || obj.type === 'Brick'

    if (bumped || obj.type === 'Floor' || !isInteractive) {
      return obj
    }

    const objLeft = obj.x * pixels
    const objRight = objLeft + obj.width
    const objBottom = obj.y * pixels
    const objTop = objBottom + obj.height

    const marioLeft = x + 12
    const marioRight = x + pixels - 22
    const headBottom = y + pixels - 4
    const headTop = y + pixels

    const hit =
      marioLeft < objRight &&
      marioRight > objLeft &&
      headBottom < objTop &&
      headTop > objBottom

    if (!hit) return obj

    bumped = true
    return {
      ...obj,
      touches: (obj.touches || 0) + 1,
    }
  })

  return { nextObjects, bumped }
}
