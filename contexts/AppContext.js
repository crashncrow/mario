import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useWindowDimensions } from 'hooks/window'
import useMarioPhysics from 'hooks/useMarioPhysics'
import useGameSession from 'hooks/useGameSession'
import { elements } from 'libs/elements'
import {
  getLandingYAtPosition,
  getMaxWalkXForObjects,
  hasCeilingCollisionAtPosition,
  hasCollisionAtPosition,
  hasSideCollisionAtPosition,
  isGroundedAtPosition,
} from 'libs/collision'
import { bumpInteractiveBlockAtPosition } from 'libs/interaction'
import { TILE_SIZE } from 'libs/worldConstants'

const AppContext = createContext(null)
const pixels = TILE_SIZE

export const AppContextProvider = ({ children }) => {
  const { width } = useWindowDimensions();
  const debugEnabled = process.env.NEXT_PUBLIC_DEBUG === '1'

  const [ objects, setObjects ] = useState(elements)

  const [ left, setLeft ] = useState(100)
  const [ bottom, setBottom ] = useState(pixels)
  
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

  const bumpInteractiveBlockAt = useCallback((x, y) => {
    const { nextObjects, bumped } = bumpInteractiveBlockAtPosition({ objects, pixels, x, y })

    if (bumped) {
      setObjects(nextObjects)
    }
  }, [objects])

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

  // Modern mode: requestAnimationFrame physics loop.
  useMarioPhysics({
    enabled: gameLoopEnabled,
    motionRef,
    lastPositionRef,
    stateRef,
    publishPendingRef,
    isGroundedAt,
    hasCollisionAt,
    hasCeilingCollisionAt,
    getLandingYAt,
    bumpInteractiveBlockAt,
    hasSideCollisionAt,
    getMaxWalkX,
    setLeftSafe,
    setBottomSafe,
  })

  const setLoopInput = useCallback(nextInput => {
    motionRef.current.input = {
      ...motionRef.current.input,
      ...nextInput,
    }
  }, [])

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
    if (!gameLoopEnabled) return

    motionRef.current.x = stateRef.current.left
    motionRef.current.y = stateRef.current.bottom
    lastPositionRef.current = {
      x: stateRef.current.left,
      y: stateRef.current.bottom,
    }
  }, [gameLoopEnabled])

  const {
    time,
    gameStatus,
  } = useGameSession({
    gameLoopEnabled,
    left,
    bottom,
    pixels,
    objects,
  })

  return (
    <AppContext.Provider
      value={{
        debug: debugEnabled,
        pixels: pixels,
        width: width,

        left: left,
        bottom: bottom,
        objects: objects,
        time: time,
        gameStatus: gameStatus,

        renderLimit: renderLimit, 
        motionRef: motionRef,
        gameLoopEnabled: gameLoopEnabled,
        
        setLeft: setLeft,
        setBottom: setBottom,
        setObjects: setObjects,
        setLoopInput: setLoopInput,
        setGameLoopEnabled: setGameLoopEnabled
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
