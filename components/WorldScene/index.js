import Castle from 'components/Castle'
import Flag from 'components/Flag'
import Floor from 'components/Floor'
import Mario from 'components/Mario'
import Mountains from 'components/Mountains'
import Plants from 'components/Plants'
import Sky from 'components/Sky'
import WorldObjectsLayer from 'components/WorldObjectsLayer'
import { renderEnemy, renderMushroom } from 'libs/entityRenderers'

const isWithinVisibleRange = (entity, visibleMinPx, visibleMaxPx) => {
  const right = entity.x + entity.width
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
          minPx={visibleMinPx}
          maxPx={visibleMaxPx}
        />

        {visibleMaxPx > (205 - worldPreloadTiles) * pixels && <Flag x={201} y={2} debug={debug} />}
        {visibleMaxPx > (205 - worldPreloadTiles) * pixels && <Castle x={205} />}
      </div>
    </div>
  </main>
)

export default WorldScene
