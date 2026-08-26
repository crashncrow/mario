import { memo } from 'react'
import { TILE_SIZE } from 'libs/world/constants'
import Bush from 'components/decorations/Bush'

const Plants = ({ minPx = 0, maxPx = 0, plants = [] }) =>{
  const pixels = TILE_SIZE

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

export default memo(Plants)
