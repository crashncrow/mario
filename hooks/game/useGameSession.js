import { useEffect, useRef, useState } from 'react'
import { getObjectWidth } from 'libs/world/objectDimensions'
import { getFlagBounds } from 'libs/world/flag'
import { getPlayerBounds } from 'libs/playerDimensions'

export default function useGameSession({
  gameLoopEnabled,
  isPaused,
  isLevelIntroVisible = false,
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
    if (isPaused || isLevelIntroVisible) return
    if (gameStatus !== 'playing') return

    const timerId = window.setTimeout(() => {
      setTime(prev => Math.max(0, prev - 1))
    }, 1000)

    return () => {
      window.clearTimeout(timerId)
    }
  }, [gameLoopEnabled, isPaused, isLevelIntroVisible, time, gameStatus])

  useEffect(() => {
    const marioBounds = getPlayerBounds({ x: left, y: bottom, pixels, playerForm })
    const flagBounds = getFlagBounds({ x: flag.x, y: flag.y, pixels })

    const touchesFlag = (
      marioBounds.left < flagBounds.right &&
      marioBounds.right > flagBounds.left &&
      marioBounds.bottom < flagBounds.top &&
      marioBounds.top > flagBounds.bottom
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

  const restoreSessionState = ({ nextTime = initialTime } = {}) => {
    terminalStateRef.current = null
    setTime(nextTime)
    setGameStatus('playing')
    setLoseReason(null)
  }

  return {
    time,
    gameStatus,
    loseReason,
    floorEndPx,
    restoreSessionState,
  }
}
