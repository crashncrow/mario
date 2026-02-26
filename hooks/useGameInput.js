import { useCallback, useEffect } from 'react'

import useDoubleClick from 'hooks/clicks'

export default function useGameInput({
  buttonRef,
  gameLoopEnabled,
  setLoopInput,
}) {
  useEffect(() => {
    if (!gameLoopEnabled) return

    const onKeyDown = e => {
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
  }, [gameLoopEnabled, setLoopInput])

  useEffect(() => {
    if (!gameLoopEnabled) return

    const onWheel = e => {
      // The camera follows Mario in the game loop; manual wheel scroll fights it and causes shaking.
      e.preventDefault()
    }

    window.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
    }
  }, [gameLoopEnabled])

  const triggerLoopJump = useCallback(() => {
    setLoopInput({ jump: true })
    setTimeout(() => {
      setLoopInput({ jump: false })
    }, 60)
  }, [setLoopInput])

  const onSingleClick = useCallback(() => {
    if (!gameLoopEnabled) return
    triggerLoopJump()
  }, [gameLoopEnabled, triggerLoopJump])

  const onDoubleClick = useCallback(() => {
    if (!gameLoopEnabled) return
    triggerLoopJump()
  }, [gameLoopEnabled, triggerLoopJump])

  useDoubleClick({
    onSingleClick,
    onDoubleClick,
    ref: buttonRef,
    latency: 250,
  })
}
