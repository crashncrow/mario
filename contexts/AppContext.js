import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useWindowDimensions } from 'hooks/window'
import useMarioPhysics from 'hooks/useMarioPhysics'
import useMushroomPhysics, { MUSHROOM_HORIZONTAL_SPEED, MUSHROOM_SIZE } from 'hooks/useMushroomPhysics'
import useEnemyPhysics from 'hooks/useEnemyPhysics'
import useGameSession from 'hooks/useGameSession'
import { createEnemiesState, createEnemyState } from 'libs/createEnemyState'
import {
  getLandingYAtPosition,
  getMaxWalkXForObjects,
  hasCeilingCollisionAtPosition,
  hasCollisionAtPosition,
  hasSideCollisionAtPosition,
  isGroundedAtPosition,
} from 'libs/collision'
import {
  bumpInteractiveBlockAtPosition,
  collectRevealedMysteryItemAtPosition,
} from 'libs/interaction'
import {
  hasMarioEnemyContact,
  resolveMarioEnemyCollision,
} from 'libs/enemyInteractions'
import { getEnemyTypeConfig } from 'libs/enemyTypes'
import { getLevelByIndex, getNextLevelIndex } from 'libs/levels'
import { TILE_SIZE } from 'libs/worldConstants'

const AppContext = createContext(null)
const pixels = TILE_SIZE
const RESPAWN_DELAY_MS = 1200
const LEVEL_ADVANCE_DELAY_MS = 1500

export const AppContextProvider = ({ children }) => {
  const { width } = useWindowDimensions();
  const debugEnabled = process.env.NEXT_PUBLIC_DEBUG === '1'
  const nextEnemyIdRef = useRef(0)
  const lastGameStatusRef = useRef('playing')
  const levelAdvanceTimeoutRef = useRef(null)
  const createEnemyId = useCallback(
    () => `enemy_${nextEnemyIdRef.current++}`,
    []
  )
  const [ currentLevelIndex, setCurrentLevelIndex ] = useState(0)
  const currentLevel = getLevelByIndex(currentLevelIndex)

  const [ objects, setObjects ] = useState(currentLevel.elements)
  const [ mushrooms, setMushrooms ] = useState([])
  const [ enemies, setEnemies ] = useState(() => createEnemiesState({
    enemies: currentLevel.enemies,
    pixels,
    createId: (_, index) => `enemy_init_${index}`,
  }))

  const [ left, setLeft ] = useState(currentLevel.startLeft)
  const [ bottom, setBottom ] = useState(currentLevel.startBottom)
  const [ lives, setLives ] = useState(3)
  const [ coins, setCoins ] = useState(0)
  const [ score, setScore ] = useState(0)
  const [ enemyHit, setEnemyHit ] = useState(false)
  
  const [ gameLoopEnabled, setGameLoopEnabled ] = useState(true)
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
    enemiesRef.current = enemies
  }, [enemies])

  useEffect(() => {
    if (gameLoopEnabled) return
    motionRef.current.x = left
    motionRef.current.y = bottom
  }, [left, bottom, gameLoopEnabled])

  const hasCollisionAt = useCallback((x, y) => {
    return hasCollisionAtPosition({ objects, pixels, x, y })
  }, [objects])

  const isGroundedAt = useCallback((x, y) => {
    return isGroundedAtPosition({ objects, pixels, x, y })
  }, [objects])

  const getLandingYAt = useCallback((x, fromY, toY) => {
    return getLandingYAtPosition({ objects, pixels, x, fromY, toY })
  }, [objects])

  const hasSideCollisionAt = useCallback((x, y) => {
    return hasSideCollisionAtPosition({ objects, pixels, x, y })
  }, [objects])

  const hasCeilingCollisionAt = useCallback((x, y) => {
    return hasCeilingCollisionAtPosition({ objects, pixels, x, y })
  }, [objects])

  const getMaxWalkX = useCallback(() => {
    return getMaxWalkXForObjects({ objects, pixels })
  }, [objects])

  const marioCollision =
    hasCollisionAtPosition({ objects, pixels, x: left, y: bottom }) ||
    hasSideCollisionAtPosition({ objects, pixels, x: left, y: bottom }) ||
    hasCeilingCollisionAtPosition({ objects, pixels, x: left, y: bottom }) ||
    hasMarioEnemyContact({ marioX: left, marioY: bottom, pixels, enemies })

  const bumpInteractiveBlockAt = useCallback((x, y) => {
    const { nextObjects, bumped, reward, spawnedItem } = bumpInteractiveBlockAtPosition({ objects, pixels, x, y })

    if (bumped) {
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
            vx: MUSHROOM_HORIZONTAL_SPEED,
            vy: 0,
            width: MUSHROOM_SIZE,
            height: MUSHROOM_SIZE,
          },
        ]))
      }
    }
  }, [objects])

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
  }, [objects])

  const spawnEnemy = useCallback(enemy => {
    const nextEnemy = createEnemyState({
      enemy,
      id: createEnemyId(),
      index: enemiesRef.current.length,
      pixels,
    })
    const nextEnemies = [ ...enemiesRef.current, nextEnemy ]
    enemiesRef.current = nextEnemies
    setEnemies(nextEnemies)
    return nextEnemy
  }, [createEnemyId])

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

  const createInitialEnemies = useCallback(level => (
    createEnemiesState({
      enemies: level.enemies,
      pixels,
      createId: (_, index) => `enemy_init_${index}`,
    })
  ), [])

  const resetLevelState = useCallback(level => {
    const nextEnemies = createInitialEnemies(level)

    setObjects(level.elements)
    setMushrooms([])
    setEnemies(nextEnemies)
    setLeftSafe(level.startLeft)
    setBottomSafe(level.startBottom)
    setEnemyHit(false)

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
  }, [createInitialEnemies, setBottomSafe, setLeftSafe])

  const {
    time,
    gameStatus,
    loseReason,
  } = useGameSession({
    gameLoopEnabled,
    left,
    bottom,
    pixels,
    objects,
    enemyHit,
    lives,
    initialTime: currentLevel.initialTime,
    flag: currentLevel.flag,
    levelKey: currentLevel.id,
  })

  const resolveEnemyCollision = useCallback(({
    marioX,
    marioY,
    previousMarioY,
    marioVy,
  }) => {
    const result = resolveMarioEnemyCollision({
      marioX,
      marioY,
      previousMarioY,
      marioVy,
      pixels,
      enemies: enemiesRef.current,
      getEnemyTypeConfig,
    })

    if (result.scoreDelta > 0) {
      setScore(prev => prev + result.scoreDelta)
    }

    if (result.stomped || result.enemiesChanged) {
      const nextEnemies = result.nextEnemies
      enemiesRef.current = nextEnemies
      setEnemies(nextEnemies)
    }

    return {
      hitEnemy: result.hitEnemy,
      stomped: result.stomped,
      nextVy: result.nextVy,
      nextY: result.nextY,
    }
  }, [])

  const onEnemyHit = useCallback(() => {
    setEnemyHit(true)
  }, [])

  // Modern mode: requestAnimationFrame physics loop.
  useMarioPhysics({
    enabled: gameLoopEnabled && gameStatus === 'playing',
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
    enabled: gameLoopEnabled && gameStatus === 'playing',
    objects,
    pixels,
    marioLeft: left,
    marioBottom: bottom,
    mushroomsRef,
    setMushrooms,
    setScore,
  })

  useEnemyPhysics({
    enabled: gameLoopEnabled && gameStatus === 'playing',
    objects,
    pixels,
    enemiesRef,
    setEnemies,
    setScore,
  })

  const setLoopInput = useCallback(nextInput => {
    if (gameStatus !== 'playing') return
    motionRef.current.input = {
      ...motionRef.current.input,
      ...nextInput,
    }
  }, [gameStatus])

  useEffect(() => {
    if (gameLoopEnabled) return

    motionRef.current.input = {
      left: false,
      right: false,
      jump: false,
    }
    motionRef.current.jumpHeld = false
    motionRef.current.vx = 0
    motionRef.current.vy = 0
  }, [gameLoopEnabled])

  useEffect(() => {
    if (gameStatus === 'playing') return

    motionRef.current.input = {
      left: false,
      right: false,
      jump: false,
    }
    motionRef.current.jumpHeld = false
    motionRef.current.vx = 0
    motionRef.current.vy = 0
  }, [gameStatus])

  useEffect(() => {
    if (gameStatus === 'lost' && lastGameStatusRef.current !== 'lost') {
      const rafId = window.requestAnimationFrame(() => {
        if (lives > 1) {
          setLives(prev => Math.max(0, prev - 1))
          window.setTimeout(() => {
            resetLevelState(currentLevel)
          }, RESPAWN_DELAY_MS)
          return
        }

        setLives(0)
      })
      lastGameStatusRef.current = gameStatus
      return () => window.cancelAnimationFrame(rafId)
    }

    lastGameStatusRef.current = gameStatus
  }, [currentLevel, gameStatus, lives, resetLevelState])

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
      resetLevelState(nextLevel)
    }, LEVEL_ADVANCE_DELAY_MS)

    return () => {
      if (levelAdvanceTimeoutRef.current) {
        window.clearTimeout(levelAdvanceTimeoutRef.current)
        levelAdvanceTimeoutRef.current = null
      }
    }
  }, [currentLevelIndex, gameStatus, resetLevelState])

  useEffect(() => {
    if (!gameLoopEnabled) return

    motionRef.current.x = stateRef.current.left
    motionRef.current.y = stateRef.current.bottom
    lastPositionRef.current = {
      x: stateRef.current.left,
      y: stateRef.current.bottom,
    }
  }, [gameLoopEnabled])

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
        enemies: enemies,
        lives: lives,
        coins: coins,
        score: score,
        time: time,
        gameStatus: gameStatus,
        loseReason: loseReason,

        renderLimit: renderLimit, 
        motionRef: motionRef,
        gameLoopEnabled: gameLoopEnabled,
        
        setLeft: setLeft,
        setBottom: setBottom,
        setObjects: setObjects,
        setLives: setLives,
        setCoins: setCoins,
        setScore: setScore,
        spawnEnemy: spawnEnemy,
        setLoopInput: setLoopInput,
        setGameLoopEnabled: setGameLoopEnabled
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
