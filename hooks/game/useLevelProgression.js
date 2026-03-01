import { useEffect, useRef, useState } from 'react'
import { getLevelByIndex, getNextLevelIndex } from 'libs/levels'

const LEVEL_ADVANCE_DELAY_MS = 1500

export const useCurrentLevel = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0)
  const currentLevel = getLevelByIndex(currentLevelIndex)

  return {
    currentLevelIndex,
    currentLevel,
    setCurrentLevelIndex,
  }
}

export const useLevelAdvance = ({
  currentLevelIndex,
  gameStatus,
  onAdvanceLevel,
  setCurrentLevelIndex,
}) => {
  const levelAdvanceTimeoutRef = useRef(null)

  useEffect(() => {
    if (levelAdvanceTimeoutRef.current) {
      window.clearTimeout(levelAdvanceTimeoutRef.current)
      levelAdvanceTimeoutRef.current = null
    }

    if (gameStatus !== 'won') return

    const nextLevelIndex = getNextLevelIndex(currentLevelIndex)
    if (nextLevelIndex === null) return

    levelAdvanceTimeoutRef.current = window.setTimeout(() => {
      const nextLevel = getLevelByIndex(nextLevelIndex)
      setCurrentLevelIndex(nextLevelIndex)
      onAdvanceLevel(nextLevel)
    }, LEVEL_ADVANCE_DELAY_MS)

    return () => {
      if (levelAdvanceTimeoutRef.current) {
        window.clearTimeout(levelAdvanceTimeoutRef.current)
        levelAdvanceTimeoutRef.current = null
      }
    }
  }, [currentLevelIndex, gameStatus, onAdvanceLevel, setCurrentLevelIndex])
}
