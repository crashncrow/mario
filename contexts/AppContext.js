import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useWindowDimensions } from 'hooks/shared/window'
import useMarioPhysics from 'hooks/world/useMarioPhysics'
import useBlockInteractions from 'hooks/world/useBlockInteractions'
import useMushroomPhysics, { MUSHROOM_HORIZONTAL_SPEED, MUSHROOM_SIZE } from 'hooks/world/useMushroomPhysics'
import useEnemyPhysics from 'hooks/enemies/useEnemyPhysics'
import useEnemyState from 'hooks/enemies/useEnemyState'
import useGameSession from 'hooks/game/useGameSession'
import useLevelReset from 'hooks/game/useLevelReset'
import { useCurrentLevel, useLevelAdvance } from 'hooks/game/useLevelProgression'
import { createEnemiesState } from 'libs/enemies/createEnemyState'
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

const AppContext = createContext(null)
const pixels = TILE_SIZE

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
    currentLevelIndex,
    currentLevel,
    setCurrentLevelIndex,
  } = useCurrentLevel()

  const [ objects, setObjects ] = useState(currentLevel.elements)
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
  } = useGameSession({
    gameLoopEnabled,
    isPaused,
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
    setLeftSafe,
    setBottomSafe,
    motionRef,
    lastPositionRef,
    publishPendingRef,
    mushroomsRef,
    enemiesRef,
    playerDamageCooldownRef,
    lastGameStatusRef,
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

  const clearLoopInput = useCallback(() => {
    motionRef.current.input = {
      left: false,
      right: false,
      jump: false,
    }
    motionRef.current.jumpHeld = false
    motionRef.current.vx = 0
    motionRef.current.vy = 0
  }, [])

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

  // Modern mode: requestAnimationFrame physics loop.
  useMarioPhysics({
    enabled: gameLoopEnabled && gameStatus === 'playing' && !isPaused,
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
    hasSideCollisionAt,
    resolveEnemyCollision,
    onEnemyHit,
    getMaxWalkX,
    setLeftSafe,
    setBottomSafe,
  })

  useMushroomPhysics({
    enabled: gameLoopEnabled && gameStatus === 'playing' && !isPaused,
    objects,
    pixels,
    playerForm,
    marioLeft: left,
    marioBottom: bottom,
    mushroomsRef,
    setMushrooms,
    setScore,
    onCollectMushroom: () => setPlayerForm('big'),
  })

  useEnemyPhysics({
    enabled: gameLoopEnabled && gameStatus === 'playing' && !isPaused,
    objects,
    pixels,
    enemiesRef,
    setEnemies,
    setScore,
  })

  const setLoopInput = useCallback(nextInput => {
    if (gameStatus !== 'playing' || isPaused) return
    motionRef.current.input = {
      ...motionRef.current.input,
      ...nextInput,
    }
  }, [gameStatus, isPaused])

  useEffect(() => {
    if (gameLoopEnabled && !isPaused) return
    clearLoopInput()
  }, [clearLoopInput, gameLoopEnabled, isPaused])

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
    setCurrentLevelIndex,
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
