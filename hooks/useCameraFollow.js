import { useEffect } from 'react'

import useIsomorphicLayoutEffect from 'hooks/useIsomorphicLayoutEffect'
import { TILE_SIZE } from 'libs/worldConstants'

export default function useCameraFollow({
  gameLoopEnabled,
  worldRef,
  cameraXRef,
  left,
  width,
  maxCameraX,
}) {
  useIsomorphicLayoutEffect(() => {
    if (!gameLoopEnabled || !worldRef.current) return
    if (!width) return

    const currentCameraX = cameraXRef.current
    const followX = (width / 2) - TILE_SIZE
    let nextCameraX = left - followX

    nextCameraX = Math.max(0, Math.round(nextCameraX))
    nextCameraX = Math.min(nextCameraX, maxCameraX)

    if (Math.abs(currentCameraX - nextCameraX) > 0) {
      cameraXRef.current = nextCameraX
      worldRef.current.style.transform = `translate3d(${-nextCameraX}px, 0, 0)`
    }
  }, [gameLoopEnabled, worldRef, cameraXRef, left, width, maxCameraX])

  useEffect(() => {
    if (gameLoopEnabled) return

    cameraXRef.current = 0
    if (worldRef.current) {
      worldRef.current.style.transform = ''
    }
  }, [gameLoopEnabled, worldRef, cameraXRef])
}
