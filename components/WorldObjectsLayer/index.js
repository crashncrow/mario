import Block from 'components/Block'
import Box from 'components/Box'
import Brick from 'components/Brick'
import Pipe from 'components/Pipe'

const getElementKey = el => `${el.type}_${el.x}_${el.y}_${el.size ?? 1}`

const WorldObjectsLayer = ({ visibleObjects, pixels, debug }) => (
  <>
    {debug && visibleObjects.map((o, i) => (
      <div
        key={`debug_${getElementKey(o)}_${i}`}
        className='absolute'
        style={{
          bottom: `${o.y * pixels}px`,
          left: `${o.x * pixels}px`,
          height: `${o.height}px`,
          width: `${o.width}px`
        }}
      >
        <div className='absolute w-full h-full border-4 border-mario-red z-50 pointer-events-none'></div>
      </div>
    ))}

    {visibleObjects.map(el => {
      const key = getElementKey(el)

      switch (el.type) {
        case 'Box':
          return <Box key={key} x={el.x} y={el.y} size={el.size} touches={el.touches} />
        case 'Brick':
          return <Brick key={key} x={el.x} y={el.y} size={el.size} touches={el.touches} />
        case 'Block':
          return <Block key={key} x={el.x} y={el.y} size={el.size} />
        case 'Pipe':
          return <Pipe key={key} x={el.x} size={el.size} pixels={pixels} />
        default:
          return null
      }
    })}
  </>
)

export default WorldObjectsLayer
