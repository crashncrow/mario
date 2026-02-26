import { useEffect, useRef, useState } from 'react'
import { useAppContext } from 'contexts/AppContext'

const Box = ({ x, y, touches = 0 }) => {
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
        className={`flex flex-wrap absolute bottom-0 ${isBumping ? 'mb-2' : ''}`}
        style={{left: `${x * pixels}px`, bottom: `${(y * pixels)}px`}}
      >
        <div className='flex flex-wrap w-16 h-16'>
          <div className='w-14 h-1 ml-1 mr-1 bg-brick-dark'></div>
          <div className='flex flex-wrap h-15 w-full border-r-4 border-b-4 border-black'>
            <div className='w-1 h-full bg-brick-dark'></div>
            <div className={`flex flex-wrap w-14 h-full bg-box-yellow  ${touches === 0 ? 'animate-pulse' : ''}`}>
              <div className='w-1 h-12 border-t-4 border-b-4 border-black m-1'></div>
              <div className='w-8 h-full'></div>
              <div className='w-1 h-12 border-t-4 border-b-4 border-black m-1'></div>
            </div>
          </div>
          {
            touches === 0 &&
            <>
            <div className='absolute w-5 h-1 mt-3 ml-5 mr-1 bg-brick-dark'></div>
            <div className='absolute w-7 h-3 mt-4 ml-4 border-l-8 border-r-8 border-brick-dark'>
              <div className='w-full h-full border-l-4 border-t-4 border-black'></div>
            </div>
            <div className='absolute w-3 h-1 bg-brick-dark top-0 right-0 mt-7 mr-5'></div>
            <div className='absolute w-3 h-4 border-b-4 border-r-4 border-black top-0 right-0 mt-5 mr-4'></div>
            <div className='absolute w-2 h-5 border-b-8 border-t-8 border-black top-0 left-0 mt-9 ml-8'></div>
            <div className='absolute w-2 h-5 border-b-8 border-t-8 border-brick-dark top-0 left-0 mt-8 ml-7'></div>
            </>
          }
        </div>
      </div>
    </>
  )
}

export default Box
