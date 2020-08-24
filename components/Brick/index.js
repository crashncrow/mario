import {processFullArray} from 'libs/pixless'
import { useState, useEffect } from 'react'

const c = {
  0: '', // bg-transparent
  1: 'bg-black',
  2: 'bg-yellow-200',
}

const m = [
  [ 0, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 2, 2, 2, 2, 0 ],
  [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 1 ],
  [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 1 ],
  [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 1 ],
  [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0, 1 ],
  [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0 ],
  [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1 ],
  [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 1 ],
  [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 1 ],
  [ 2, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 1 ],
  [ 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1 ],
  [ 2, 2, 1, 1, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1 ],
  [ 2, 0, 2, 2, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 1 ],
  [ 2, 0, 0, 0, 2, 2, 2, 1, 2, 0, 0, 0, 0, 0, 0, 1 ],
  [ 2, 0, 0, 0, 0, 0, 0, 1, 2, 0, 0, 0, 0, 0, 1, 1 ],
  [ 0, 1, 1, 1, 1, 1, 1, 0, 2, 1, 1, 1, 1, 1, 1, 3 ]
]

const Brick = ({render}) => {
  const [matrix, setMatrix ] = useState([])
  
  useEffect(() => {
    setMatrix(processFullArray(m))
  }, [])

  return (
    <>
    <div className={`flex flex-wrap w-16 bg-orange-500 mb-0`}>
      <div className="flex flex-wrap w-16 h-16">
        <div className="w-10 h-15 b">
          <div className="w-full h-10 border-r-4 border-black">
            <div className="h-1 border-l-4 border-orange-500 bg-yellow-200"></div>
            <div className="h-9 border-l-4 border-yellow-200"></div>
          </div>
          <div className="w-full h-2 border-r-4 border-yellow-200">
            <div className="flex flex-wrap w-full h-2 border-r-4 border-black">
              <div className="w-2 h-2 border-t-4 border-black bg-yellow-200"></div>
              <div className="w-2 h-2 border-b-4 border-black "></div>
            </div>
          </div>

          <div className="w-full h-3">
            <div className="w-9 h-3 border-l-4 border-r-4 border-yellow-200 pl-1">
              <div className="h-1 bg-yellow-200 pl-2">
                <div className="h-3 bg-black pt-1 pr-1">
                  <div className="h-2 bg-yellow-200 border-b-4 border-orange-500">
                  </div>    
                
                </div>  
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-6">
          <div className="h-1 w-full border-l-4 border-r-4 border-orange-500 bg-yellow-200"></div>
          <div className="h-4 w-5 border-l-4 border-yellow-200">
            <div className="h-4 w-5 border-r-4 border-black">
              <div className="pt-3 h-1 w-1 border-b-4 border-black"></div>
            </div>
          </div>
          <div className="h-1 w-full border-l-4 border-r-4 border-orange-500 bg-black"></div>
          <div className="h-9 w-full border-r-4 border-black">
            <div className="h-4 w-full border-l-4 border-t-4 border-yellow-200"></div>
            <div className="h-1 w-1 ml-4 mt-4 bg-black"></div>
          </div>
        </div>
        
        <div className="flex flex-wrap w-full h-1 border-l-4 border-r-4 border-orange-500 bg-black">
          <div className="ml-6 h-1 w-1 bg-orange-500"></div>
          <div className="h-1 w-1 bg-yellow-200"></div>
        </div>
      </div>
    </div>
    {/* <div className={`flex flex-wrap m-auto w-16 ${render && 'bg-orange-500'}`}>
      {
        matrix.map((x, i) => (
          x.map((y, j) => (
            <div 
              className={`h-1 w-${y.count} border-none flex-none ${render ? c[y.color] : c[render]}`}
              key={`mario_${i}${j}`}
              >
            </div>
          ))
        ))
      }
    </div> */}
    </>
  )
}

export default Brick
