import { useEffect, useState } from 'react'

import { getObjectWidth } from 'libs/world/objectDimensions'

export default function useDebugMetrics({
  debug,
  worldRef,
  objects,
  pixels,
  left,
  bottom,
  lives,
  playerForm,
  renderLimit,
  visibleMinPx,
  visibleMaxPx,
  decorMinPx,
  decorMaxPx,
  decorations = {},
  motionRef,
}) {
  const clouds = decorations.clouds ?? []
  const mountains = decorations.mountains ?? []
  const plants = decorations.plants ?? []

  const [ domCount, setDomCount ] = useState(0)
  const [ worldDomCount, setWorldDomCount ] = useState(0)
  const [ memoryStats, setMemoryStats ] = useState(null)
  const [ marioMotion, setMarioMotion ] = useState('-')

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

      const motion = motionRef?.current
      const nextMarioMotion = []

      if (motion?.input?.left && !motion?.input?.right) nextMarioMotion.push('←')
      if (motion?.vy > 10) nextMarioMotion.push('↑')
      if (motion?.input?.right && !motion?.input?.left) nextMarioMotion.push('→')
      if (motion?.vy < -10) nextMarioMotion.push('↓')

      setMarioMotion(nextMarioMotion.length > 0 ? nextMarioMotion.join(' ') : '-')
    }

    updateDomCounts()
    const interval = setInterval(updateDomCounts, 500)
    return () => clearInterval(interval)
  }, [debug, motionRef, worldRef])

  const visibleObjects = objects.filter(el => {
    const elLeft = el.x * pixels
    const elRight = elLeft + getObjectWidth(el)
    return elRight > visibleMinPx && elLeft < visibleMaxPx
  })

  const visibleObjectsCount = visibleObjects.length
  const visibleSpritesApprox = visibleObjects.filter(el => el.type !== 'Floor').length
  const visibleBrickCount = visibleObjects.filter(el => el.type === 'Brick').length
  const visibleSolidCount = visibleObjects.filter(el => el.type === 'Solid').length
  const visibleMysteryCount = visibleObjects.filter(el => el.type === 'Mystery').length
  const visiblePipeCount = visibleObjects.filter(el => el.type === 'Pipe').length

  const visibleFloorTiles = objects
    .filter(el => el.type === 'Floor')
    .reduce((total, el) => {
      const segmentLeftPx = el.x * pixels
      const startTile = Math.max(0, Math.floor((visibleMinPx - segmentLeftPx) / pixels))
      const endTile = Math.min(el.size, Math.ceil((visibleMaxPx - segmentLeftPx) / pixels))
      return total + Math.max(0, endTile - startTile)
    }, 0)

  const visibleBushCount = plants.filter(p => {
    const plantLeft = (p.x * pixels) + (pixels / 2)
    const plantWidth = (1 + p.size) * pixels
    const plantRight = plantLeft + plantWidth
    return plantRight > decorMinPx && plantLeft < decorMaxPx
  }).length

  const visibleCloudCount = clouds.filter(cloud => {
    const cloudLeft = cloud.x * pixels
    const cloudWidth = (1 + cloud.size) * pixels
    const cloudRight = cloudLeft + cloudWidth
    return cloudRight > decorMinPx && cloudLeft < decorMaxPx
  }).length

  const visibleMountainCount = mountains.filter(mountain => {
    const mountainLeft = mountain.x * pixels
    const mountainWidth = mountain.size === 2 ? 320 : 168
    const mountainRight = mountainLeft + mountainWidth
    return mountainRight > decorMinPx && mountainLeft < decorMaxPx
  }).length

  return {
    domCount,
    worldDomCount,
    memoryStats,
    visibleMinPx,
    visibleMaxPx,
    visibleObjects,
    visibleObjectsCount,
    visibleSpritesApprox,
    visibleBrickCount,
    visibleSolidCount,
    visibleMysteryCount,
    visiblePipeCount,
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
      lives,
      playerForm,
      marioMotion,
      visibleObjectsCount,
      visibleSpritesApprox,
      visibleBrickCount,
      visibleSolidCount,
      visibleMysteryCount,
      visiblePipeCount,
      visibleFloorTiles,
      visibleBushCount,
      visibleCloudCount,
      visibleMountainCount,
      memoryStats,
    },
  }
}
