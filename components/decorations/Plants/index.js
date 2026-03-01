import { useAppContext } from 'contexts/AppContext'
import Bush from 'components/decorations/Bush'

const Plants = ({ cameraX = null, plants = [] }) =>{
  const { left, width, pixels } = useAppContext()
  const preloadPx = pixels * 8
  const cameraLeft = cameraX ?? left
  const minPx = Math.max(0, cameraLeft - preloadPx)
  const maxPx = cameraLeft + (width || 0) + preloadPx

  return (
    <>
      {
        plants.filter(p => {
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
