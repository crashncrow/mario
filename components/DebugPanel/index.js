const DebugPanel = ({
  domCount,
  worldDomCount,
  renderLimit,
  left,
  bottom,
  visibleObjectsCount,
  visibleSpritesApprox,
  visibleFloorTiles,
}) => {
  return (
    <div
      className='fixed top-4 left-4 p-2 bg-black/80 border-2 border-white text-[10px] leading-4 text-white'
      style={{ zIndex: 60 }}
    >
      <div>Debug DOM</div>
      <div>Total: {domCount}</div>
      <div>Mundo: {worldDomCount}</div>
      <div>renderLimit: {Math.round(renderLimit)}</div>
      <div>Mario: x {Math.round(left)} / y {Math.round(bottom)}</div>
      <div>Objetos render: {visibleObjectsCount}</div>
      <div>Sprites aprox: {visibleSpritesApprox}</div>
      <div>Floor tiles: {visibleFloorTiles}</div>
    </div>
  )
}

export default DebugPanel
