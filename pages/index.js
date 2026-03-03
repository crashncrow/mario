import { useEffect, useRef, useState } from 'react'
import { useAppContext } from 'contexts/AppContext'
import useGameInput from 'hooks/game/useGameInput'
import useCameraFollow from 'hooks/world/useCameraFollow'
import useDebugMetrics from 'hooks/world/useDebugMetrics'
import useVisibleWorldWindow from 'hooks/world/useVisibleWorldWindow'

import Head from 'next/head'
import GameHud from 'components/ui/GameHud'
import LevelIntroScreen from 'components/ui/LevelIntroScreen'
import WorldScene from 'components/world/WorldScene'
import { GAME_VIEWPORT_MAX_WIDTH } from 'libs/game/config'

export default function Home() {
  const worldRef = useRef(null)
  const cameraXRef = useRef(0)
  const scrollContainerRef = useRef(null)
  const [viewportWidth, setViewportWidth] = useState(null)

  const {
    debug,
    gameLoopEnabled,
    isPaused,
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
    playerForm,
    coins,
    score,
    time,
    currentWorld,
    currentStage,
    currentBackground,
    currentTheme,
    currentDecorations,
    isLevelIntroVisible,
    currentFlag,
    currentCastle,
    gameStatus,
    loseReason,
    setLoopInput,
    setGameLoopEnabled,
    togglePause,
  } = useAppContext()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateViewportWidth = () => {
      const nextWidth = scrollContainerRef.current?.clientWidth ?? null
      setViewportWidth(nextWidth)
    }

    updateViewportWidth()
    window.addEventListener('resize', updateViewportWidth)

    return () => {
      window.removeEventListener('resize', updateViewportWidth)
    }
  }, [])

  const gameViewportWidth = viewportWidth ?? width

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
    width: gameViewportWidth,
    left,
    gameLoopEnabled,
    scrollContainerRef,
  })
  const scrollWorldWidthPx = Math.max(gameViewportWidth || 0, floorEndPx || 0)

  useCameraFollow({
    gameLoopEnabled,
    worldRef,
    cameraXRef,
    left,
    width: gameViewportWidth,
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
    playerForm,
    renderLimit,
    visibleMinPx,
    visibleMaxPx,
    decorMinPx,
    decorMaxPx,
    decorations: currentDecorations,
    motionRef,
  })

  useGameInput({
    gameLoopEnabled,
    isPaused,
    setLoopInput,
    togglePause,
  })

  return (
    <>
      <GameHud
        debug={debug}
        debugPanelProps={debugPanelProps}
        gameLoopEnabled={gameLoopEnabled}
        setGameLoopEnabled={setGameLoopEnabled}
        setLoopInput={setLoopInput}
        isPaused={isPaused}
        togglePause={togglePause}
        coins={coins}
        score={score}
        time={time}
        world={currentWorld}
        stage={currentStage}
        gameStatus={gameStatus}
        loseReason={loseReason}
        lives={lives}
      />
      <LevelIntroScreen
        visible={isLevelIntroVisible}
        world={currentWorld}
        stage={currentStage}
        lives={lives}
        time={time}
        coins={coins}
        score={score}
      />
      <div
        className={`fixed inset-0 h-dvh w-full z-50 ${gameLoopEnabled ? 'pointer-events-auto' : 'pointer-events-none'}`}
      ></div>
      <div className='fixed inset-0 h-dvh w-full bg-black'>
        <Head>
          <title>It&apos;s Me, Mario!</title>
          <link rel='icon' href='/favicon.ico' />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
          />
        </Head>

        <div
          ref={scrollContainerRef}
          className={gameLoopEnabled ? 'relative mx-auto h-dvh w-full overflow-hidden overscroll-none' : 'relative mx-auto h-dvh w-full overflow-x-scroll overflow-y-hidden overscroll-none'}
          style={{ maxWidth: `${GAME_VIEWPORT_MAX_WIDTH}px` }}
        >
          <div style={{ width: `${scrollWorldWidthPx}px`, height: '100%' }}>
            <WorldScene
              worldRef={worldRef}
              cameraXForMetrics={cameraXForMetrics}
              visibleObjects={visibleObjects}
              pixels={pixels}
              debug={debug}
              objects={objects}
              background={currentBackground}
              theme={currentTheme}
              decorations={currentDecorations}
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
      </div>
    </>
  )
}
