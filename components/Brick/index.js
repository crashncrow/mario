import { useState, useRef, useEffect } from 'react'
import { useAppContext } from 'contexts/AppContext'

const Brick = ({position, size}) => {
  const { objects, setObjects } = useAppContext()

  useEffect(() => {
    setObjects( objects.push( { x: position * 64, y: 16 * size, width: 64, height: 16 * size } ) )
  }, []);

  return (
    <>
    
      <div className={`flex flex-wrap absolute bg-brick-dark border-b-4 border-black bottom-0 mb-64`} style={{left: `${position * 64}px`, width:  `${size * 64}px`}}>
      {
      Array(size).fill(1).map((x, k) => (
        <div className="flex flex-wrap w-16 h-15" key={`bricks_${k}`}>
          <div className="h-full w-full border-t-4 border-brick-light">
            <div className="h-3 w-full border-r-4 border-b-4 border-black">
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
          ))
        }
      </div>
    
    </>
  )
}

export default Brick
