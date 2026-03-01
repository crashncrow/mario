import { useAppContext } from 'contexts/AppContext'
import Bush from 'components/decorations/Bush'

export const PLANTS_BUSHES = [
  {x: 12, size: 3},
  {x: 24, size: 1},
  {x: 42, size: 2},
  {x: 60, size: 3},
  {x: 71, size: 1},
  {x: 90, size: 2},
  {x: 108, size: 3},
  {x: 120, size: 1},
  {x: 138, size: 2},
  {x: 158, size: 1},
  {x: 170, size: 1},
  {x: 208, size: 1},
]

const Plants = ({ cameraX = null }) =>{
  const { left, width, pixels } = useAppContext()
  const preloadPx = pixels * 8
  const cameraLeft = cameraX ?? left
  const minPx = Math.max(0, cameraLeft - preloadPx)
  const maxPx = cameraLeft + (width || 0) + preloadPx

  return (
    <>
      {
        PLANTS_BUSHES.filter(p => {
          const plantLeft = (p.x * pixels) + (pixels / 2)
          const plantWidth = (1 + p.size) * pixels
          const plantRight = plantLeft + plantWidth
          return plantRight > minPx && plantLeft < maxPx
        }).map((plant, i) => (
          <Bush x={plant.x} size={plant.size} pixels={pixels} key={`bush_${i}`}/>
        ))
      }
    </>
  )
}

export default Plants
