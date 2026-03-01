import { useCallback } from 'react'
import {
  bumpInteractiveBlockAtPosition,
  collectRevealedMysteryItemAtPosition,
} from 'libs/world/interaction'

export default function useBlockInteractions({
  objects,
  pixels,
  mushroomSize,
  mushroomSpeed,
  setObjects,
  setCoins,
  setScore,
  setMushrooms,
}) {
  const bumpInteractiveBlockAt = useCallback((x, y) => {
    const { nextObjects, bumped, reward, spawnedItem } = bumpInteractiveBlockAtPosition({ objects, pixels, x, y })

    if (!bumped) return

    setObjects(nextObjects)
    if (reward?.scoreDelta) setScore(prev => prev + reward.scoreDelta)
    if (reward?.coinsDelta) setCoins(prev => prev + reward.coinsDelta)

    if (spawnedItem?.type === 'mushroom') {
      setMushrooms(prev => ([
        ...prev,
        {
          id: `mushroom_${spawnedItem.x}_${spawnedItem.y}_${Date.now()}`,
          x: spawnedItem.x * pixels,
          y: spawnedItem.y * pixels,
          emergeToY: (spawnedItem.y + 1) * pixels,
          phase: 'emerging',
          vx: mushroomSpeed,
          vy: 0,
          width: mushroomSize,
          height: mushroomSize,
        },
      ]))
    }
  }, [mushroomSize, mushroomSpeed, objects, pixels, setCoins, setMushrooms, setObjects, setScore])

  const collectRevealedMysteryItemAt = useCallback((x, y) => {
    const { nextObjects, collected, reward } = collectRevealedMysteryItemAtPosition({
      objects,
      pixels,
      x,
      y,
    })

    if (!collected) return

    setObjects(nextObjects)
    if (reward?.scoreDelta) setScore(prev => prev + reward.scoreDelta)
    if (reward?.coinsDelta) setCoins(prev => prev + reward.coinsDelta)
  }, [objects, pixels, setCoins, setObjects, setScore])

  return {
    bumpInteractiveBlockAt,
    collectRevealedMysteryItemAt,
  }
}
