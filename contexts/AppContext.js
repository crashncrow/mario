import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useWindowDimensions } from 'hooks/window'
import useGameLoop from 'hooks/useGameLoop'

const AppContext = createContext(null)
const pixels = 64

export const AppContextProvider = ({ children }) => {
  const { width } = useWindowDimensions();

  const [ objects, setObjects ] = useState([])

  const [ left, setLeft ] = useState(100)
  const [ bottom, setBottom ] = useState(pixels)
  
  const [ collision, setCollision ] = useState(false)
  
  const [ canJump, setCanJump ] = useState(true)
  const [ canWalkLeft, setCanWalkLeft ] = useState(true)
  const [ canWalkRight, setCanWalkRight ] = useState(true)
  const [ jumping, setJumping ] = useState(false)
  const [ renderLimit, setRenderLimit ] = useState(2000)
  const [ gameLoopEnabled, setGameLoopEnabled ] = useState(true)

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
    if (gameLoopEnabled) return
    motionRef.current.x = left
    motionRef.current.y = bottom
  }, [left, bottom, gameLoopEnabled])

  useEffect(() => {
    console.log('W', width)
    setRenderLimit(left + width + 500)
  }, [left, width])

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
    return objects.some(obj => (
      x + 10 < obj.x * pixels + obj.width &&
      x + pixels - 20 > obj.x * pixels &&
      y >= obj.y * pixels &&
      y <= obj.y * pixels + obj.height
    ))
  }, [objects])

  const isGroundedAt = useCallback((x, y) => {
    // Probe a couple pixels below the feet so fractional positions don't lose ground contact.
    return hasCollisionAt(x, Math.max(0, y - 2))
  }, [hasCollisionAt])

  const getLandingYAt = useCallback((x, fromY, toY) => {
    let landingY = null

    objects.forEach(obj => {
      const objLeft = obj.x * pixels
      const objRight = objLeft + obj.width
      const objTop = (obj.y * pixels) + obj.height

      const overlapsX =
        x + 10 < objRight &&
        x + pixels - 20 > objLeft

      if (!overlapsX) return

      if (objTop <= fromY && objTop >= toY) {
        landingY = landingY === null ? objTop : Math.max(landingY, objTop)
      }
    })

    return landingY
  }, [objects])

  const hasSideCollisionAt = useCallback((x, y) => {
    const marioLeft = x + 10
    const marioRight = x + pixels - 20
    const marioBottom = y + 2
    const marioTop = y + pixels - 2

    return objects.some(obj => {
      const objLeft = obj.x * pixels
      const objRight = objLeft + obj.width
      const objBottom = obj.y * pixels
      const objTop = objBottom + obj.height

      return (
        marioLeft < objRight &&
        marioRight > objLeft &&
        marioBottom < objTop &&
        marioTop > objBottom
      )
    })
  }, [objects])

  const hasCeilingCollisionAt = useCallback((x, y) => {
    const marioLeft = x + 12
    const marioRight = x + pixels - 22
    const headBottom = y + pixels - 4
    const headTop = y + pixels

    return objects.some(obj => {
      if (obj.type === 'Floor') return false

      const objLeft = obj.x * pixels
      const objRight = objLeft + obj.width
      const objBottom = obj.y * pixels
      const objTop = objBottom + obj.height

      return (
        marioLeft < objRight &&
        marioRight > objLeft &&
        headBottom < objTop &&
        headTop > objBottom
      )
    })
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
    if (stateRef.current.left === nextValue) return
    stateRef.current.left = nextValue
    setLeft(nextValue)
  }, [])

  const setBottomSafe = useCallback(nextValue => {
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
    if (!gameLoopEnabled) {
      applyGravity()
    }
  }, [bottom, applyGravity, gameLoopEnabled])

  useEffect(() => {
    if (!gameLoopEnabled) {
      applyGravity()
    }

    const {
      left: currentLeft,
      width: currentWidth,
      renderLimit: currentRenderLimit,
    } = stateRef.current

    if (currentLeft + currentWidth + 500 > currentRenderLimit) {
      setRenderLimit(currentLeft + currentWidth + 50000)
    }
  }, [left, applyGravity, gameLoopEnabled])

  useEffect(() => {
    if (!gameLoopEnabled) {
      applyGravity()
    }
  }, [jumping, applyGravity, gameLoopEnabled])

  useGameLoop((dt, now) => {
    const motion = motionRef.current
    let nextX = motion.x
    let nextY = motion.y
    const prev = lastPositionRef.current

    motion.dt = dt
    motion.now = now
    motion.frame += 1
    motion.grounded = isGroundedAt(motion.x, motion.y)

    const coyoteTime = 0.1
    const jumpBufferTime = 0.1

    motion.coyoteTimer = motion.grounded
      ? coyoteTime
      : Math.max(0, motion.coyoteTimer - dt)
    motion.jumpBufferTimer = Math.max(0, motion.jumpBufferTimer - dt)

    const maxSpeed = 420
    const horizontalInput =
      motion.input.left && !motion.input.right
        ? -1
        : motion.input.right && !motion.input.left
          ? 1
          : 0

    if (horizontalInput > 0) {
      motion.facing = 1
    } else if (horizontalInput < 0) {
      motion.facing = -1
    }

    if (motion.input.jump && !motion.jumpHeld) {
      motion.jumpBufferTimer = jumpBufferTime
      motion.jumpHeld = true
    }
    if (!motion.input.jump && motion.jumpHeld) {
      motion.jumpHeld = false
    }

    if (motion.jumpBufferTimer > 0 && (motion.grounded || motion.coyoteTimer > 0)) {
      motion.vy = 1300
      motion.grounded = false
      motion.coyoteTimer = 0
      motion.jumpBufferTimer = 0
    }

    const baseGravity = 2200
    const fallMultiplier = 1.7
    const lowJumpMultiplier = 1.35
    const gravityMultiplier =
      motion.vy < 0
        ? fallMultiplier
        : !motion.input.jump && motion.vy > 0
          ? lowJumpMultiplier
          : 1

    motion.vy += -(baseGravity * gravityMultiplier) * dt

    const targetY = Math.max(0, motion.y + (motion.vy * dt))
    const verticalDirection = targetY >= motion.y ? 1 : -1
    let probeY = motion.y
    let blocked = false
    let blockedProbeY = null

    if (targetY !== motion.y) {
      while (
        (verticalDirection > 0 && probeY < targetY) ||
        (verticalDirection < 0 && probeY > targetY)
      ) {
        const nextProbe = verticalDirection > 0
          ? Math.min(probeY + 1, targetY)
          : Math.max(probeY - 1, targetY)

        const hit = verticalDirection < 0
          ? hasCollisionAt(nextX, nextProbe)
          : hasCeilingCollisionAt(nextX, nextProbe)

        if (hit) {
          blocked = true
          blockedProbeY = nextProbe
          break
        }
        probeY = nextProbe
      }
      nextY = probeY
    }

    if (blocked) {
      if (motion.vy < 0) {
        const snappedY = getLandingYAt(nextX, motion.y, targetY)
        if (snappedY !== null) {
          nextY = snappedY
        }
        motion.grounded = true
        motion.coyoteTimer = coyoteTime
        motion.headBlockedLastFrame = false
      } else if (verticalDirection > 0) {
        if (!motion.headBlockedLastFrame) {
          bumpInteractiveBlockAt(nextX, blockedProbeY ?? probeY)
        }
        motion.headBlockedLastFrame = true
      }
      motion.vy = 0
    } else {
      nextY = targetY
      motion.grounded = false
      motion.headBlockedLastFrame = false
    }

    const accelGround = 2400
    const accelAir = 1200
    const decelGround = 2800
    const decelAir = 500
    const accel = motion.grounded ? accelGround : accelAir
    const decel = motion.grounded ? decelGround : decelAir
    const targetVx = horizontalInput * maxSpeed

    if (horizontalInput !== 0) {
      if (motion.vx < targetVx) {
        motion.vx = Math.min(targetVx, motion.vx + (accel * dt))
      } else if (motion.vx > targetVx) {
        motion.vx = Math.max(targetVx, motion.vx - (accel * dt))
      }
    } else {
      if (motion.vx > 0) {
        motion.vx = Math.max(0, motion.vx - (decel * dt))
      } else if (motion.vx < 0) {
        motion.vx = Math.min(0, motion.vx + (decel * dt))
      }
    }

    if (motion.vx !== 0) {
      const targetX = motion.x + (motion.vx * dt)
      const horizontalDirection = targetX >= motion.x ? 1 : -1
      let probeX = motion.x

      while (
        (horizontalDirection > 0 && probeX < targetX) ||
        (horizontalDirection < 0 && probeX > targetX)
      ) {
        const nextProbe = horizontalDirection > 0
          ? Math.min(probeX + 1, targetX)
          : Math.max(probeX - 1, targetX)

        if (hasSideCollisionAt(nextProbe, nextY)) {
          motion.vx = 0
          break
        }

        probeX = nextProbe
      }

      nextX = probeX
    }

    // Keep Mario inside the visible left boundary in game mode.
    nextX = Math.max(0, nextX)

    motion.vy = dt > 0 ? (nextY - prev.y) / dt : motion.vy
    if (motion.vy === 0) {
      motion.grounded = isGroundedAt(nextX, nextY)
      if (motion.grounded) {
        motion.coyoteTimer = coyoteTime
      }
    }
    motion.x = nextX
    motion.y = nextY

    setLeftSafe(Math.round(nextX))
    setBottomSafe(nextY)

    lastPositionRef.current = {
      x: nextX,
      y: nextY,
    }
  }, gameLoopEnabled)

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
        debug: false,
        pixels: pixels,

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
