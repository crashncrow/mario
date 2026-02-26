import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useWindowDimensions } from 'hooks/window'
import useMarioPhysics from 'hooks/useMarioPhysics'
import {
  getLandingYAtPosition,
  getMaxWalkXForObjects,
  hasCeilingCollisionAtPosition,
  hasCollisionAtPosition,
  hasSideCollisionAtPosition,
  isGroundedAtPosition,
} from 'libs/collision'

const AppContext = createContext(null)
const pixels = 64

export const AppContextProvider = ({ children }) => {
  const { width } = useWindowDimensions();
  const debugEnabled = process.env.NEXT_PUBLIC_DEBUG === '1'

  const [ objects, setObjects ] = useState([])

  const [ left, setLeft ] = useState(100)
  const [ bottom, setBottom ] = useState(pixels)
  
  const [ collision, setCollision ] = useState(false)
  
  const [ canJump, setCanJump ] = useState(true)
  const [ canWalkLeft, setCanWalkLeft ] = useState(true)
  const [ canWalkRight, setCanWalkRight ] = useState(true)
  const [ jumping, setJumping ] = useState(false)
  const [ gameLoopEnabled, setGameLoopEnabled ] = useState(true)
  const renderLimit = left + (width ?? 0) + 500

  const stateRef = useRef({
    left,
    bottom,
    jumping,
    width,
    renderLimit,
  })

  const checkCollisionRef = useRef(null)
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
      jumping,
      width,
      renderLimit,
    }
  }, [left, bottom, jumping, width, renderLimit])

  useEffect(() => {
    publishPendingRef.current = false
  }, [left, bottom])

  useEffect(() => {
    if (gameLoopEnabled) return
    motionRef.current.x = left
    motionRef.current.y = bottom
  }, [left, bottom, gameLoopEnabled])

  const checkCollision = useCallback((x, y) => {
    let toco = false
    let walkLeft = true
    let walkRight = true

    let objs = [...objects]

    objs.map((obj, i) => {
      // console.log('X', x, (obj.x * pixels),  (obj.x * pixels) + obj.width)
      // console.log('Y', y, (obj.y * pixels),  (obj.y * pixels) + obj.height)

      if (
        x + 10 < obj.x * pixels + obj.width &&
        x + pixels - 20 > obj.x * pixels &&
        y >= obj.y * pixels &&
        y <= obj.y * pixels + obj.height
      ) {

        if (obj.type !== 'Floor') {
          console.log('YYY', obj.type , y, (obj.y * pixels) + obj.height)
          if(y >= (obj.y * pixels) + obj.height){
            console.log('ARRIBA')
          }
          else {
            if (typeof obj.touches !== 'undefined') {
              obj.touches++
            }

            if (x + pixels < (obj.x * pixels) + obj.width) {
              console.log('VIENE DE IZQ, NO PUEDE SEGUIR A LA DER')
              walkRight = false
            }
  
            if (x > obj.x * pixels) {
              console.log('VIENE DE DER, NO PUEDE SEGUIR A LA IZQ')
              walkLeft = false
            }
          }
        }

        if(!collision) {
          setCollision(true)
        }
        
        if(obj.type !== 'Floor') {
          console.log('COLLISION')
        }

        toco = true
      }
    })

    if (!toco) {
      setCollision(false)
      setCanJump(false)
    } else {
      setObjects(objs)
      setCanJump(true)
    }

    if(walkLeft !== canWalkLeft){
      setCanWalkLeft(walkLeft)
    }

    if(walkRight !== canWalkRight){
      setCanWalkRight(walkRight)
    }
    
    return toco
  }, [objects, collision, canWalkLeft, canWalkRight])

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
    let bumped = false

    const nextObjects = objects.map(obj => {
      if (bumped || obj.type === 'Floor' || typeof obj.touches === 'undefined') {
        return obj
      }

      const objLeft = obj.x * pixels
      const objRight = objLeft + obj.width
      const objBottom = obj.y * pixels
      const objTop = objBottom + obj.height

      const marioLeft = x + 12
      const marioRight = x + pixels - 22
      const headBottom = y + pixels - 4
      const headTop = y + pixels

      const hit =
        marioLeft < objRight &&
        marioRight > objLeft &&
        headBottom < objTop &&
        headTop > objBottom

      if (!hit) return obj

      bumped = true
      return {
        ...obj,
        touches: (obj.touches || 0) + 1,
      }
    })

    if (bumped) {
      setObjects(nextObjects)
    }
  }, [objects])

  useEffect(() => {
    checkCollisionRef.current = checkCollision
  }, [checkCollision])

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

  const applyGravity = useCallback(() => {
    const { left: currentLeft, bottom: currentBottom, jumping: currentJumping } = stateRef.current

    if (
      checkCollisionRef.current &&
      !checkCollisionRef.current(currentLeft, currentBottom) &&
      currentLeft > 100 &&
      !currentJumping
    ) {
      setBottom(bottom => bottom - pixels)
    }
  }, [])

  useEffect(() => {
    if (gameLoopEnabled) return

    const rafId = window.requestAnimationFrame(() => {
      applyGravity()
    })

    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [left, bottom, jumping, applyGravity, gameLoopEnabled])

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

  return (
    <AppContext.Provider
      value={{
        debug: debugEnabled,
        pixels: pixels,
        width: width,

        left: left,
        bottom: bottom,
        objects: objects,

        canJump: canJump,
        collision: collision,

        canWalkLeft: canWalkLeft,
        canWalkRight: canWalkRight,

        renderLimit: renderLimit, 
        motionRef: motionRef,
        gameLoopEnabled: gameLoopEnabled,
        
        setLeft: setLeft,
        setBottom: setBottom,
        setObjects: setObjects,
        checkCollision: checkCollision,
        setJumping: setJumping,
        setLoopInput: setLoopInput,
        setGameLoopEnabled: setGameLoopEnabled
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
