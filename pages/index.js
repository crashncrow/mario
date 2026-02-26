import { useCallback, useEffect, useRef } from 'react'
import { elements } from 'libs/elements'
import { useAppContext } from 'contexts/AppContext'
import useDebugMetrics from 'hooks/useDebugMetrics'
import useVisibleWorldWindow from 'hooks/useVisibleWorldWindow'
import useGameInput from 'hooks/useGameInput'
import useCameraFollow from 'hooks/useCameraFollow'

import Head from 'next/head'
import Sky from 'components/Sky'
import Mario from 'components/Mario'
import Floor from 'components/Floor'
import Plants from 'components/Plants'
import Mountains from 'components/Mountains'
import Stats from 'components/Stats'
import Castle from 'components/Castle'
import DebugPanel from 'components/DebugPanel'
import WorldObjectsLayer from 'components/WorldObjectsLayer'

export default function Home() {

  const buttonRef = useRef()
  const worldRef = useRef(null)
  const cameraXRef = useRef(0)

  const {
    debug,
    gameLoopEnabled,
    renderLimit,
    pixels,
    width,
    left,
    bottom,
    objects,
    setBottom,
    setObjects,
    setLoopInput,
    setGameLoopEnabled,
    canJump,
    checkCollision,
    setJumping
  } = useAppContext()

  const {
    maxCameraX,
    worldPreloadTiles,
    cameraXForMetrics,
    visibleMinPx,
    visibleMaxPx,
    decorMinPx,
    decorMaxPx,
  } = useVisibleWorldWindow({
    objects,
    pixels,
    width,
    left,
    gameLoopEnabled,
  })

  useEffect(() => {
    // console.log(renderLimit)
    setObjects(elements)
  }, [setObjects])

  useCameraFollow({
    gameLoopEnabled,
    worldRef,
    cameraXRef,
    left,
    maxCameraX,
  })

  const jump = useCallback((limit) => {
    let j = 0

    for (let i = 1; i * pixels <= limit; i++) {
      if (!checkCollision(left, bottom + (i * pixels) + pixels)) {
        j = i * pixels
      } else {
        break
      }
    }

    return j
  }, [pixels, checkCollision, left, bottom])

  const {
    visibleObjects,
    debugPanelProps,
  } = useDebugMetrics({
    debug,
    worldRef,
    objects,
    pixels,
    left,
    bottom,
    renderLimit,
    visibleMinPx,
    visibleMaxPx,
    decorMinPx,
    decorMaxPx,
  })

  useGameInput({
    buttonRef,
    gameLoopEnabled,
    setLoopInput,
    canJump,
    setJumping,
    setBottom,
    jump,
    pixels,
  })

  return (
    <>
      <div
        className='fixed top-4 left-1/2 -translate-x-1/2 text-white flex flex-col items-center'
        style={{ zIndex: 60 }}
      >
        <button
          type='button'
          className='px-3 py-2 bg-black/80 border-2 border-white text-xs'
          onClick={() => setGameLoopEnabled(enabled => !enabled)}
        >
          {gameLoopEnabled ? 'Juego ON' : 'Scroll libre'}
        </button>
        {gameLoopEnabled && (
          <div className='mt-2 p-2 bg-black/80 border-2 border-white text-[10px] leading-4 text-white text-center'>
            <div>Controles</div>
            <div>← → mover</div>
            <div>Space saltar</div>
            <div>Click / doble click tambien</div>
          </div>
        )}
      </div>
      {debug && (
        <DebugPanel {...debugPanelProps} />
      )}
      <div className='w-full h-full fixed z-50' ref={buttonRef}></div>
      <div className={gameLoopEnabled ? 'h-screen overflow-hidden' : 'h-screen overflow-x-scroll'}>
        <Head>
          <title>It&apos;s Me, Mario!</title>
          <link rel='icon' href='/favicon.ico' />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
          />
        </Head>

        <Stats />

        <main className='h-full w-full overflow-hidden'>
          <div ref={worldRef} className='h-full w-full'>
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

              {renderLimit > (205 - worldPreloadTiles) * pixels && <Castle x={205} />}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
