import { useState, useRef, useEffect } from 'react'
import { useAppContext } from 'contexts/AppContext'
import { processFullArray } from 'libs/pixless'
import { getPlayerDimensions } from 'libs/playerDimensions'

const c = {
  0: '', // bg-transparent
  1: 'bg-smb-red',
  2: 'bg-smb-brown',
  3: 'bg-smb-skin'
}

const m0 = [
  0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0,
  0, 0, 0, 0, 2, 2, 2, 3, 3, 2, 3, 0, 0, 0, 0, 0,
  0, 0, 0, 2, 3, 2, 3, 3, 3, 2, 3, 3, 3, 0, 0, 0,
  0, 0, 0, 2, 3, 2, 2, 3, 3, 1, 2, 3, 3, 3, 0, 0,
  0, 0, 0, 2, 2, 1, 1, 3, 3, 2, 2, 2, 2, 0, 0, 0,
  0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0,
  0, 0, 0, 0, 2, 2, 1, 2, 2, 2, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 0, 0, 0,
  0, 0, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 0, 0,
  0, 0, 3, 3, 2, 1, 3, 1, 1, 3, 1, 2, 3, 3, 0, 0,
  0, 0, 3, 3, 3, 1, 1, 1, 1, 1, 1, 3, 3, 3, 0, 0,
  0, 0, 3, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 3, 0, 0,
  0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0,
  0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0
]

const m1 = [
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 2, 3, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 3, 2, 3, 3, 3, 2, 3, 3, 3, 0, 0],
  [0, 0, 0, 0, 2, 3, 2, 2, 3, 3, 3, 2, 3, 3, 3, 0],
  [0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0],
  [0, 0, 0, 2, 2, 2, 2, 1, 1, 2, 2, 0, 0, 0, 0, 0],
  [0, 3, 3, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 3, 3, 3],
  [0, 3, 3, 3, 0, 2, 2, 1, 3, 1, 1, 1, 2, 2, 3, 3],
  [0, 3, 3, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 0],
  [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0],
  [0, 0, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 0],
  [0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]

const m2 = [
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 2, 3, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 3, 2, 3, 3, 3, 2, 3, 3, 3, 0, 0],
  [0, 0, 0, 0, 2, 3, 2, 2, 3, 3, 3, 2, 3, 3, 3, 0],
  [0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 2, 1, 1, 2, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 2, 2, 2, 1, 1, 2, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 2, 2, 1, 1, 3, 1, 1, 3, 0, 0, 0],
  [0, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 2, 3, 3, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0]
]

const m3 = [
  [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 2, 3, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 3, 2, 3, 3, 3, 2, 3, 3, 3, 0, 0],
  [0, 0, 0, 0, 2, 3, 2, 2, 3, 3, 3, 2, 3, 3, 3, 0],
  [0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 0, 0],
  [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0],
  [0, 0, 0, 0, 0, 2, 2, 2, 2, 1, 2, 0, 3, 0, 0, 0],
  [0, 0, 0, 0, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 0, 0],
  [0, 0, 0, 3, 3, 1, 2, 2, 2, 2, 2, 3, 3, 0, 0, 0],
  [0, 0, 0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 2, 2, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]

const matrix1 = processFullArray(m1)
const matrix2 = processFullArray(m2)
const matrix3 = processFullArray(m3)

const Mario = () => {
  const {
    pixels,
    debug,
    left,
    bottom,
    playerForm,
    marioCollision,
    gameLoopEnabled,
    pipeTransition,
    motionRef,
  } = useAppContext()

  const [reverse, setReverse] = useState(false)
  const [index, setIndex] = useState(1)
  const lastWalkAnimTickRef = useRef(0)
  const currentMatrix =
    index % 4 === 1 ? matrix2
      : index % 4 === 2 ? matrix3
        : index % 4 === 3 ? matrix2
          : matrix1
  const playerSize = getPlayerDimensions({ pixels, playerForm })
  const spriteStyle = playerForm === 'big' || playerForm === 'fire'
    ? {
        transform: 'scaleY(1.5)',
        transformOrigin: 'bottom left',
      }
    : undefined

  useEffect(() => {
    if (!gameLoopEnabled || pipeTransition?.active) return

    const rafId = window.requestAnimationFrame(() => {
      const vx = motionRef.current?.vx || 0
      const grounded = motionRef.current?.grounded ?? true
      const facing = motionRef.current?.facing || 1

      setReverse(facing < 0)

      if (Math.abs(vx) > 10 && grounded) {
        const now = performance.now()
        if (now - lastWalkAnimTickRef.current > 90) {
          lastWalkAnimTickRef.current = now
          setIndex(index => index + 1)
        }
      }
    })

    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [left, gameLoopEnabled, motionRef, pipeTransition?.active])

  return (
    <>
      {
        debug && (
          <div
            className='absolute border-4 border-smb-brown z-50 w-1 h-1'
            style={{
              bottom: `${bottom}px`,
              left: `${left}px`
            }}
          ></div>
        )
      }

      <div
        className='absolute z-40'
        style={{
          left: `${left}px`,
          bottom: `${bottom}px`,
          width: `${playerSize.width}px`,
          height: `${playerSize.height}px`,
          transform: pipeTransition?.active
            ? `translate(${pipeTransition.translateX ?? 0}px, ${pipeTransition.translateY ?? 0}px)`
            : undefined,
        }}>

        {
          debug &&
          <div className={`absolute w-full h-full border-4 ${marioCollision ? 'border-black' : 'border-smb-red'} z-50 pointer-events-none`}></div>
        }

        <div
          className='absolute bottom-0 left-0 flex w-16 flex-wrap'
          style={spriteStyle}
        >
          {currentMatrix.map((x, i) => {
            if (reverse) {
              // reverse without mutate
              return x.slice().reverse().map((y, j) => (
                <div
                  className={`h-1 w-${y.count} flex-none ${c[y.color]}`}
                  key={`mario_${i}${j}`}
                >
                </div>
              ))
            }

            return x.map((y, j) => (
              <div
                className={`h-1 w-${y.count} flex-none ${c[y.color]}`}
                key={`mario_${i}${j}`}
              >
              </div>
            ))
          })}
        </div>
      </div>
    </>
  )
}

export default Mario
