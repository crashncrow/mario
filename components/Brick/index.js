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
    <div className={`flex flex-wrap m-auto w-16 ${render && 'bg-orange-500'}`}>
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
    </div>
  )
}

export default Brick
