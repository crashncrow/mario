import { useCallback } from 'react'
import {
  bumpInteractiveBlockAtPosition,
  collectWorldCoinAtPosition,
  collectRevealedMysteryItemAtPosition,
} from 'libs/world/interaction'

export default function useBlockInteractions({
  objects,
  pixels,
  playerForm,
  mushroomSize,
  mushroomSpeed,
  setBrickBreaks,
  setObjects,
  setCoins,
  setScore,
  setMushrooms,
}) {
  const bumpInteractiveBlockAt = useCallback((x, y) => {
    const { nextObjects, bumped, reward, spawnedItem, brokenBrick } = bumpInteractiveBlockAtPosition({
      objects,
      pixels,
      x,
      y,
      playerForm,
    })

    if (!bumped) return

    setObjects(nextObjects)
    if (reward?.scoreDelta) setScore(prev => prev + reward.scoreDelta)
    if (reward?.coinsDelta) setCoins(prev => prev + reward.coinsDelta)

    if (brokenBrick) {
      const now = Date.now()
      setBrickBreaks(prev => ([
        ...prev,
        {
          id: `brick_break_${brokenBrick.x}_${brokenBrick.y}_${now}`,
          ...brokenBrick,
          expiresAt: now + 450,
        },
      ]))
    }

    if (spawnedItem?.type === 'mushroom' || spawnedItem?.type === 'flower') {
      setMushrooms(prev => ([
        ...prev,
        {
          id: `${spawnedItem.type}_${spawnedItem.x}_${spawnedItem.y}_${Date.now()}`,
          type: spawnedItem.type,
          x: spawnedItem.x * pixels,
          y: spawnedItem.y * pixels,
          emergeToY: (spawnedItem.y + 1) * pixels,
          phase: 'emerging',
          vx: spawnedItem.type === 'mushroom' ? mushroomSpeed : 0,
          vy: 0,
          width: mushroomSize,
          height: mushroomSize,
        },
      ]))
    }
  }, [mushroomSize, mushroomSpeed, objects, pixels, playerForm, setBrickBreaks, setCoins, setMushrooms, setObjects, setScore])

  const collectRevealedMysteryItemAt = useCallback((x, y) => {
    const { nextObjects, collected, reward } = collectRevealedMysteryItemAtPosition({
      objects,
      pixels,
      x,
      y,
      playerForm,
    })

    if (!collected) return

    setObjects(nextObjects)
    if (reward?.scoreDelta) setScore(prev => prev + reward.scoreDelta)
    if (reward?.coinsDelta) setCoins(prev => prev + reward.coinsDelta)
  }, [objects, pixels, playerForm, setCoins, setObjects, setScore])

  const collectWorldCoinAt = useCallback((x, y) => {
    const { nextObjects, collected, reward } = collectWorldCoinAtPosition({
      objects,
      pixels,
      x,
      y,
      playerForm,
    })

    if (!collected) return

    setObjects(nextObjects)
    if (reward?.scoreDelta) setScore(prev => prev + reward.scoreDelta)
    if (reward?.coinsDelta) setCoins(prev => prev + reward.coinsDelta)
  }, [objects, pixels, playerForm, setCoins, setObjects, setScore])

  return {
    bumpInteractiveBlockAt,
    collectRevealedMysteryItemAt,
    collectWorldCoinAt,
  }
}
