import { useAppContext } from 'contexts/AppContext'
import Mountain from 'components/decorations/Mountain'

export const MOUNTAINS_LIST = [
  {x: 0, size: 2},
  {x: 17, size: 1},
  {x: 49, size: 2},
  {x: 65, size: 1},
  {x: 96, size: 2},
  {x: 113, size: 1},
  {x: 145, size: 2},
  {x: 161, size: 2},
  {x: 195, size: 2},
  {x: 211, size: 1},
]

const Mountains = ({ cameraX = null }) => {
  const { left, width, pixels } = useAppContext()
  const preloadPx = pixels * 8
  const cameraLeft = cameraX ?? left
  const minPx = Math.max(0, cameraLeft - preloadPx)
  const maxPx = cameraLeft + (width || 0) + preloadPx

  return (
    <>
      {
        MOUNTAINS_LIST.filter(mountain => {
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
