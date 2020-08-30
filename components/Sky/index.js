import { useAppContext } from 'contexts/AppContext'
import { useWindowDimensions } from 'hooks/window'
import Cloud from 'components/Cloud'

const m = [
  {x: 9, size: 1},
  {x: 20, size: 1},
  {x: 29, size: 3},
  {x: 38, size: 2},
  {x: 58, size: 1},
  {x: 68, size: 1},
  {x: 76, size: 3},
  {x: 86, size: 2},
  {x: 105, size: 1},
  {x: 116, size: 1},
  {x: 125, size: 3},
  {x: 134, size: 2},
]

const Sky = () =>{
  const { pixels, left } = useAppContext()
  const { width } = useWindowDimensions();

  return (
    <>
      {
        m.filter(el => el.x * pixels < left + width).map((cloud, i) => (
          <Cloud x={cloud.x} size={cloud.size} key={`cloud_${i}`}/>
        ))
      }
    </>
  )
}

export default Sky
