import { useAppContext } from 'contexts/AppContext'
import Cloud from 'components/decorations/Cloud'

const Sky = ({ cameraX = null, clouds = [] }) => {
  const { left, width, pixels } = useAppContext()
  const preloadPx = pixels * 8
  const cameraLeft = cameraX ?? left
  const minPx = Math.max(0, cameraLeft - preloadPx)
  const maxPx = cameraLeft + (width || 0) + preloadPx

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

export default Sky
