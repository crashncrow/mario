import { useCallback, useEffect } from 'react'

import useDoubleClick from 'hooks/shared/clicks'

export default function useGameInput({
  buttonRef,
  gameLoopEnabled,
  isPaused,
  setLoopInput,
  togglePause,
}) {
  useEffect(() => {
    if (!gameLoopEnabled) return

    const onKeyDown = e => {
      if (e.code === 'KeyP' || e.code === 'Escape') {
        e.preventDefault()
        togglePause()
        return
      }

      if (isPaused) return

      if (e.code === 'ArrowLeft') {
        e.preventDefault()
        setLoopInput({ left: true })
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        setLoopInput({ right: true })
      } else if (e.code === 'Space') {
        e.preventDefault()
        setLoopInput({ jump: true })
      }
    }

    const onKeyUp = e => {
      if (isPaused) return

      if (e.code === 'ArrowLeft') {
        setLoopInput({ left: false })
      } else if (e.code === 'ArrowRight') {
        setLoopInput({ right: false })
      } else if (e.code === 'Space') {
        setLoopInput({ jump: false })
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [gameLoopEnabled, isPaused, setLoopInput, togglePause])

  useEffect(() => {
    if (!gameLoopEnabled || isPaused) return

    const onWheel = e => {
      // The camera follows Mario in the game loop; manual wheel scroll fights it and causes shaking.
      e.preventDefault()
    }

    window.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
    }
  }, [gameLoopEnabled, isPaused])

  const triggerLoopJump = useCallback(() => {
    setLoopInput({ jump: true })
    setTimeout(() => {
      setLoopInput({ jump: false })
    }, 60)
  }, [setLoopInput])

  const onSingleClick = useCallback(() => {
    if (!gameLoopEnabled || isPaused) return
    triggerLoopJump()
  }, [gameLoopEnabled, isPaused, triggerLoopJump])

  const onDoubleClick = useCallback(() => {
    if (!gameLoopEnabled || isPaused) return
    triggerLoopJump()
  }, [gameLoopEnabled, isPaused, triggerLoopJump])

  useDoubleClick({
    onSingleClick,
    onDoubleClick,
    ref: buttonRef,
    latency: 250,
  })
}
