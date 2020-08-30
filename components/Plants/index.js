import { useAppContext } from 'contexts/AppContext'
import Bush from 'components/Bush'

const m = [
  {x: 12, size: 3},
  {x: 24, size: 1},
  {x: 42, size: 2},
  {x: 60, size: 3},
  {x: 71, size: 1},
  {x: 90, size: 2},
  {x: 108, size: 3},
  {x: 120, size: 1},
  {x: 138, size: 2},
]

const Plants = () =>{
  const { renderLimit, pixels } = useAppContext()

  return (
    <>
      {
        m.filter(p => p.x * pixels < renderLimit).map((plant, i) => (
          <Bush x={plant.x} size={plant.size} key={`bush_${i}`}/>
        ))
      }
    </>
  )
}

export default Plants
