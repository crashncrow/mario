import { useEffect, useRef } from 'react'
import { getPlayerBounds } from 'libs/playerDimensions'
import { getObjectHeight, getObjectWidth } from 'libs/world/objectDimensions'

const TRANSITION_DURATION_MS = 300
const PIPE_TRAVEL_PX = 48

export default function useLevelTransitions({
  enabled,
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
}) {
  const transitionTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.cancelAnimationFrame(transitionTimeoutRef.current)
        transitionTimeoutRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    if (transitionTimeoutRef.current) return

    const transitions = currentLevel.transitions ?? []
    if (transitions.length === 0) return

    const input = motionRef.current.input
    const marioBounds = getPlayerBounds({ x: left, y: bottom, pixels, playerForm })
    const marioCenterX = (marioBounds.left + marioBounds.right) / 2
    const isGrounded = motionRef.current.grounded

    const activeTransition = transitions.find(transition => {
      const wantsDown = transition.direction === 'down' && input.down
      const wantsUp = transition.direction === 'up' && input.up
      if (!wantsDown && !wantsUp) return false
      if (!isGrounded) return false

      const pipe = objects.find(obj => (
        obj.type === 'Pipe' &&
        obj.x === transition.x &&
        obj.y === transition.y
      ))
      if (!pipe) return false

      const pipeLeft = pipe.x * pixels
      const pipeRight = pipeLeft + getObjectWidth(pipe)
      const pipeBottom = pipe.y * pixels
      const pipeTop = pipeBottom + getObjectHeight(pipe)
      const centeredOnPipe = marioCenterX >= pipeLeft && marioCenterX <= pipeRight
      const overlapsPipeTop = (
        marioBounds.bottom <= pipeTop + 4 &&
        marioBounds.bottom >= pipeTop - pixels
      )

      return centeredOnPipe && overlapsPipeTop
    })

    if (!activeTransition) return

    const targetLevelId = activeTransition.targetLevelId
    const targetSpawnId = activeTransition.targetSpawnId ?? null
    const shouldRestoreParent = activeTransition.returnToParent === true
    const pipe = objects.find(obj => (
      obj.type === 'Pipe' &&
      obj.x === activeTransition.x &&
      obj.y === activeTransition.y
    ))
    if (!pipe) return

    const pipeLeft = pipe.x * pixels
    const pipeCenterX = pipeLeft + (getObjectWidth(pipe) / 2)
    const marioWidth = marioBounds.width
    const centeredLeft = Math.round(pipeCenterX - (marioWidth / 2))
    motionRef.current.input = {
      ...motionRef.current.input,
      up: false,
      down: false,
      left: false,
      right: false,
      jump: false,
    }
    setLeftSafe(centeredLeft)
    setPipeTransition({
      active: true,
      direction: activeTransition.direction,
      translateY: 0,
    })

    const start = performance.now()
    const directionMultiplier = activeTransition.direction === 'down' ? 1 : -1

    const step = now => {
      const progress = Math.min(1, (now - start) / TRANSITION_DURATION_MS)
      setPipeTransition({
        active: true,
        direction: activeTransition.direction,
        translateY: Math.round(progress * PIPE_TRAVEL_PX * directionMultiplier),
      })

      if (progress < 1) {
        transitionTimeoutRef.current = window.requestAnimationFrame(step)
        return
      }

      if (shouldRestoreParent) {
        restoreLevelSnapshot({
          fallbackLevelId: targetLevelId,
          fallbackSpawnId: targetSpawnId,
        })
      } else {
        captureLevelSnapshot(currentLevelId)
        setCurrentLevelId(targetLevelId)
        resetLevelState(targetLevelId, { spawnId: targetSpawnId, showIntro: false })
      }

      setPipeTransition({
        active: false,
        direction: null,
        translateY: 0,
      })
      transitionTimeoutRef.current = null
    }

    transitionTimeoutRef.current = window.requestAnimationFrame(step)
  }, [
    bottom,
    currentLevel,
    currentLevelId,
    captureLevelSnapshot,
    enabled,
    left,
    motionRef,
    objects,
    pixels,
    playerForm,
    resetLevelState,
    restoreLevelSnapshot,
    setLeftSafe,
    setCurrentLevelId,
    setPipeTransition,
  ])
}
