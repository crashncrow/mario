const DebugPanel = ({
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
}) => {
  const formatMb = value => `${(value / 1024 / 1024).toFixed(1)} MB`

  return (
    <div
      className='fixed top-4 left-4 p-2 bg-black/80 border-2 border-white text-[10px] leading-4 text-white min-w-xs'
      style={{ zIndex: 60 }}
    >
      <div>Heap used: {memoryStats ? formatMb(memoryStats.used) : 'N/A'}</div>
      <div>Heap total: {memoryStats ? formatMb(memoryStats.total) : 'N/A'}</div>
      <div>Render limit: {Math.round(renderLimit)}</div>
      <div>Objetos render: {visibleObjectsCount}</div>
      <div>Sprites aprox: {visibleSpritesApprox}</div>
      <br/>
      <div>DOM</div>
      <div>- total: {domCount}</div>
      <div>- world: {worldDomCount}</div>
      <br/>
      <div>Character:</div>
      <div>- position: X {Math.round(left)} / Y {Math.round(bottom)}</div>
      <div>- lives: {lives}</div>
      <div>- form: {playerForm}</div>
      <div>- motion: {marioMotion}</div>
      <br/>
      <div>Decorations:</div>
      <div>- bushes: {visibleBushCount}</div>
      <div>- clouds: {visibleCloudCount}</div>
      <div>- mountains: {visibleMountainCount}</div>
      <br/>
      <div>World:</div>
      <div>- bricks: {visibleBrickCount}</div>
      <div>- solids: {visibleSolidCount}</div>
      <div>- mystery: {visibleMysteryCount}</div>
      <div>- pipes: {visiblePipeCount}</div>
      <div>- floor: {visibleFloorTiles}</div>
      
    </div>
  )
}

export default DebugPanel
