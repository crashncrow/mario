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
    width,
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
      <div className='fixed inset-0 h-dvh w-full z-50' ref={buttonRef}></div>
      <div className={gameLoopEnabled ? 'fixed inset-0 h-dvh overflow-hidden overscroll-none' : 'fixed inset-0 h-dvh overflow-x-scroll overflow-y-hidden overscroll-none'}>
        <Head>
          <title>It&apos;s Me, Mario!</title>
          <link rel='icon' href='/favicon.ico' />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
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
