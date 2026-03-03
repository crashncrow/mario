import { useEffect, useRef } from 'react'
import { getPlayerBounds } from 'libs/playerDimensions'
import { getObjectHeight, getObjectWidth } from 'libs/world/objectDimensions'
import { PIPE_TRANSITION_DURATION_MS, PIPE_TRAVEL_PX, getPipeTransitionDelta } from 'libs/world/pipeTransition'

const getEntryDirection = transition => transition.entryDirection ?? transition.direction

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
  const getPipeForTransition = (transition, worldObjects) => {
    if (transition.pipeId) {
      const pipeById = worldObjects.find(obj => (
        obj.type === 'Pipe' &&
        obj.pipeId === transition.pipeId
      ))
      if (pipeById) return pipeById
    }

    return worldObjects.find(obj => (
      obj.type === 'Pipe' &&
      obj.x === transition.x &&
      obj.y === transition.y
    )) ?? null
  }

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
    const marioCenterY = (marioBounds.bottom + marioBounds.top) / 2
    const isGrounded = motionRef.current.grounded

    const activeTransition = transitions.find(transition => {
      const entryDirection = getEntryDirection(transition)
      const wantsDown = entryDirection === 'down' && input.down
      const wantsUp = entryDirection === 'up' && input.up
      const wantsLeft = entryDirection === 'left' && input.left
      const wantsRight = entryDirection === 'right' && input.right
      if (!wantsDown && !wantsUp && !wantsLeft && !wantsRight) return false
      if ((wantsDown || wantsUp) && !isGrounded) return false

      const pipe = getPipeForTransition(transition, objects)
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
      const overlapsPipeMiddleY = marioCenterY >= pipeBottom && marioCenterY <= pipeTop
      const touchesPipeLeft = (
        marioBounds.right >= pipeLeft - 4 &&
        marioBounds.right <= pipeLeft + pixels
      )
      const touchesPipeRight = (
        marioBounds.left <= pipeRight + 4 &&
        marioBounds.left >= pipeRight - pixels
      )

      if (wantsDown || wantsUp) {
        return centeredOnPipe && overlapsPipeTop
      }

      if (wantsLeft) {
        return overlapsPipeMiddleY && touchesPipeRight
      }

      return overlapsPipeMiddleY && touchesPipeLeft
    })

    if (!activeTransition) return

    const targetLevelId = activeTransition.targetLevelId
    const targetSpawnId = activeTransition.targetSpawnId ?? null
    const shouldRestoreParent = activeTransition.returnToParent === true
    const pipe = getPipeForTransition(activeTransition, objects)
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
    const entryDirection = getEntryDirection(activeTransition)

    if (entryDirection === 'down' || entryDirection === 'up') {
      setLeftSafe(centeredLeft)
    }
    setPipeTransition({
      active: true,
      direction: entryDirection,
      translateX: 0,
      translateY: 0,
    })

    const start = performance.now()
    const transitionDelta = getPipeTransitionDelta(entryDirection)

    const step = now => {
      const progress = Math.min(1, (now - start) / PIPE_TRANSITION_DURATION_MS)
      setPipeTransition({
        active: true,
        direction: entryDirection,
        translateX: Math.round(progress * transitionDelta.x),
        translateY: Math.round(progress * transitionDelta.y),
      })

      if (progress < 1) {
        transitionTimeoutRef.current = window.requestAnimationFrame(step)
        return
      }

      if (shouldRestoreParent) {
        restoreLevelSnapshot({
          fallbackLevelId: targetLevelId,
          fallbackSpawnId: targetSpawnId,
          exitDirection: activeTransition.exitDirection ?? null,
        })
      } else {
        captureLevelSnapshot(currentLevelId)
        setCurrentLevelId(targetLevelId)
        resetLevelState(targetLevelId, {
          spawnId: targetSpawnId,
          showIntro: false,
          pipeExitDirection: activeTransition.exitDirection ?? null,
        })
      }

      setPipeTransition({
        active: false,
        direction: null,
        translateX: 0,
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
