import { useAppContext } from 'contexts/AppContext'
import Cloud from 'components/Cloud'

export const SKY_CLOUDS = [
  { x: 9,   y: 1, size: 1 },
  { x: 20,  y: 2, size: 1 },
  { x: 29,  y: 1, size: 3 },
  { x: 38,  y: 1, size: 2 },
  { x: 58,  y: 1, size: 1 },
  { x: 68,  y: 2, size: 1 },
  { x: 76,  y: 1, size: 3 },
  { x: 86,  y: 2, size: 2 },
  { x: 105, y: 1, size: 1 },
  { x: 116, y: 2, size: 1 },
  { x: 125, y: 1, size: 3 },
  { x: 134, y: 2, size: 2 },
  { x: 154, y: 1, size: 1 },
  { x: 166, y: 2, size: 1 },
  { x: 174, y: 1, size: 3 },
  { x: 184, y: 2, size: 2 },
  { x: 203, y: 1, size: 1 },
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
