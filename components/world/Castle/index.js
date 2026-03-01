import Block from 'components/world/Block'
import Door from 'components/world/Door'
import Roof from 'components/world/Roof'
import Window from 'components/world/Window'

const Castle = ({ x }) => {
  const originX = x ?? 205

  const base = [
    { x: originX + 0, y: 1 },
    { x: originX + 1, y: 1 },
    { x: originX + 3, y: 1 },
    { x: originX + 4, y: 1 },

    { x: originX + 0, y: 2 },
    { x: originX + 1, y: 2 },
    { x: originX + 2, y: 2 },
    { x: originX + 3, y: 2 },
    { x: originX + 4, y: 2 },

    { x: originX + 1, y: 4 },
    { x: originX + 2, y: 4 },
    { x: originX + 3, y: 4 },
  ]

  const roof = [
    { x: originX + 0, y: 3 },
    { x: originX + 1, y: 3, bg: 1 },
    { x: originX + 2, y: 3, bg: 1 },
    { x: originX + 3, y: 3, bg: 1 },
    { x: originX + 4, y: 3 },

    { x: originX + 1, y: 5 },
    { x: originX + 2, y: 5 },
    { x: originX + 3, y: 5 },
  ]

  const windows = [
    { x: originX + 1, y: 4, left: 1 },
    { x: originX + 3, y: 4, left: 0 },
  ]
  
  return (
    <>
      {
        base.map((el, i) => (
          <Block
            key={`castle-brick-${el.x}-${el.y}-${i}`}
            variant='brick'
            x={el.x}
            y={el.y}
            touches={0}
            border={false}
          />
        ))
      }

      {
        roof.map((el, i) => (
          <Roof key={`castle-roof-${el.x}-${el.y}-${i}`} x={el.x} y={el.y} bg={el.bg} />
        ))
      }
      {
        windows.map((el, i) => (
          <Window key={`castle-window-${el.x}-${el.y}-${i}`} x={el.x} y={el.y} left={el.left} />
         ))
      }

      <Door x={originX + 2} y={1} />
    </>
  )
}

export default Castle
