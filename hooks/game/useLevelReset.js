import { useCallback, useEffect } from 'react'
import { createEnemiesState } from 'libs/enemies/createEnemyState'

const RESPAWN_DELAY_MS = 1200

export default function useLevelReset({
  currentLevel,
  gameStatus,
  lives,
  pixels,
  setLives,
  setObjects,
  setMushrooms,
  setBrickBreaks,
  setEnemies,
  setEnemyHit,
  setPlayerForm,
  startLevelIntro,
  setLeftSafe,
  setBottomSafe,
  motionRef,
  lastPositionRef,
  publishPendingRef,
  mushroomsRef,
  enemiesRef,
  playerDamageCooldownRef,
  lastGameStatusRef,
}) {
  const createInitialEnemies = useCallback(level => (
    createEnemiesState({
      enemies: level.enemies,
      pixels,
      createId: (_, index) => `enemy_init_${index}`,
    })
  ), [pixels])

  const resetLevelState = useCallback((level, options = {}) => {
    const { resetPlayerForm = false } = options
    const nextEnemies = createInitialEnemies(level)

    setObjects(level.elements)
    setMushrooms([])
    setBrickBreaks([])
    setEnemies(nextEnemies)
    setLeftSafe(level.startLeft)
    setBottomSafe(level.startBottom)
    setEnemyHit(false)
    if (resetPlayerForm) {
      setPlayerForm('small')
    }
    playerDamageCooldownRef.current = 0
    startLevelIntro()

    mushroomsRef.current = []
    enemiesRef.current = nextEnemies

    motionRef.current.x = level.startLeft
    motionRef.current.y = level.startBottom
    motionRef.current.vx = 0
    motionRef.current.vy = 0
    motionRef.current.grounded = true
    motionRef.current.input = {
      left: false,
      right: false,
      jump: false,
    }
    motionRef.current.jumpHeld = false
    motionRef.current.coyoteTimer = 0
    motionRef.current.jumpBufferTimer = 0
    motionRef.current.headBlockedLastFrame = false

    lastPositionRef.current = {
      x: level.startLeft,
      y: level.startBottom,
    }
    publishPendingRef.current = false
  }, [
    createInitialEnemies,
    enemiesRef,
    lastPositionRef,
    motionRef,
    mushroomsRef,
    publishPendingRef,
    playerDamageCooldownRef,
    setBottomSafe,
    setBrickBreaks,
    setEnemies,
    setEnemyHit,
    setLeftSafe,
    setMushrooms,
    setObjects,
    setPlayerForm,
    startLevelIntro,
  ])

  useEffect(() => {
    if (gameStatus === 'lost' && lastGameStatusRef.current !== 'lost') {
      const rafId = window.requestAnimationFrame(() => {
        if (lives > 1) {
          setLives(prev => Math.max(0, prev - 1))
          window.setTimeout(() => {
            resetLevelState(currentLevel, { resetPlayerForm: true })
          }, RESPAWN_DELAY_MS)
          return
        }

        setLives(0)
      })
      lastGameStatusRef.current = gameStatus
      return () => window.cancelAnimationFrame(rafId)
    }

    lastGameStatusRef.current = gameStatus
  }, [currentLevel, gameStatus, lastGameStatusRef, lives, resetLevelState, setLives])

  return {
    resetLevelState,
  }
}
