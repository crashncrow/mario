import { useEffect, useRef, useState } from 'react'
import { useAppContext } from 'contexts/AppContext'

const Brick = ({x, y, touches, black = false, border = true}) => {
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
        className={`flex flex-wrap absolute ${black ? 'bg-black' : 'bg-brick-dark'} border-b-4 border-black bottom-0 ${isBumping ? 'mb-2' : ''}`} 
        style={{left: `${x * pixels}px`, bottom: `${(y * pixels)}px`}}>

        <div className="flex flex-wrap w-16 h-15" >
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
