import { useEffect, useRef } from 'react'
import { elements, pipes } from 'libs/elements'
import { useAppContext } from 'contexts/AppContext'
import useDoubleClick from 'hooks/clicks'

import Head from 'next/head'
import Sky from 'components/Sky'
import Mario from 'components/Mario'
import Floor from 'components/Floor'
import Pipe from 'components/Pipe'
import Plants from 'components/Plants'
import Mountains from 'components/Mountains'
import Brick from 'components/Brick'
import Brick2 from 'components/Brick2'
import Box from 'components/Box'
import Stats from 'components/Stats'

export default function Home() {

  const buttonRef = useRef()
  
  const {
    debug,
    renderLimit,
    pixels,
    left,
    bottom,
    setBottom,
    setObjects,
    canJump,
    checkCollision,
    setJumping
  } = useAppContext()

  useEffect(() => {
    // console.log(renderLimit)
    setObjects(elements)
  }, [])

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

  useDoubleClick({
    onSingleClick: (e) => {
      // console.log('single click')
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
      <div className='w-full h-full fixed z-50' ref={buttonRef}></div>
      <div className='h-screen overflow-x-scroll'>
        <Head>
          <title>It's Me, Mario!</title>
          <link rel='icon' href='/favicon.ico' />
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
          />
          <link
            href='https://fonts.googleapis.com/css?family=Press+Start+2P'
            rel='stylesheet'
          ></link>
        </Head>

        <Stats />

        <main className='h-full w-full'>
          <Mario />
          <Sky />
          <Plants />
          <Mountains />

          <div className='inline-block'>
            {debug &&
              elements.filter(el => el.x * pixels < renderLimit).map((o, i) => (
                  <div
                    key={i}
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

            {elements.filter(el => el.x * pixels < renderLimit).map((el, i) => {
              if (el.type === 'Box') {
                return (
                  <Box
                    x={el.x}
                    y={el.y}
                    size={el.size}
                    touches={el.touches}
                    key={i}
                  />
                )
              } else if (el.type === 'Brick') {
                return (
                  <Brick
                    x={el.x}
                    y={el.y}
                    size={el.size}
                    touches={el.touches}
                    key={i}
                  />
                )
              } 
              else if (el.type === 'Brick2') {
                return (
                  <Brick2
                    x={el.x}
                    y={el.y}
                    size={el.size}
                    key={i}
                  />
                )
              }
              else if (el.type === 'Pipe') {
                return <Pipe x={el.x} size={el.size} key={i} />
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
            <Floor segments={elements.filter(el => el.type == 'Floor')} />

          </div>
        </main>
      </div>
    </>
  )
}
