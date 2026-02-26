import { useEffect, useState } from 'react'

import { SKY_CLOUDS } from 'components/Sky'
import { PLANTS_BUSHES } from 'components/Plants'
import { MOUNTAINS_LIST } from 'components/Mountains'

export default function useDebugMetrics({
  debug,
  worldRef,
  objects,
  pixels,
  width,
  left,
  bottom,
  renderLimit,
  gameLoopEnabled,
  maxCameraX,
}) {
  const [ domCount, setDomCount ] = useState(0)
  const [ worldDomCount, setWorldDomCount ] = useState(0)
  const [ memoryStats, setMemoryStats ] = useState(null)

  useEffect(() => {
    if (!debug) return

    const updateDomCounts = () => {
      setDomCount(document.querySelectorAll('*').length)
      setWorldDomCount(worldRef.current ? worldRef.current.querySelectorAll('*').length : 0)

      if (typeof performance !== 'undefined' && performance.memory) {
        setMemoryStats({
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit,
        })
      } else {
        setMemoryStats(null)
      }
    }

    updateDomCounts()
    const interval = setInterval(updateDomCounts, 500)
    return () => clearInterval(interval)
  }, [debug, worldRef])

  const worldPreloadTiles = 12
  const cameraXForMetrics = gameLoopEnabled
    ? Math.max(0, Math.min(maxCameraX, Math.round(left - 112)))
    : 0
  const visibleMinPx = Math.max(0, cameraXForMetrics - (worldPreloadTiles * pixels))
  const visibleMaxPx = cameraXForMetrics + (width || 0) + (worldPreloadTiles * pixels)

  const visibleObjects = objects.filter(el => {
    const elLeft = el.x * pixels
    const elRight = elLeft + (el.width ?? pixels)
    return elRight > visibleMinPx && elLeft < visibleMaxPx
  })

  const visibleObjectsCount = visibleObjects.length
  const visibleSpritesApprox = visibleObjects.filter(el => el.type !== 'Floor').length
  const visibleBrickCount = visibleObjects.filter(el => el.type === 'Brick').length
  const visibleBlockCount = visibleObjects.filter(el => el.type === 'Block').length
  const visibleBoxCount = visibleObjects.filter(el => el.type === 'Box').length

  const visibleFloorTiles = objects
    .filter(el => el.type === 'Floor')
    .reduce((total, el) => {
      const segmentLeftPx = el.x * pixels
      const startTile = Math.max(0, Math.floor((visibleMinPx - segmentLeftPx) / pixels))
      const endTile = Math.min(el.size, Math.ceil((visibleMaxPx - segmentLeftPx) / pixels))
      return total + Math.max(0, endTile - startTile)
    }, 0)

  const decorPreloadPx = pixels * 8
  const decorMinPx = Math.max(0, cameraXForMetrics - decorPreloadPx)
  const decorMaxPx = cameraXForMetrics + (width || 0) + decorPreloadPx

  const visibleBushCount = PLANTS_BUSHES.filter(p => {
    const plantLeft = (p.x * pixels) + (pixels / 2)
    const plantWidth = (1 + p.size) * pixels
    const plantRight = plantLeft + plantWidth
    return plantRight > decorMinPx && plantLeft < decorMaxPx
  }).length

  const visibleCloudCount = SKY_CLOUDS.filter(cloud => {
    const cloudLeft = cloud.x * pixels
    const cloudWidth = (1 + cloud.size) * pixels
    const cloudRight = cloudLeft + cloudWidth
    return cloudRight > decorMinPx && cloudLeft < decorMaxPx
  }).length

  const visibleMountainCount = MOUNTAINS_LIST.filter(mountain => {
    const mountainLeft = mountain.x * pixels
    const mountainWidth = mountain.size === 2 ? 320 : 168
    const mountainRight = mountainLeft + mountainWidth
    return mountainRight > decorMinPx && mountainLeft < decorMaxPx
  }).length

  return {
    domCount,
    worldDomCount,
    memoryStats,
    worldPreloadTiles,
    cameraXForMetrics,
    visibleMinPx,
    visibleMaxPx,
    visibleObjects,
    visibleObjectsCount,
    visibleSpritesApprox,
    visibleBrickCount,
    visibleBlockCount,
    visibleBoxCount,
    visibleFloorTiles,
    visibleBushCount,
    visibleCloudCount,
    visibleMountainCount,
    debugPanelProps: {
      domCount,
      worldDomCount,
      renderLimit,
      left,
      bottom,
      visibleObjectsCount,
      visibleSpritesApprox,
      visibleBrickCount,
      visibleBlockCount,
      visibleBoxCount,
      visibleFloorTiles,
      visibleBushCount,
      visibleCloudCount,
      visibleMountainCount,
      memoryStats,
    },
  }
}
