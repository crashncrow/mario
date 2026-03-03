import { useCallback, useEffect } from 'react'
import { createEnemiesState } from 'libs/enemies/createEnemyState'
import { getLevelById } from 'libs/levels'
import { createLevelObjectsState } from 'libs/levels/createLevelState'

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
  playPipeExitAnimation,
}) {
  const getLevelSpawn = useCallback((level, spawnId) => {
    if (spawnId && level.spawns?.[spawnId]) {
      return level.spawns[spawnId]
    }

    if (level.spawns?.start) {
      return level.spawns.start
    }

    return {
      x: level.startLeft / pixels,
      y: level.startBottom / pixels,
    }
  }, [pixels])

  const createInitialEnemies = useCallback(level => (
    createEnemiesState({
      enemies: level.enemies,
      pixels,
      createId: (_, index) => `enemy_init_${index}`,
    })
  ), [pixels])

  const resetLevelState = useCallback((levelOrId, options = {}) => {
    const { resetPlayerForm = false, spawnId = null, showIntro = true, pipeExitDirection = null } = options
    const level = typeof levelOrId === 'string' ? getLevelById(levelOrId) : levelOrId
    if (!level) return
    const nextEnemies = createInitialEnemies(level)
    const nextObjects = createLevelObjectsState(level)
    const spawn = getLevelSpawn(level, spawnId)
    const spawnLeft = spawn.x * pixels
    const spawnBottom = spawn.y * pixels

    setObjects(nextObjects)
    setMushrooms([])
    setBrickBreaks([])
    setEnemies(nextEnemies)
    setLeftSafe(spawnLeft)
    setBottomSafe(spawnBottom)
    setEnemyHit(false)
    if (resetPlayerForm) {
      setPlayerForm('small')
    }
    playerDamageCooldownRef.current = 0
    if (showIntro) {
      startLevelIntro()
    } else if (pipeExitDirection) {
      playPipeExitAnimation(pipeExitDirection)
    }

    mushroomsRef.current = []
    enemiesRef.current = nextEnemies

    motionRef.current.x = spawnLeft
    motionRef.current.y = spawnBottom
    motionRef.current.vx = 0
    motionRef.current.vy = 0
    motionRef.current.grounded = true
    motionRef.current.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
    }
    motionRef.current.jumpHeld = false
    motionRef.current.coyoteTimer = 0
    motionRef.current.jumpBufferTimer = 0
    motionRef.current.headBlockedLastFrame = false

    lastPositionRef.current = {
      x: spawnLeft,
      y: spawnBottom,
    }
    publishPendingRef.current = false
  }, [
    createInitialEnemies,
    enemiesRef,
    getLevelSpawn,
    lastPositionRef,
    motionRef,
    mushroomsRef,
    pixels,
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
    playPipeExitAnimation,
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
