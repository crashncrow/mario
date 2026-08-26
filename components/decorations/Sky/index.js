import { memo } from 'react'
import { TILE_SIZE } from 'libs/world/constants'
import Cloud from 'components/decorations/Cloud'

const Sky = ({ minPx = 0, maxPx = 0, clouds = [] }) => {
  const pixels = TILE_SIZE

  return (
    <>
      {
        clouds.filter(cloud => {
          const cloudLeft = cloud.x * pixels
          const cloudWidth = (1 + cloud.size) * pixels
          const cloudRight = cloudLeft + cloudWidth
          return cloudRight > minPx && cloudLeft < maxPx
        }).map((cloud, i) => (
          <Cloud x={cloud.x} y={cloud.y} size={cloud.size} pixels={pixels} key={`cloud_${i}`} />
        ))
      }
    </>
  )
}

export default memo(Sky)
