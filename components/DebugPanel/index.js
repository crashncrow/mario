const DebugPanel = ({
  domCount,
  worldDomCount,
  renderLimit,
  left,
  bottom,
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
}) => {
  const formatMb = value => `${(value / 1024 / 1024).toFixed(1)} MB`

  return (
    <div
      className='fixed top-4 left-4 p-2 bg-black/80 border-2 border-white text-[10px] leading-4 text-white min-w-xs'
      style={{ zIndex: 60 }}
    >
      <div>Debug DOM</div>
      <div>Total: {domCount}</div>
      <div>Mundo: {worldDomCount}</div>
      <div>renderLimit: {Math.round(renderLimit)}</div>
      <div>Objetos render: {visibleObjectsCount}</div>
      <div>Sprites aprox: {visibleSpritesApprox}</div>
      <br/>
      <div>Mario position: x {Math.round(left)} / y {Math.round(bottom)}</div>
      <div>Mario motion: {marioMotion}</div>
      <br/>
      <div>Bricks: {visibleBrickCount}</div>
      <div>Solids: {visibleSolidCount}</div>
      <div>Mystery: {visibleMysteryCount}</div>
      <div>Pipes: {visiblePipeCount}</div>
      <div>Floor: {visibleFloorTiles}</div>
      <div>Bushes: {visibleBushCount}</div>
      <div>Clouds: {visibleCloudCount}</div>
      <div>Mountains: {visibleMountainCount}</div>
      <br/>
      <div>Heap usado: {memoryStats ? formatMb(memoryStats.used) : 'N/A'}</div>
      <div>Heap total: {memoryStats ? formatMb(memoryStats.total) : 'N/A'}</div>
    </div>
  )
}

export default DebugPanel
