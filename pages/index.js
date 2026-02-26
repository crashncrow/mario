import { useRef } from 'react'
import { useAppContext } from 'contexts/AppContext'
import useDebugMetrics from 'hooks/useDebugMetrics'
import useVisibleWorldWindow from 'hooks/useVisibleWorldWindow'
import useGameInput from 'hooks/useGameInput'
import useCameraFollow from 'hooks/useCameraFollow'

import Head from 'next/head'
import GameHud from 'components/GameHud'
import WorldScene from 'components/WorldScene'

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
    setLoopInput,
    setGameLoopEnabled,
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

  useCameraFollow({
    gameLoopEnabled,
    worldRef,
    cameraXRef,
    left,
    maxCameraX,
  })

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
  })

  return (
    <>
      <GameHud
        debug={debug}
        debugPanelProps={debugPanelProps}
        gameLoopEnabled={gameLoopEnabled}
        setGameLoopEnabled={setGameLoopEnabled}
        setLoopInput={setLoopInput}
      />
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

        <WorldScene
          worldRef={worldRef}
          cameraXForMetrics={cameraXForMetrics}
          visibleObjects={visibleObjects}
          pixels={pixels}
          debug={debug}
          objects={objects}
          visibleMinPx={visibleMinPx}
          visibleMaxPx={visibleMaxPx}
          worldPreloadTiles={worldPreloadTiles}
        />
      </div>
    </>
  )
}
