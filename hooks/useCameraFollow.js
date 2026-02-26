import { useEffect } from 'react'

import useIsomorphicLayoutEffect from 'hooks/useIsomorphicLayoutEffect'

export default function useCameraFollow({
  gameLoopEnabled,
  worldRef,
  cameraXRef,
  left,
  maxCameraX,
}) {
  useIsomorphicLayoutEffect(() => {
    if (!gameLoopEnabled || !worldRef.current) return

    const currentCameraX = cameraXRef.current
    const screenX = left - currentCameraX
    const deadZoneLeft = 88
    const deadZoneRight = 112

    let nextCameraX = currentCameraX

    if (screenX < deadZoneLeft) {
      nextCameraX = left - deadZoneLeft
    } else if (screenX > deadZoneRight) {
      nextCameraX = left - deadZoneRight
    }

    nextCameraX = Math.max(0, Math.round(nextCameraX))
    nextCameraX = Math.min(nextCameraX, maxCameraX)

    if (Math.abs(currentCameraX - nextCameraX) > 0) {
      cameraXRef.current = nextCameraX
      worldRef.current.style.transform = `translate3d(${-nextCameraX}px, 0, 0)`
    }
  }, [gameLoopEnabled, worldRef, cameraXRef, left, maxCameraX])

  useEffect(() => {
    if (gameLoopEnabled) return

    cameraXRef.current = 0
    if (worldRef.current) {
      worldRef.current.style.transform = ''
    }
  }, [gameLoopEnabled, worldRef, cameraXRef])
}
