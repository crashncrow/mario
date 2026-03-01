import FloorTile from 'components/world/FloorTile'

const getVisibleTileRange = ({ segment, pixels, minPx, maxPx }) => {
  const segmentLeftPx = segment.x * pixels
  const totalTiles = segment.size
  const startTile = Math.max(0, Math.floor((minPx - segmentLeftPx) / pixels))
  const endTile = Math.min(totalTiles, Math.ceil((maxPx - segmentLeftPx) / pixels))
  const tileCount = Math.max(0, endTile - startTile)

  return {
    segmentLeftPx,
    startTile,
    tileCount,
  }
}

const Floor = ({ segments, pixels, minPx = 0, maxPx }) => (
  segments.map(segment => {
    const {
      segmentLeftPx,
      startTile,
      tileCount,
    } = getVisibleTileRange({
      segment,
      pixels,
      minPx,
      maxPx,
    })

    if (tileCount === 0) return null

    return (
      <div
        className='absolute bottom-0'
        style={{ left: `${segmentLeftPx + (startTile * pixels)}px` }}
        key={`floor_segment_${segment.x}_${segment.size}`}
      >
        <div className='inline-flex'>
          {Array(tileCount)
            .fill(1)
            .map((_, index) => (
              <FloorTile key={`floor_${segment.x}_${startTile + index}`} />
            ))}
        </div>
      </div>
    )
  })
)

export default Floor
