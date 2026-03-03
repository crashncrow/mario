import Castle from 'components/world/Castle'
import BrickBreakEffect from 'components/world/BrickBreakEffect'
import Decorations from 'components/decorations/Decorations'
import Flag from 'components/world/Flag'
import Floor from 'components/world/Floor'
import Mario from 'components/characters/Mario'
import WorldObjectsLayer from 'components/world/WorldObjectsLayer'
import { renderEnemy, renderMushroom } from 'libs/enemies/entityRenderers'
import { getObjectWidth } from 'libs/world/objectDimensions'

const isWithinVisibleRange = (entity, visibleMinPx, visibleMaxPx) => {
  const right = entity.x + getObjectWidth(entity)
  return right > visibleMinPx && entity.x < visibleMaxPx
}

const BACKGROUND_CLASS = {
  sky: 'bg-smb-sky',
  black: 'bg-black',
}

const VisibleEntitiesLayer = ({ items, visibleMinPx, visibleMaxPx, renderItem }) => (
  <>
    {items
      .filter(item => isWithinVisibleRange(item, visibleMinPx, visibleMaxPx))
      .map(item => (
        <div
          key={item.id}
          className='absolute pointer-events-none z-30'
          style={{ left: `${item.x}px`, bottom: `${item.y}px` }}
        >
          {renderItem(item)}
        </div>
      ))}
  </>
)

const WorldScene = ({
  worldRef,
  cameraXForMetrics,
  visibleObjects,
  pixels,
  debug,
  objects,
  background = 'sky',
  theme = 'overworld',
  decorations = {},
  mushrooms,
  brickBreaks,
  enemies,
  visibleMinPx,
  visibleMaxPx,
  worldPreloadTiles,
  flag,
  castle,
}) => {
  return (
    <main className={`relative h-full w-full overflow-hidden ${BACKGROUND_CLASS[background] ?? BACKGROUND_CLASS.sky}`}>
      <div ref={worldRef} className='absolute inset-x-0 bottom-0 h-full w-full'>
        <Mario />

        <Decorations decorations={decorations} cameraX={cameraXForMetrics} />

        <div className='inline-block'>
          <VisibleEntitiesLayer
            items={mushrooms}
            visibleMinPx={visibleMinPx}
            visibleMaxPx={visibleMaxPx}
            renderItem={renderMushroom}
          />

          <VisibleEntitiesLayer
            items={brickBreaks}
            visibleMinPx={visibleMinPx}
            visibleMaxPx={visibleMaxPx}
            renderItem={() => <BrickBreakEffect />}
          />

          <VisibleEntitiesLayer
            items={enemies}
            visibleMinPx={visibleMinPx}
            visibleMaxPx={visibleMaxPx}
            renderItem={enemy => renderEnemy(enemy, debug)}
          />

          <WorldObjectsLayer
            visibleObjects={visibleObjects}
            pixels={pixels}
            debug={debug}
            theme={theme}
          />

          <Floor
            segments={objects.filter(el => el.type === 'Floor')}
            pixels={pixels}
            minPx={visibleMinPx}
            maxPx={visibleMaxPx}
            theme={theme}
          />

          {visibleMaxPx > (castle.x - worldPreloadTiles) * pixels && <Flag x={flag.x} y={flag.y} pixels={pixels} debug={debug} />}
          {visibleMaxPx > (castle.x - worldPreloadTiles) * pixels && <Castle x={castle.x} />}
        </div>
      </div>
    </main>
  )
}

export default WorldScene
