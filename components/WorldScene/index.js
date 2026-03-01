import Castle from 'components/Castle'
import Flag from 'components/Flag'
import Floor from 'components/Floor'
import Mario from 'components/Mario'
import Mountains from 'components/Mountains'
import Plants from 'components/Plants'
import Sky from 'components/Sky'
import WorldObjectsLayer from 'components/WorldObjectsLayer'
import { renderEnemy, renderMushroom } from 'libs/entityRenderers'
import { getObjectWidth } from 'libs/objectDimensions'

const isWithinVisibleRange = (entity, visibleMinPx, visibleMaxPx) => {
  const right = entity.x + getObjectWidth(entity)
  return right > visibleMinPx && entity.x < visibleMaxPx
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
  mushrooms,
  enemies,
  visibleMinPx,
  visibleMaxPx,
  worldPreloadTiles,
  flag,
  castle,
}) => (
  <main className='relative h-full w-full overflow-hidden'>
    <div ref={worldRef} className='absolute inset-x-0 bottom-0 h-full w-full'>
      <Mario />

      <Sky cameraX={cameraXForMetrics} />
      <Mountains cameraX={cameraXForMetrics} />
      <Plants cameraX={cameraXForMetrics} />

      <div className='inline-block'>
        <VisibleEntitiesLayer
          items={mushrooms}
          visibleMinPx={visibleMinPx}
          visibleMaxPx={visibleMaxPx}
          renderItem={renderMushroom}
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
        />

        <Floor
          segments={objects.filter(el => el.type == 'Floor')}
          pixels={pixels}
          minPx={visibleMinPx}
          maxPx={visibleMaxPx}
        />

        {visibleMaxPx > (castle.x - worldPreloadTiles) * pixels && <Flag x={flag.x} y={flag.y} debug={debug} />}
        {visibleMaxPx > (castle.x - worldPreloadTiles) * pixels && <Castle x={castle.x} />}
      </div>
    </div>
  </main>
)

export default WorldScene
