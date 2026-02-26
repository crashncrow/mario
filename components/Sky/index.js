import { useAppContext } from 'contexts/AppContext'
import Cloud from 'components/Cloud'

export const SKY_CLOUDS = [
  { x: 9, size: 1 },
  { x: 20, size: 1, y: 2 },
  { x: 29, size: 3 },
  { x: 38, size: 2 },
  { x: 58, size: 1 },
  { x: 68, size: 1, y: 2 },
  { x: 76, size: 3 },
  { x: 86, size: 2, y: 2 },
  { x: 105, size: 1 },
  { x: 116, size: 1, y: 2 },
  { x: 125, size: 3 },
  { x: 134, size: 2, y: 2 },
  { x: 154, size: 1 },
  { x: 166, size: 1, y: 2 },
  { x: 174, size: 3 },
  { x: 184, size: 2, y: 2 },
  { x: 203, size: 1 },
]

const Sky = ({ cameraX = null }) => {
  const { left, width, pixels } = useAppContext()
  const preloadPx = pixels * 8
  const cameraLeft = cameraX ?? left
  const minPx = Math.max(0, cameraLeft - preloadPx)
  const maxPx = cameraLeft + (width || 0) + preloadPx

  return (
    <>
      {
        SKY_CLOUDS.filter(cloud => {
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

export default Sky
