import { useEffect, useState } from 'react'
import { TILE_SIZE } from 'libs/worldConstants'

export default function useVisibleWorldWindow({
  objects,
  pixels,
  width,
  left,
  gameLoopEnabled,
}) {
  const [scrollX, setScrollX] = useState(0)
  const worldPreloadTiles = 12
  const decorPreloadTiles = 8

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateScroll = () => {
      setScrollX(window.scrollX || 0)
    }

    updateScroll()
    window.addEventListener('scroll', updateScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateScroll)
    }
  }, [])

  const floorEndPx = objects
    .filter(el => el.type === 'Floor')
    .reduce((max, el) => Math.max(max, (el.x * pixels) + el.width), 0)

  const maxCameraX = Math.max(0, floorEndPx - (width || 0))

  const cameraXForMetrics = gameLoopEnabled
    ? Math.max(0, Math.min(maxCameraX, Math.round(left - (((width || 0) / 2) - TILE_SIZE))))
    : Math.max(0, Math.min(maxCameraX, Math.round(scrollX)))

  const visibleMinPx = Math.max(0, cameraXForMetrics - (worldPreloadTiles * pixels))
  const visibleMaxPx = cameraXForMetrics + (width || 0) + (worldPreloadTiles * pixels)

  const decorMinPx = Math.max(0, cameraXForMetrics - (decorPreloadTiles * pixels))
  const decorMaxPx = cameraXForMetrics + (width || 0) + (decorPreloadTiles * pixels)

  return {
    floorEndPx,
    maxCameraX,
    worldPreloadTiles,
    decorPreloadTiles,
    cameraXForMetrics,
    visibleMinPx,
    visibleMaxPx,
    decorMinPx,
    decorMaxPx,
  }
}
