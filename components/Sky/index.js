import { useAppContext } from 'contexts/AppContext'
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
  {x: 166, size: 1},
  {x: 174, size: 3},
  {x: 203, size: 1},
]

const Sky = () =>{
  const { renderLimit, pixels } = useAppContext()

  return (
    <>
      {
        m.filter(el => el.x * pixels < renderLimit).map((cloud, i) => (
          <Cloud x={cloud.x} size={cloud.size} key={`cloud_${i}`}/>
        ))
      }
    </>
  )
}

export default Sky
