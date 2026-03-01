import Pipe from 'components/Pipe'
import Block from 'components/Block'
import { getObjectHeight, getObjectWidth } from 'libs/objectDimensions'

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
          height: `${getObjectHeight(o)}px`,
          width: `${getObjectWidth(o)}px`
        }}
      >
        <div className='absolute w-full h-full border-4 border-mario-red z-50 pointer-events-none'></div>
      </div>
    ))}

    {visibleObjects.map(el => {
      const key = getElementKey(el)

      switch (el.type) {
        case 'Mystery':
          return (
            <Block
              key={key}
              variant='mystery'
              x={el.x}
              y={el.y}
              touches={el.touches}
              content={el.content ?? 'coin'}
              hidden={Boolean(el.hidden)}
              itemCollected={Boolean(el.itemCollected)}
            />
          )
        case 'Brick':
          return <Block key={key} variant='brick' x={el.x} y={el.y} touches={el.touches} />
        case 'Solid':
          return <Block key={key} variant='solid' x={el.x} y={el.y} />
        case 'Pipe':
          return <Pipe key={key} x={el.x} size={el.size} pixels={pixels} />
        default:
          return null
      }
    })}
  </>
)

export default WorldObjectsLayer
