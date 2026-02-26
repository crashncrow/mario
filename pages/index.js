import { useEffect, useRef } from 'react'
import { elements, pipes } from 'libs/elements'
import { useAppContext } from 'contexts/AppContext'
import useDoubleClick from 'hooks/clicks'
import useIsomorphicLayoutEffect from 'hooks/useIsomorphicLayoutEffect'
import useDebugMetrics from 'hooks/useDebugMetrics'

import Head from 'next/head'
import Sky from 'components/Sky'
import Mario from 'components/Mario'
import Floor from 'components/Floor'
import Pipe from 'components/Pipe'
import Plants from 'components/Plants'
import Mountains from 'components/Mountains'
import Brick from 'components/Brick'
import Block from 'components/Block'
import Box from 'components/Box'
import Stats from 'components/Stats'
import Castle from 'components/Castle'
import DebugPanel from 'components/DebugPanel'

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

  const floorEndPx = objects
    .filter(el => el.type === 'Floor')
    .reduce((max, el) => Math.max(max, (el.x * pixels) + el.width), 0)
  const maxCameraX = Math.max(0, floorEndPx - (width || 0))

  useEffect(() => {
    // console.log(renderLimit)
    setObjects(elements)
  }, [setObjects])

  useEffect(() => {
    if (!gameLoopEnabled) return

    const onKeyDown = e => {
      if (e.code === 'ArrowLeft') {
        e.preventDefault()
        setLoopInput({ left: true })
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        setLoopInput({ right: true })
      } else if (e.code === 'Space') {
        e.preventDefault()
        setLoopInput({ jump: true })
      }
    }

    const onKeyUp = e => {
      if (e.code === 'ArrowLeft') {
        setLoopInput({ left: false })
      } else if (e.code === 'ArrowRight') {
        setLoopInput({ right: false })
      } else if (e.code === 'Space') {
        setLoopInput({ jump: false })
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [gameLoopEnabled, setLoopInput])

  useEffect(() => {
    if (!gameLoopEnabled) return

    const onWheel = e => {
      // The camera follows Mario in the game loop; manual wheel scroll fights it and causes shaking.
      e.preventDefault()
    }

    window.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
    }
  }, [gameLoopEnabled])

  useIsomorphicLayoutEffect(() => {
    if (!gameLoopEnabled || !worldRef.current) return

    const currentCameraX = cameraXRef.current
    const screenX = left - currentCameraX
    const deadZoneLeft = 88
    const deadZoneRight = 112

    let nextCameraX = currentCameraX

    if (screenX < deadZoneLeft) {
      nextCameraX = left - deadZoneLeft
    } else if (screenX > deadZoneRight) {
      nextCameraX = left - deadZoneRight
    }

    nextCameraX = Math.max(0, Math.round(nextCameraX))
    nextCameraX = Math.min(nextCameraX, maxCameraX)

    if (Math.abs(currentCameraX - nextCameraX) > 0) {
      cameraXRef.current = nextCameraX
      worldRef.current.style.transform = `translate3d(${-nextCameraX}px, 0, 0)`
    }
  }, [gameLoopEnabled, left, maxCameraX])

  useEffect(() => {
    if (gameLoopEnabled) return
    cameraXRef.current = 0
    if (worldRef.current) {
      worldRef.current.style.transform = ''
    }
  }, [gameLoopEnabled])

  const jump = (limit) => {
    let j = 0

    for (let i = 1; i * pixels <= limit; i++) {
      if (!checkCollision(left, bottom + (i * pixels) + pixels)) {
        j = i * pixels
      } else {
        break
      }
    }

    return j
  }

  const getElementKey = el => `${el.type}_${el.x}_${el.y}_${el.size ?? 1}`
  const {
    worldPreloadTiles,
    cameraXForMetrics,
    visibleMinPx,
    visibleMaxPx,
    visibleObjects,
    debugPanelProps,
  } = useDebugMetrics({
    debug,
    worldRef,
    objects,
    pixels,
    width,
    left,
    bottom,
    renderLimit,
    gameLoopEnabled,
    maxCameraX,
  })

  useDoubleClick({
    onSingleClick: (e) => {
      // console.log('single click')
      if (gameLoopEnabled) {
        setLoopInput({ jump: true })
        setTimeout(() => {
          setLoopInput({ jump: false })
        }, 60)
        return
      }

      if (canJump) {
        setJumping(true)
        setBottom(bottom => bottom + jump(128) + pixels)

        setTimeout(() => {
          setJumping(false)
        }, 200)
      }
    },
    onDoubleClick: (e) => {
      // console.log('double click')
      if (gameLoopEnabled) {
        setLoopInput({ jump: true })
        setTimeout(() => {
          setLoopInput({ jump: false })
        }, 60)
        return
      }

      if (canJump) {
        setJumping(true)
        setBottom(bottom => bottom + jump(266) + pixels)

        setTimeout(() => {
          setJumping(false)
        }, 200)
      }
    },
    ref: buttonRef,
    latency: 250
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
          <div
            ref={worldRef}
            className='h-full w-full'
          >
            <Mario />
            {renderLimit > (9 - worldPreloadTiles) * pixels && <Sky cameraX={cameraXForMetrics} />}
            {renderLimit > (0 - worldPreloadTiles) * pixels && <Mountains cameraX={cameraXForMetrics} />}
            {renderLimit > (12 - worldPreloadTiles) * pixels && <Plants cameraX={cameraXForMetrics} />}

            <div className='inline-block'>
            {debug &&
              visibleObjects.map((o, i) => (
                  <div
                    key={`debug_${getElementKey(o)}_${i}`}
                    className='absolute border-4 border-mario-red z-50'
                    style={{
                      bottom: `${o.y * pixels}px`,
                      left: `${o.x * pixels}px`,
                      height: `${o.height}px`,
                      width: `${o.width}px`
                    }}
                  ></div>
                )
              )}

            {debug && (
              <div
                className='absolute border-4 border-mario-brown z-50 w-1 h-1'
                style={{
                  bottom: `${bottom}px`,
                  left: `${left}px`
                }}
              ></div>
            )}

            {visibleObjects.map((el, i) => {
              if (el.type === 'Box') {
                return (
                  <Box
                    x={el.x}
                    y={el.y}
                    size={el.size}
                    touches={el.touches}
                    key={getElementKey(el)}
                  />
                )
              } else if (el.type === 'Brick') {
                return (
                  <Brick
                    x={el.x}
                    y={el.y}
                    size={el.size}
                    touches={el.touches}
                    key={getElementKey(el)}
                  />
                )
              } 
              else if (el.type === 'Block') {
                return (
                  <Block
                    x={el.x}
                    y={el.y}
                    size={el.size}
                    key={getElementKey(el)}
                  />
                )
              }
              else if (el.type === 'Pipe') {
                return <Pipe x={el.x} size={el.size} key={getElementKey(el)} />
              }
            
            })}

            {
              // pipes.map((el, i) => {
                
              //     return <Pipe x={el.x} size={el.size} key={i} />
                
              // })
            }

            {
            /* 
            {
              elements.filter(el => el.type == 'Floor').map((el, i) => {
                return <Floor x={el.x} size={el.size} key={i} />
              })
            } 
            */
            }

            {/* <Pipe segments={elements.filter(el => el.type == 'Floor')} /> */}
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
