import { useAppContext } from 'contexts/AppContext'
import Mountain from 'components/decorations/Mountain'

const Mountains = ({ cameraX = null, mountains = [] }) => {
  const { left, width, pixels } = useAppContext()
  const preloadPx = pixels * 8
  const cameraLeft = cameraX ?? left
  const minPx = Math.max(0, cameraLeft - preloadPx)
  const maxPx = cameraLeft + (width || 0) + preloadPx

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

export default Mountains
