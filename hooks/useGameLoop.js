import { useEffect, useRef } from 'react'

export default function useGameLoop(update, enabled = true) {
  const updateRef = useRef(update)
  const frameRef = useRef(null)
  const lastTimeRef = useRef(0)
  const activeRef = useRef(false)

  useEffect(() => {
    updateRef.current = update
  }, [update])

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return
    activeRef.current = true

    const loop = time => {
      if (!activeRef.current) return

      if (!lastTimeRef.current) {
        lastTimeRef.current = time
      }

      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.033)
      lastTimeRef.current = time
      updateRef.current(dt, time)
      if (!activeRef.current) return
      frameRef.current = window.requestAnimationFrame(loop)
    }

    frameRef.current = window.requestAnimationFrame(loop)

    return () => {
      activeRef.current = false
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current)
      }
      frameRef.current = null
      lastTimeRef.current = 0
    }
  }, [enabled])
}
