import { useEffect, useRef } from 'react'
import useDoubleClick from 'hooks/clicks'

import Head from 'next/head'
import Sky from 'components/Sky'
import Mario from 'components/Mario'
import Floor from 'components/Floor'
import Pipe from 'components/Pipe'
import Plants from 'components/Plants'
import Mountains from 'components/Mountains'
import Brick from 'components/Brick'
import Box from 'components/Box'

import { useAppContext } from 'contexts/AppContext'
const debug = true
const elements = [
  { type: 'Box', x: 17, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Box', x: 22, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Box', x: 23, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Box', x: 24, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Box', x: 81, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Box', x: 95, y: 7, size: 1, width: 64, height: 64 },

  
  { type: 'Box', x: 107, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Box', x: 110, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Box', x: 110, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Box', x: 113, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Box', x: 130, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Box', x: 131, y: 7, size: 1, width: 64, height: 64 },

  { type: 'Brick', x: 21, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 23, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 25, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 78, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 79, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 80, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 82, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 83, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 84, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 85, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 86, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 87, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 88, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 92, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 93, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 94, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 95, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 100, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 101, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 119, y: 4, size: 1, width: 64, height: 64 },

  { type: 'Brick', x: 122, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 123, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 124, y: 7, size: 1, width: 64, height: 64 },

  
  { type: 'Brick', x: 129, y: 7, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 130, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 131, y: 4, size: 1, width: 64, height: 64 },
  { type: 'Brick', x: 132, y: 7, size: 1, width: 64, height: 64 },

  { type: 'Pipe', x: 29, y:1, size: 1, width: 128, height: 128 },
  { type: 'Pipe', x: 39, y:1, size: 2, width: 128, height: 192 },
  { type: 'Pipe', x: 47, y:1, size: 3, width: 128, height: 256 },
  { type: 'Pipe', x: 58, y:1, size: 3, width: 128, height: 256 }
]

export default function Home() {
  const buttonRef = useRef()
  const { left, bottom, setBottom, setObjects, checkCollision } = useAppContext()

  useEffect(() => {
    console.log('Set objects', elements)
    setObjects(elements)
  }, [])

  const jump = ( limit ) => {
    let j = 0

      for(let i = 1; i * 64 <= limit; i++ ){
        if( !checkCollision(left, bottom + (i * 64) + 64)){
          j = i * 64
        }
        else{
          break
        }
      }

      return j
  }

  useDoubleClick({
    onSingleClick: (e) => {
      console.log('single click', elements)
      setBottom(bottom + (jump(128)) + 64)

      setTimeout(() => {
        setBottom(64)
        checkCollision(left, bottom + 64)
      }, 200)
    },
    onDoubleClick: (e) => {
      console.log('double click', elements)
      setBottom(bottom + (jump(320)) + 64)
      
      setTimeout(() => {
        setBottom(64)
        checkCollision(left, bottom + 64)
      }, 200)
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
        </Head>

        <main className='h-full w-full'>
          <Mario />
          <Sky />
          <Plants />
          <Mountains />

          <div className='inline-block'>
          

            {debug && elements.map((o, i) => (
              <div
                key={i}
                className='absolute border-4 border-mario-red z-50'
                style={{
                  bottom: `${(o.y * 64) }px`,
                  left: `${(o.x * 64)}px`,
                  height: `${o.height}px`,
                  width: `${o.width}px`
                }}
              ></div>
            ))}

            {elements.map((el, i) => {
              if (el.type === 'Box') {
                return <Box x={el.x} y={el.y} size={el.size} key={i}/>
              } else if (el.type === 'Brick') {
                return <Brick x={el.x} y={el.y} size={el.size} key={i}/>
              } else {
                return <Pipe x={el.x} size={el.size} key={i}/>
              }
            })}
          </div>
        </main>
      </div>
      <Floor />
    </>
  )
}
