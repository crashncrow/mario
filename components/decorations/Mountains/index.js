import { memo } from 'react'
import { TILE_SIZE } from 'libs/world/constants'
import Mountain from 'components/decorations/Mountain'

const Mountains = ({ minPx = 0, maxPx = 0, mountains = [] }) => {
  const pixels = TILE_SIZE

  return (
    <>
      {
        mountains.filter(mountain => {
          const mountainLeft = mountain.x * pixels
          const mountainWidth = mountain.size === 2 ? 320 : 168
          const mountainRight = mountainLeft + mountainWidth
          return mountainRight > minPx && mountainLeft < maxPx
        }).map((mountain, i) => (
          <Mountain x={mountain.x} size={mountain.size} pixels={pixels} key={`mountain_${i}`}/>
        ))
      }
    </>
  )
}

export default memo(Mountains)
