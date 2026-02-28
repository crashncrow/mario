import { useEffect, useRef, useState } from 'react'

const FLAG_X_TILES = 201
const FLAG_Y_TILES = 2

export default function useGameSession({
  gameLoopEnabled,
  left,
  bottom,
  pixels,
  objects,
  enemyHit = false,
  lives = 3,
  initialTime = 400,
}) {
  const [time, setTime] = useState(initialTime)
  const [gameStatus, setGameStatus] = useState('playing')
  const [loseReason, setLoseReason] = useState(null)
  const terminalStateRef = useRef(null)

  const floorEndPx = objects
    .filter(obj => obj.type === 'Floor')
    .reduce((max, obj) => Math.max(max, (obj.x * pixels) + obj.width), 0)

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
    const marioLeft = left + 10
    const marioRight = left + pixels - 20
    const marioBottom = bottom
    const marioTop = bottom + pixels

    // Approximate Flag area (pole + fabric + top) in world coordinates.
    const flagLeft = (FLAG_X_TILES * pixels) - 24
    const flagRight = (FLAG_X_TILES * pixels) + (2 * pixels)
    const flagBottom = FLAG_Y_TILES * pixels
    const flagTop = flagBottom + (8 * pixels)

    const touchesFlag = (
      marioLeft < flagRight &&
      marioRight > flagLeft &&
      marioBottom < flagTop &&
      marioTop > flagBottom
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
  }, [time, left, bottom, pixels, floorEndPx, initialTime, gameStatus, gameLoopEnabled, enemyHit, lives])

  return {
    time,
    gameStatus,
    loseReason,
    floorEndPx,
  }
}
