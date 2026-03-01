import { useEffect, useRef, useState } from 'react'
import { getObjectWidth } from 'libs/world/objectDimensions'
import { getPlayerBounds } from 'libs/playerDimensions'

export default function useGameSession({
  gameLoopEnabled,
  left,
  bottom,
  pixels,
  playerForm,
  objects,
  enemyHit = false,
  lives = 3,
  initialTime = 400,
  flag,
  levelKey,
}) {
  const [time, setTime] = useState(initialTime)
  const [gameStatus, setGameStatus] = useState('playing')
  const [loseReason, setLoseReason] = useState(null)
  const terminalStateRef = useRef(null)

  const floorEndPx = objects
    .filter(obj => obj.type === 'Floor')
    .reduce((max, obj) => Math.max(max, (obj.x * pixels) + getObjectWidth(obj)), 0)

  useEffect(() => {
    if (!gameLoopEnabled) return
    if (time <= 0) return
    if (gameStatus !== 'playing') return

    const timerId = window.setTimeout(() => {
      setTime(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [gameLoopEnabled, time, gameStatus])

  useEffect(() => {
    const marioBounds = getPlayerBounds({ x: left, y: bottom, pixels, playerForm })

    // Approximate Flag area (pole + fabric + top) in world coordinates.
    const flagLeft = (flag.x * pixels) - 24
    const flagRight = (flag.x * pixels) + (2 * pixels)
    const flagBottom = flag.y * pixels
    const flagTop = flagBottom + (8 * pixels)

    const touchesFlag = (
      marioBounds.left < flagRight &&
      marioBounds.right > flagLeft &&
      marioBounds.bottom < flagTop &&
      marioBounds.top > flagBottom
    )
    const fellOffLevel = gameLoopEnabled && bottom <= 0

    const terminalState =
      enemyHit || time <= 0 || fellOffLevel
        ? 'lost'
        : touchesFlag
          ? 'won'
          : null

    if (!terminalState) {
      terminalStateRef.current = null
      if (gameStatus !== 'playing') {
        const rafId = window.requestAnimationFrame(() => {
          setGameStatus('playing')
          setLoseReason(null)
        })
        return () => window.cancelAnimationFrame(rafId)
      }
      return
    }

    if (terminalStateRef.current === terminalState) {
      return
    }

    terminalStateRef.current = terminalState
    const rafId = window.requestAnimationFrame(() => {
      setGameStatus(terminalState)
      setLoseReason(
        terminalState === 'lost'
          ? (enemyHit ? 'enemy' : (time <= 0 ? 'time' : 'fall'))
          : null
      )
      setTime(initialTime)
    })

    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [time, left, bottom, pixels, playerForm, flag, floorEndPx, initialTime, gameStatus, gameLoopEnabled, enemyHit, lives])

  useEffect(() => {
    terminalStateRef.current = null
    const rafId = window.requestAnimationFrame(() => {
      setTime(initialTime)
      setGameStatus('playing')
      setLoseReason(null)
    })

    return () => window.cancelAnimationFrame(rafId)
  }, [initialTime, levelKey])

  return {
    time,
    gameStatus,
    loseReason,
    floorEndPx,
  }
}
