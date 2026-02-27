import { useEffect, useRef, useState } from 'react'

export default function useBlockBump({ touches, interactive }) {
  const [isBumping, setIsBumping] = useState(false)
  const prevTouchesRef = useRef(touches)

  useEffect(() => {
    if (!interactive) return
    if (touches <= prevTouchesRef.current) return

    prevTouchesRef.current = touches
    const raf = requestAnimationFrame(() => setIsBumping(true))
    const timer = setTimeout(() => setIsBumping(false), 180)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [touches, interactive])

  useEffect(() => {
    prevTouchesRef.current = touches
  }, [touches])

  return isBumping
}
