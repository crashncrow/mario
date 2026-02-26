import { useEffect, useRef, useState } from 'react'
import { useAppContext } from 'contexts/AppContext'
import { TILE_SIZE } from 'libs/worldConstants'

const Brick = ({x, y, touches = 0, border = true}) => {
  const { pixels } = useAppContext()
  const [ isBumping, setIsBumping ] = useState(false)
  const prevTouchesRef = useRef(touches)

  useEffect(() => {
    if (touches <= prevTouchesRef.current) return

    prevTouchesRef.current = touches
    const raf = requestAnimationFrame(() => setIsBumping(true))
    const timer = setTimeout(() => setIsBumping(false), 180)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(timer)
    }
  }, [touches])

  useEffect(() => {
    prevTouchesRef.current = touches
  }, [touches])

  return (
    <>
      <div 
        className='flex flex-wrap absolute bg-brick-dark border-b-4 border-black bottom-0'
        style={{
          left: `${x * pixels}px`,
          bottom: `${(y * pixels)}px`,
          marginBottom: isBumping ? `${TILE_SIZE / 8}px` : '0px',
        }}>

        <div
          className='flex flex-wrap'
          style={{ width: `${TILE_SIZE}px`, height: `${TILE_SIZE - 4}px` }}
        >
          <div className={`h-full w-full ${border ? 'border-t-4 border-brick-light' : 'border-t-0'}`}>
            <div className={`${border ? 'h-3' : 'h-4'} w-full border-r-4 border-b-4 border-black`}>
              <div className="h-full w-8 border-r-4 border-black">
              </div>
            </div>  
            <div className="h-4 w-full border-b-4 border-black">
              <div className="h-4 w-9 border-r-4 border-l-4 ml-3 border-black">
              </div>
            </div>
            <div className="h-4 w-full border-r-4 border-b-4 border-black">
              <div className="h-full w-8 border-r-4 border-black">
              </div>
            </div>
            <div className="h-4 w-full border-b-4 border-black">
              <div className="h-full w-9 border-r-4 border-l-4 ml-3 border-black">
              </div>
            </div>
          </div>    
        </div>
      </div>
    </>
  )
}

export default Brick
