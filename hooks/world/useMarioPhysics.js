import useGameLoop from 'hooks/game/useGameLoop'

export default function useMarioPhysics({
  enabled,
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
}) {
  useGameLoop((dt, now) => {
    if (!Number.isFinite(dt) || dt < 0) return

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
      // Tuned closer to classic platformer feel (SMB-like):
      // medium-high jump when held, short jump when released early.
      motion.vy = 1270
      motion.grounded = false
      motion.coyoteTimer = 0
      motion.jumpBufferTimer = 0
    }

    const baseGravity = 3000
    const fallMultiplier = 1.8
    const lowJumpMultiplier = 2.4
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

    nextX = Math.max(0, nextX)
    nextX = Math.min(nextX, getMaxWalkX())

    motion.vy = dt > 0 ? (nextY - prev.y) / dt : motion.vy
    if (motion.vy === 0) {
      motion.grounded = isGroundedAt(nextX, nextY)
      if (motion.grounded) {
        motion.coyoteTimer = coyoteTime
      }
    }
    motion.x = nextX
    motion.y = nextY

    const enemyCollision = resolveEnemyCollision({
      marioX: nextX,
      marioY: nextY,
      previousMarioY: prev.y,
      marioVy: motion.vy,
    })
    if (enemyCollision.hitEnemy) {
      onEnemyHit()
    }
    if (enemyCollision.stomped) {
      if (Number.isFinite(enemyCollision.nextY)) {
        nextY = enemyCollision.nextY
        motion.y = nextY
      }
      motion.vy = enemyCollision.nextVy
      motion.grounded = false
      motion.coyoteTimer = 0
    }

    collectRevealedMysteryItemAt(nextX, nextY)

    if (!Number.isFinite(nextX) || !Number.isFinite(nextY)) {
      return
    }

    lastPositionRef.current = {
      x: nextX,
      y: nextY,
    }

    const nextLeftRounded = Math.round(nextX)
    const shouldPublishLeft = stateRef.current.left !== nextLeftRounded
    const shouldPublishBottom = stateRef.current.bottom !== nextY

    if (!shouldPublishLeft && !shouldPublishBottom) {
      return
    }

    if (publishPendingRef.current) {
      return
    }

    publishPendingRef.current = true
    if (shouldPublishLeft) {
      setLeftSafe(nextLeftRounded)
    }
    if (shouldPublishBottom) {
      setBottomSafe(nextY)
    }
  }, enabled)
}
