import { useAppContext } from 'contexts/AppContext'
import Mountain from 'components/Mountain'

const m = [
  {x: 0, size: 2},
  {x: 17, size: 1},
  {x: 49, size: 2},
  {x: 65, size: 1},
  {x: 96, size: 2},
  {x: 113, size: 1},
]

const Mountains = () => {
  const { renderLimit, pixels } = useAppContext()

  return (
    <>
      {
        m.filter(el => el.x * pixels < renderLimit).map((mountain, i) => (
          <Mountain x={mountain.x} size={mountain.size} key={`mountain_${i}`}/>
        ))
      }
    </>
  )
}

export default Mountains
