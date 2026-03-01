import { useRef } from 'react'
import { useAppContext } from 'contexts/AppContext'
import useGameInput from 'hooks/game/useGameInput'
import useCameraFollow from 'hooks/world/useCameraFollow'
import useDebugMetrics from 'hooks/world/useDebugMetrics'
import useVisibleWorldWindow from 'hooks/world/useVisibleWorldWindow'

import Head from 'next/head'
import GameHud from 'components/ui/GameHud'
import WorldScene from 'components/world/WorldScene'

export default function Home() {

  const buttonRef = useRef()
  const worldRef = useRef(null)
  const cameraXRef = useRef(0)
  const scrollContainerRef = useRef(null)

  const {
    debug,
    gameLoopEnabled,
    renderLimit,
    pixels,
    width,
    left,
    bottom,
    motionRef,
    objects,
    mushrooms,
    brickBreaks,
    enemies,
    lives,
    coins,
    score,
    time,
    currentWorld,
    currentStage,
    currentFlag,
    currentCastle,
    gameStatus,
    loseReason,
    setLoopInput,
    setGameLoopEnabled,
  } = useAppContext()

  const {
    floorEndPx,
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
    scrollContainerRef,
  })
  const scrollWorldWidthPx = Math.max(width || 0, floorEndPx || 0)

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
    lives,
    renderLimit,
    visibleMinPx,
    visibleMaxPx,
    decorMinPx,
    decorMaxPx,
    motionRef,
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
        coins={coins}
        score={score}
        time={time}
        world={currentWorld}
        stage={currentStage}
        gameStatus={gameStatus}
        loseReason={loseReason}
        lives={lives}
      />
      <div
        className={`fixed inset-0 h-dvh w-full z-50 ${gameLoopEnabled ? 'pointer-events-auto' : 'pointer-events-none'}`}
        ref={buttonRef}
      ></div>
      <div
        ref={scrollContainerRef}
        className={gameLoopEnabled ? 'fixed inset-0 h-dvh overflow-hidden overscroll-none' : 'fixed inset-0 h-dvh overflow-x-scroll overflow-y-hidden overscroll-none'}
      >
        <Head>
          <title>It&apos;s Me, Mario!</title>
          <link rel='icon' href='/favicon.ico' />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
          />
        </Head>

        <div style={{ width: `${scrollWorldWidthPx}px`, height: '100%' }}>
          <WorldScene
            worldRef={worldRef}
            cameraXForMetrics={cameraXForMetrics}
            visibleObjects={visibleObjects}
            pixels={pixels}
            debug={debug}
            objects={objects}
            mushrooms={mushrooms}
            brickBreaks={brickBreaks}
            enemies={enemies}
            visibleMinPx={visibleMinPx}
            visibleMaxPx={visibleMaxPx}
            worldPreloadTiles={worldPreloadTiles}
            flag={currentFlag}
            castle={currentCastle}
          />
        </div>
      </div>
    </>
  )
}
