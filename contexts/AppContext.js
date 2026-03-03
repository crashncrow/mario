import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useWindowDimensions } from 'hooks/shared/window'
import useMarioPhysics from 'hooks/world/useMarioPhysics'
import useBlockInteractions from 'hooks/world/useBlockInteractions'
import useLevelTransitions from 'hooks/world/useLevelTransitions'
import useMushroomPhysics, { MUSHROOM_HORIZONTAL_SPEED, MUSHROOM_SIZE } from 'hooks/world/useMushroomPhysics'
import useEnemyPhysics from 'hooks/enemies/useEnemyPhysics'
import useEnemyState from 'hooks/enemies/useEnemyState'
import useGameSession from 'hooks/game/useGameSession'
import useLevelReset from 'hooks/game/useLevelReset'
import { useCurrentLevel, useLevelAdvance } from 'hooks/game/useLevelProgression'
import { createEnemiesState } from 'libs/enemies/createEnemyState'
import { createLevelObjectsState } from 'libs/levels/createLevelState'
import { getLevelById } from 'libs/levels'
import {
  getLandingYAtPosition,
  getMaxWalkXForObjects,
  hasCeilingCollisionAtPosition,
  hasCollisionAtPosition,
  hasSideCollisionAtPosition,
  isGroundedAtPosition,
} from 'libs/world/collision'
import {
  hasMarioEnemyContact,
} from 'libs/enemies/enemyInteractions'
import { TILE_SIZE } from 'libs/world/constants'
import {
  PIPE_TRANSITION_DURATION_MS,
  getPipeExitStartOffset,
} from 'libs/world/pipeTransition'

const AppContext = createContext(null)
const pixels = TILE_SIZE
const LEVEL_INTRO_MS = 1800

export const AppContextProvider = ({ children }) => {
  const { width } = useWindowDimensions();
  const debugEnabled = process.env.NEXT_PUBLIC_DEBUG === '1'
  const nextEnemyIdRef = useRef(0)
  const playerDamageCooldownRef = useRef(0)
  const lastGameStatusRef = useRef('playing')
  const createEnemyId = useCallback(
    () => `enemy_${nextEnemyIdRef.current++}`,
    []
  )
  const {
    currentLevelId,
    currentLevelIndex,
    currentLevel,
    setCurrentLevelId,
  } = useCurrentLevel()

  const [ objects, setObjects ] = useState(() => createLevelObjectsState(currentLevel))
  const [ mushrooms, setMushrooms ] = useState([])
  const [ brickBreaks, setBrickBreaks ] = useState([])
  const [ enemies, setEnemies ] = useState(() => createEnemiesState({
    enemies: currentLevel.enemies,
    pixels,
    createId: (_, index) => `enemy_init_${index}`,
  }))

  const [ left, setLeft ] = useState(currentLevel.startLeft)
  const [ bottom, setBottom ] = useState(currentLevel.startBottom)
  const [ playerForm, setPlayerForm ] = useState('small')
  const [ lives, setLives ] = useState(3)
  const [ coins, setCoins ] = useState(0)
  const [ score, setScore ] = useState(0)
  const [ enemyHit, setEnemyHit ] = useState(false)
  
  const [ gameLoopEnabled, setGameLoopEnabled ] = useState(true)
  const [ isPaused, setIsPaused ] = useState(false)
  const [ isLevelIntroVisible, setIsLevelIntroVisible ] = useState(true)
  const [ pipeTransition, setPipeTransition ] = useState({
    active: false,
    direction: null,
    translateX: 0,
    translateY: 0,
  })
  const renderLimit = left + (width ?? 0) + 500

  const stateRef = useRef({
    left,
    bottom,
    width,
    renderLimit,
  })

  const motionRef = useRef({
    x: left,
    y: bottom,
    vx: 0,
    vy: 0,
    grounded: false,
    facing: 1,
    frame: 0,
    dt: 0,
    now: 0,
    input: {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
    },
    jumpHeld: false,
    coyoteTimer: 0,
    jumpBufferTimer: 0,
    headBlockedLastFrame: false,
  })
  const lastPositionRef = useRef({
    x: left,
    y: bottom,
  })
  const publishPendingRef = useRef(false)
  const mushroomsRef = useRef(mushrooms)
  const enemiesRef = useRef(enemies)
  const levelIntroTimeoutRef = useRef(null)
  const levelSnapshotRef = useRef(null)
  const pipeExitAnimationRef = useRef(null)

  useEffect(() => {
    stateRef.current = {
      left,
      bottom,
      width,
      renderLimit,
    }
  }, [left, bottom, width, renderLimit])

  useEffect(() => {
    publishPendingRef.current = false
  }, [left, bottom])

  useEffect(() => {
    mushroomsRef.current = mushrooms
  }, [mushrooms])

  useEffect(() => {
    if (brickBreaks.length === 0) return

    const timeoutId = window.setTimeout(() => {
      const now = Date.now()
      setBrickBreaks(prev => prev.filter(effect => effect.expiresAt > now))
    }, 450)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [brickBreaks])

  useEffect(() => {
    enemiesRef.current = enemies
  }, [enemies])

  const clearLoopInput = useCallback(() => {
    motionRef.current.input = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false,
    }
    motionRef.current.jumpHeld = false
    motionRef.current.vx = 0
    motionRef.current.vy = 0
  }, [])

  const startLevelIntro = useCallback(() => {
    if (levelIntroTimeoutRef.current) {
      window.clearTimeout(levelIntroTimeoutRef.current)
      levelIntroTimeoutRef.current = null
    }

    setIsLevelIntroVisible(true)
    clearLoopInput()
    levelIntroTimeoutRef.current = window.setTimeout(() => {
      setIsLevelIntroVisible(false)
      levelIntroTimeoutRef.current = null
    }, LEVEL_INTRO_MS)
  }, [clearLoopInput])

  const playPipeExitAnimation = useCallback(direction => {
    if (!direction) return

    if (pipeExitAnimationRef.current) {
      window.cancelAnimationFrame(pipeExitAnimationRef.current)
      pipeExitAnimationRef.current = null
    }

    const startOffset = getPipeExitStartOffset(direction)
    setPipeTransition({
      active: true,
      direction,
      translateX: startOffset.x,
      translateY: startOffset.y,
    })

    const start = performance.now()
    const step = now => {
      const progress = Math.min(1, (now - start) / PIPE_TRANSITION_DURATION_MS)
      setPipeTransition({
        active: true,
        direction,
        translateX: Math.round(startOffset.x * (1 - progress)),
        translateY: Math.round(startOffset.y * (1 - progress)),
      })

      if (progress < 1) {
        pipeExitAnimationRef.current = window.requestAnimationFrame(step)
        return
      }

      setPipeTransition({
        active: false,
        direction: null,
        translateX: 0,
        translateY: 0,
      })
      pipeExitAnimationRef.current = null
    }

    pipeExitAnimationRef.current = window.requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    levelIntroTimeoutRef.current = window.setTimeout(() => {
      setIsLevelIntroVisible(false)
      levelIntroTimeoutRef.current = null
    }, LEVEL_INTRO_MS)

    return () => {
      if (levelIntroTimeoutRef.current) {
        window.clearTimeout(levelIntroTimeoutRef.current)
        levelIntroTimeoutRef.current = null
      }
    }
  }, [])

  useEffect(() => (
    () => {
      if (pipeExitAnimationRef.current) {
        window.cancelAnimationFrame(pipeExitAnimationRef.current)
        pipeExitAnimationRef.current = null
      }
    }
  ), [])

  useEffect(() => {
    if (gameLoopEnabled) return
    motionRef.current.x = left
    motionRef.current.y = bottom
  }, [left, bottom, gameLoopEnabled])

  const hasCollisionAt = useCallback((x, y) => {
    return hasCollisionAtPosition({ objects, pixels, x, y, playerForm })
  }, [objects, playerForm])

  const isGroundedAt = useCallback((x, y) => {
    return isGroundedAtPosition({ objects, pixels, x, y, playerForm })
  }, [objects, playerForm])

  const getLandingYAt = useCallback((x, fromY, toY) => {
    return getLandingYAtPosition({ objects, pixels, x, fromY, toY, playerForm })
  }, [objects, playerForm])

  const hasSideCollisionAt = useCallback((x, y) => {
    return hasSideCollisionAtPosition({ objects, pixels, x, y, playerForm })
  }, [objects, playerForm])

  const hasCeilingCollisionAt = useCallback((x, y) => {
    return hasCeilingCollisionAtPosition({ objects, pixels, x, y, playerForm })
  }, [objects, playerForm])

  const getMaxWalkX = useCallback(() => {
    return getMaxWalkXForObjects({ objects, pixels, playerForm })
  }, [objects, playerForm])

  const marioCollision =
    hasCollisionAtPosition({ objects, pixels, x: left, y: bottom, playerForm }) ||
    hasSideCollisionAtPosition({ objects, pixels, x: left, y: bottom, playerForm }) ||
    hasCeilingCollisionAtPosition({ objects, pixels, x: left, y: bottom, playerForm }) ||
    hasMarioEnemyContact({ marioX: left, marioY: bottom, pixels, playerForm, enemies })
  const {
    bumpInteractiveBlockAt,
    collectRevealedMysteryItemAt,
    collectWorldCoinAt,
  } = useBlockInteractions({
    objects,
    pixels,
    playerForm,
    mushroomSize: MUSHROOM_SIZE,
    mushroomSpeed: MUSHROOM_HORIZONTAL_SPEED,
    setBrickBreaks,
    setObjects,
    setCoins,
    setScore,
    setMushrooms,
  })

  const setLeftSafe = useCallback(nextValue => {
    if (!Number.isFinite(nextValue)) return
    if (stateRef.current.left === nextValue) return
    stateRef.current.left = nextValue
    setLeft(nextValue)
  }, [])

  const setBottomSafe = useCallback(nextValue => {
    if (!Number.isFinite(nextValue)) return
    if (stateRef.current.bottom === nextValue) return
    stateRef.current.bottom = nextValue
    setBottom(nextValue)
  }, [])

  const {
    time,
    gameStatus,
    loseReason,
    restoreSessionState,
  } = useGameSession({
    gameLoopEnabled,
    isPaused,
    isLevelIntroVisible,
    left,
    bottom,
    pixels,
    playerForm,
    objects,
    enemyHit,
    lives,
    initialTime: currentLevel.initialTime,
    flag: currentLevel.flag,
    levelKey: currentLevel.id,
  })

  const { resetLevelState } = useLevelReset({
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
  })

  const {
    spawnEnemy,
    resolveEnemyCollision,
    onEnemyHit,
  } = useEnemyState({
    enemiesRef,
    pixels,
    playerForm,
    playerDamageCooldownRef,
    setEnemies,
    setEnemyHit,
    setPlayerForm,
    setScore,
    createEnemyId,
  })

  const togglePause = useCallback(() => {
    if (gameStatus !== 'playing') return

    setIsPaused(prev => {
      const nextPaused = !prev
      if (nextPaused) {
        clearLoopInput()
      }
      return nextPaused
    })
  }, [clearLoopInput, gameStatus])

  const captureLevelSnapshot = useCallback(levelId => {
    levelSnapshotRef.current = {
      levelId,
      objects: objects.map(item => ({ ...item })),
      mushrooms: mushrooms.map(item => ({ ...item })),
      brickBreaks: brickBreaks.map(item => ({ ...item })),
      enemies: enemies.map(item => ({ ...item })),
      left,
      bottom,
      time,
    }
  }, [bottom, brickBreaks, enemies, left, mushrooms, objects, time])

  const restoreLevelSnapshot = useCallback(({ fallbackLevelId, fallbackSpawnId = null, exitDirection = null }) => {
    const snapshot = levelSnapshotRef.current
    if (!snapshot) {
      setCurrentLevelId(fallbackLevelId)
      resetLevelState(fallbackLevelId, {
        spawnId: fallbackSpawnId,
        showIntro: false,
        pipeExitDirection: exitDirection,
      })
      return
    }

    const level = getLevelById(snapshot.levelId)
    if (!level) {
      setCurrentLevelId(fallbackLevelId)
      resetLevelState(fallbackLevelId, {
        spawnId: fallbackSpawnId,
        showIntro: false,
        pipeExitDirection: exitDirection,
      })
      return
    }

    const targetSpawn = fallbackSpawnId && level.spawns?.[fallbackSpawnId]
      ? level.spawns[fallbackSpawnId]
      : null
    const restoreLeft = targetSpawn ? targetSpawn.x * pixels : snapshot.left
    const restoreBottom = targetSpawn ? targetSpawn.y * pixels : snapshot.bottom

    setCurrentLevelId(snapshot.levelId)
    setObjects(snapshot.objects.map(item => ({ ...item })))
    setMushrooms(snapshot.mushrooms.map(item => ({ ...item })))
    setBrickBreaks(snapshot.brickBreaks.map(item => ({ ...item })))
    setEnemies(snapshot.enemies.map(item => ({ ...item })))
    setLeftSafe(restoreLeft)
    setBottomSafe(restoreBottom)
    setEnemyHit(false)
    playerDamageCooldownRef.current = 0
    restoreSessionState({ nextTime: snapshot.time })

    mushroomsRef.current = snapshot.mushrooms.map(item => ({ ...item }))
    enemiesRef.current = snapshot.enemies.map(item => ({ ...item }))

    motionRef.current.x = restoreLeft
    motionRef.current.y = restoreBottom
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
      x: restoreLeft,
      y: restoreBottom,
    }
    publishPendingRef.current = false
    setPipeTransition({
      active: false,
      direction: null,
      translateX: 0,
      translateY: 0,
    })
    playPipeExitAnimation(exitDirection)
    levelSnapshotRef.current = null
  }, [
    playPipeExitAnimation,
    resetLevelState,
    restoreSessionState,
    setPipeTransition,
    setBottomSafe,
    setCurrentLevelId,
    setEnemies,
    setLeftSafe,
    setObjects,
    setMushrooms,
    setBrickBreaks,
    setEnemyHit,
  ])

  // Modern mode: requestAnimationFrame physics loop.
  useMarioPhysics({
    enabled: gameLoopEnabled && gameStatus === 'playing' && !isPaused && !isLevelIntroVisible && !pipeTransition.active,
    motionRef,
    lastPositionRef,
    stateRef,
    publishPendingRef,
    isGroundedAt,
    hasCollisionAt,
    hasCeilingCollisionAt,
    getLandingYAt,
    bumpInteractiveBlockAt,
    collectRevealedMysteryItemAt,
    collectWorldCoinAt,
    hasSideCollisionAt,
    resolveEnemyCollision,
    onEnemyHit,
    getMaxWalkX,
    setLeftSafe,
    setBottomSafe,
  })

  useMushroomPhysics({
    enabled: gameLoopEnabled && gameStatus === 'playing' && !isPaused && !isLevelIntroVisible && !pipeTransition.active,
    objects,
    pixels,
    playerForm,
    marioLeft: left,
    marioBottom: bottom,
    mushroomsRef,
    setMushrooms,
    setScore,
    onCollectMushroom: itemType => {
      if (itemType === 'flower') {
        setPlayerForm('fire')
        return
      }

      setPlayerForm('big')
    },
  })

  useEnemyPhysics({
    enabled: gameLoopEnabled && gameStatus === 'playing' && !isPaused && !isLevelIntroVisible && !pipeTransition.active,
    objects,
    pixels,
    enemiesRef,
    setEnemies,
    setScore,
  })

  useLevelTransitions({
    enabled: gameLoopEnabled && gameStatus === 'playing' && !isPaused && !isLevelIntroVisible && !pipeTransition.active,
    currentLevel,
    currentLevelId,
    left,
    bottom,
    pixels,
    playerForm,
    motionRef,
    objects,
    setCurrentLevelId,
    resetLevelState,
    captureLevelSnapshot,
    restoreLevelSnapshot,
    setPipeTransition,
    setLeftSafe,
  })

  const setLoopInput = useCallback(nextInput => {
    if (gameStatus !== 'playing' || isPaused || isLevelIntroVisible || pipeTransition.active) return
    motionRef.current.input = {
      ...motionRef.current.input,
      ...nextInput,
    }
  }, [gameStatus, isPaused, isLevelIntroVisible, pipeTransition.active])

  useEffect(() => {
    if (gameLoopEnabled && !isPaused && !isLevelIntroVisible && !pipeTransition.active) return
    clearLoopInput()
  }, [clearLoopInput, gameLoopEnabled, isPaused, isLevelIntroVisible, pipeTransition.active])

  useEffect(() => {
    if (gameStatus === 'playing') return
    clearLoopInput()
  }, [clearLoopInput, gameStatus])

  useEffect(() => {
    if (!gameLoopEnabled) return

    motionRef.current.x = stateRef.current.left
    motionRef.current.y = stateRef.current.bottom
    lastPositionRef.current = {
      x: stateRef.current.left,
      y: stateRef.current.bottom,
    }
  }, [gameLoopEnabled])

  useEffect(() => {
    if (gameLoopEnabled && gameStatus === 'playing') return
    const rafId = window.requestAnimationFrame(() => {
      setIsPaused(false)
    })

    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [gameLoopEnabled, gameStatus])

  useLevelAdvance({
    currentLevelIndex,
    gameStatus,
    onAdvanceLevel: resetLevelState,
    setCurrentLevelId,
  })

  return (
    <AppContext.Provider
      value={{
        debug: debugEnabled,
        pixels: pixels,
        width: width,

        left: left,
        bottom: bottom,
        marioCollision: marioCollision,
        currentWorld: currentLevel.world,
        currentStage: currentLevel.stage,
        currentLevelLabel: currentLevel.label,
        currentLevelId: currentLevelId,
        currentBackground: currentLevel.background,
        currentTheme: currentLevel.theme ?? 'overworld',
        currentDecorations: currentLevel.decorations ?? {
          clouds: [],
          mountains: [],
          plants: [],
        },
        currentFlag: currentLevel.flag,
        currentCastle: currentLevel.castle,
        objects: objects,
        mushrooms: mushrooms,
        brickBreaks: brickBreaks,
        enemies: enemies,
        playerForm: playerForm,
        lives: lives,
        coins: coins,
        score: score,
        time: time,
        gameStatus: gameStatus,
        loseReason: loseReason,
        isPaused: isPaused,
        isLevelIntroVisible: isLevelIntroVisible,
        pipeTransition: pipeTransition,

        renderLimit: renderLimit, 
        motionRef: motionRef,
        gameLoopEnabled: gameLoopEnabled,
        
        setLeft: setLeft,
        setBottom: setBottom,
        setObjects: setObjects,
        setPlayerForm: setPlayerForm,
        setLives: setLives,
        setCoins: setCoins,
        setScore: setScore,
        spawnEnemy: spawnEnemy,
        setLoopInput: setLoopInput,
        setGameLoopEnabled: setGameLoopEnabled,
        togglePause: togglePause,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
