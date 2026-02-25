import Brick from 'components/Brick'
import Roof from 'components/Roof'
import Window from 'components/Window'
import Door from 'components/Door'

import { useAppContext } from 'contexts/AppContext'

const Castle = ({ x }) => {
  const { renderLimit, pixels } = useAppContext()

  const base = [
    { x: 205, y: 1 },
    { x: 206, y: 1 },
    { x: 208, y: 1 },
    { x: 209, y: 1 },

    { x: 205, y: 2 },
    { x: 206, y: 2 },
    { x: 207, y: 2 },
    { x: 208, y: 2 },
    { x: 209, y: 2 },

    { x: 206, y: 4 },
    { x: 207, y: 4 },
    { x: 208, y: 4 },
  ]

  const roof = [
    { x: 205, y: 3 },
    { x: 206, y: 3, bg: 1 },
    { x: 207, y: 3, bg: 1 },
    { x: 208, y: 3, bg: 1 },
    { x: 209, y: 3 },

    { x: 206, y: 5 },
    { x: 207, y: 5 },
    { x: 208, y: 5 },
  ]

  const windows = [
    { x: 206, y: 4, left: 1 },
    { x: 208, y: 4, left: 0 },
  ]
  
  return (
    <>
      {
        base.filter(el => el.x * pixels < renderLimit).map((el, i) => (
          <Brick key={`castle-brick-${el.x}-${el.y}-${i}`} x={el.x} y={el.y} touches={0} border={0} />
        ))
      }

      {
        roof.filter(el => el.x * pixels < renderLimit).map((el, i) => (
          <Roof key={`castle-roof-${el.x}-${el.y}-${i}`} x={el.x} y={el.y} bg={el.bg} />
        ))
      }
      {
        windows.filter(el => el.x * pixels < renderLimit).map((el, i) => (
          <Window key={`castle-window-${el.x}-${el.y}-${i}`} x={el.x} y={el.y} left={el.left} />
         ))
      }

      <Door x={207} y={1} />
    </>
  )
}

export default Castle
