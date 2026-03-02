import { useEffect, useRef, useState } from 'react'
import { getLevelById, getLevelIndexById, getLevelByIndex, getNextLevelIndex } from 'libs/levels'

const LEVEL_ADVANCE_DELAY_MS = 1500

export const useCurrentLevel = () => {
  const [currentLevelId, setCurrentLevelId] = useState('1-1')
  const currentLevel = getLevelById(currentLevelId)
  const currentLevelIndex = getLevelIndexById(currentLevelId)

  return {
    currentLevelId,
    currentLevelIndex,
    currentLevel,
    setCurrentLevelId,
  }
}

export const useLevelAdvance = ({
  currentLevelIndex,
  gameStatus,
  onAdvanceLevel,
  setCurrentLevelId,
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
      setCurrentLevelId(nextLevel.id)
      onAdvanceLevel(nextLevel)
    }, LEVEL_ADVANCE_DELAY_MS)

    return () => {
      if (levelAdvanceTimeoutRef.current) {
        window.clearTimeout(levelAdvanceTimeoutRef.current)
        levelAdvanceTimeoutRef.current = null
      }
    }
  }, [currentLevelIndex, gameStatus, onAdvanceLevel, setCurrentLevelId])
}
