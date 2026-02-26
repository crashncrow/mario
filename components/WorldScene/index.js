import Castle from 'components/Castle'
import Floor from 'components/Floor'
import Mario from 'components/Mario'
import Mountains from 'components/Mountains'
import Plants from 'components/Plants'
import Sky from 'components/Sky'
import WorldObjectsLayer from 'components/WorldObjectsLayer'

const WorldScene = ({
  worldRef,
  cameraXForMetrics,
  visibleObjects,
  pixels,
  debug,
  objects,
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

        {visibleMaxPx > (205 - worldPreloadTiles) * pixels && <Castle x={205} />}
      </div>
    </div>
  </main>
)

export default WorldScene
