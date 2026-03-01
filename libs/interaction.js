import { getObjectHeight, getObjectWidth } from 'libs/objectDimensions'

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
    return { scoreDelta: 0, coinsDelta: 0, item: null }
  }

  if (variant === 'mystery') {
    if (!isFirstHit) return { scoreDelta: 0, coinsDelta: 0, item: null }

    if (content === 'coin') {
      return { scoreDelta: 200, coinsDelta: 1, item: 'coin' }
    }

    // Non-coin mystery rewards are granted on pickup, not on bump.
    return { scoreDelta: 0, coinsDelta: 0, item: null }
  }

  return { scoreDelta: 0, coinsDelta: 0, item: null }
}

const getRewardForPickup = content => {
  const normalized = (content || '').toLowerCase()

  if (normalized === 'flower') {
    return { scoreDelta: 1000, coinsDelta: 0, item: 'flower' }
  }

  if (normalized === 'star') {
    return { scoreDelta: 1000, coinsDelta: 0, item: 'star' }
  }

  return { scoreDelta: 0, coinsDelta: 0, item: null }
}

export const bumpInteractiveBlockAtPosition = ({ objects, pixels, x, y }) => {
  let bumped = false
  let reward = { scoreDelta: 0, coinsDelta: 0, item: null }
  let spawnedItem = null

  const nextObjects = objects.map(obj => {
    if (bumped || obj.type === 'Floor' || !isInteractiveBlock(obj)) {
      return obj
    }

    const objLeft = obj.x * pixels
    const objRight = objLeft + getObjectWidth(obj)
    const objBottom = obj.y * pixels
    const objTop = objBottom + getObjectHeight(obj)

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

    const isFirstHit = previousTouches === 0
    const variant = getBlockVariant(obj)
    const content = getBlockContent(obj).toLowerCase()
    if (isFirstHit && variant === 'mystery' && content === 'mushroom') {
      spawnedItem = {
        type: 'mushroom',
        x: obj.x,
        y: obj.y,
      }
    }

    return {
      ...obj,
      touches: previousTouches + 1,
    }
  })

  return { nextObjects, bumped, reward, spawnedItem }
}
export const collectRevealedMysteryItemAtPosition = ({ objects, pixels, x, y }) => {
  let collected = false
  let reward = { scoreDelta: 0, coinsDelta: 0, item: null }

  const marioLeft = x + 12
  const marioRight = x + pixels - 22
  const marioBottom = y
  const marioTop = y + pixels

  const nextObjects = objects.map(obj => {
    if (collected || getBlockVariant(obj) !== 'mystery') return obj

    const content = getBlockContent(obj)
    const normalizedContent = (content || '').toLowerCase()
    const hasPickup = normalizedContent === 'flower' || normalizedContent === 'star'
    const touched = (obj.touches || 0) > 0
    const alreadyCollected = Boolean(obj.itemCollected)

    if (!hasPickup || !touched || alreadyCollected) return obj

    const itemLeft = obj.x * pixels
    const itemRight = itemLeft + pixels
    const itemBottom = (obj.y + 1) * pixels
    const itemTop = itemBottom + pixels

    const overlaps =
      marioLeft < itemRight &&
      marioRight > itemLeft &&
      marioBottom < itemTop &&
      marioTop > itemBottom

    if (!overlaps) return obj

    collected = true
    reward = getRewardForPickup(content)
    return {
      ...obj,
      itemCollected: true,
    }
  })

  return { nextObjects, collected, reward }
}
