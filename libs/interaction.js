const getBlockVariant = obj => (obj.variant || obj.type || '').toLowerCase()

const isInteractiveBlock = obj => {
  if (typeof obj.interactive === 'boolean') return obj.interactive
  const variant = getBlockVariant(obj)
  return variant === 'mystery' || variant === 'brick'
}

const getBlockContent = obj => {
  if (obj.content) return obj.content
  const variant = getBlockVariant(obj)
  return variant === 'mystery' ? 'coin' : 'none'
}

const getRewardForHit = ({ obj, previousTouches }) => {
  const variant = getBlockVariant(obj)
  const content = getBlockContent(obj)
  const isFirstHit = previousTouches === 0

  if (variant === 'brick') {
    return { scoreDelta: 50, coinsDelta: 0, item: null }
  }

  if (variant === 'mystery') {
    if (!isFirstHit) return { scoreDelta: 0, coinsDelta: 0, item: null }

    if (content === 'coin') {
      return { scoreDelta: 200, coinsDelta: 1, item: 'coin' }
    }

    if (content === 'mushroom') {
      return { scoreDelta: 1000, coinsDelta: 0, item: 'mushroom' }
    }

    return { scoreDelta: 200, coinsDelta: 0, item: null }
  }

  return { scoreDelta: 0, coinsDelta: 0, item: null }
}

export const bumpInteractiveBlockAtPosition = ({ objects, pixels, x, y }) => {
  let bumped = false
  let reward = { scoreDelta: 0, coinsDelta: 0, item: null }

  const nextObjects = objects.map(obj => {
    if (bumped || obj.type === 'Floor' || !isInteractiveBlock(obj)) {
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
    const previousTouches = obj.touches || 0
    reward = getRewardForHit({ obj, previousTouches })
    return {
      ...obj,
      touches: previousTouches + 1,
    }
  })

  return { nextObjects, bumped, reward }
}
