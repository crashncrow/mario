import { useAppContext } from 'contexts/AppContext'
import { useWindowDimensions } from 'hooks/window'
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
  const { pixels, left } = useAppContext()
  const { width } = useWindowDimensions();

  return (
    <>
      {
        m.map((mountain, i) => {
          if (mountain.x * pixels < left + width) {
            return <Mountain x={mountain.x} size={mountain.size} key={`mountain_${i}`}/>
          }
        })
      }
    </>
  )
}

export default Mountains
