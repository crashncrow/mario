import { memo } from 'react'
import { processFullArray } from 'libs/pixless'

const c = {
  0: '',//bg-transparent
  1: 'bg-black',
  2: 'bg-green-light',
  3: 'bg-green-dark',
}

const m1 = [
  [ 0, 0, 0, 0, 0, 1, 1, 1 ],
  [ 0, 0, 0, 0, 1, 2, 2, 2 ],
  [ 0, 0, 0, 1, 2, 2, 2, 2 ],
  [ 0, 0, 0, 2, 2, 2, 2, 2 ],
  [ 0, 1, 1, 2, 2, 2, 2, 2 ],
  [ 1, 2, 2, 2, 2, 2, 2, 2 ],
  [ 1, 2, 2, 2, 2, 2, 2, 2 ],
  [ 0, 1, 2, 2, 2, 2, 2, 2 ]
]

const m2 = [
  [ 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0 ],
  [ 0, 0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0 ],
  [ 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 0, 0 ],
  [ 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0 ],
  [ 0, 0, 1, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 1 ],
  [ 0, 1, 2, 2, 2, 3, 3, 2, 2, 2, 3, 2, 2, 2, 2, 1 ],
  [ 1, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1 ],
]

const m3 = [
  [ 1, 0, 0, 1, 0, 0, 0, 0 ],
  [ 1, 0, 1, 2, 1, 0, 0, 0 ],
  [ 2, 1, 2, 2, 1, 0, 0, 0 ],
  [ 2, 2, 2, 2, 1, 0, 1, 0 ],
  [ 2, 2, 2, 2, 2, 1, 2, 1 ],
  [ 2, 2, 2, 2, 2, 2, 2, 1 ],
  [ 2, 2, 2, 2, 2, 2, 2, 1 ],
  [ 2, 2, 2, 2, 2, 2, 1, 0 ]
]

const matrix1Static = processFullArray(m1)
const matrix2Static = processFullArray(m2)
const matrix3Static = processFullArray(m3)

const Bush = ({x, size, pixels}) => {
  return (
    <div className={`flex flex-wrap absolute w-${16 + (16 * size)} bottom-0 ml-8 mb-16`} style={{left: `${x * pixels}px`}}>
      <div className="flex flex-wrap w-8  mt-8">
      {matrix1Static.map((x, i) => (
        x.map((y, j) => (
          <div 
          className={`h-1 w-${y.count} border-none flex-none ${c[y.color]}`}
          key={`bush_1_${i}${j}`}
          >
          </div>
        ))
      ))}
      </div>

      {
      Array(size).fill(1).map((x, i) => (
      <div className="flex flex-wrap w-16" key={`bush_2_${i}`}>
        {matrix2Static.map((x, i) => (
          x.map((y, j) => (
            <div 
            className={`h-1 w-${y.count} border-none flex-none ${c[y.color]}`}
            key={`bush_2_${i}${j}`}
            >
            </div>
          ))
        ))}
        <div className="h-8 w-full bg-green-light"></div>
      </div>
      ))
      }

      <div className="flex flex-wrap w-8 mt-8">
      {matrix3Static.map((x, i) => (
        x.map((y, j) => (
          <div 
          className={`h-1 w-${y.count} border-none flex-none ${c[y.color]}`}
          key={`bush_3_${i}${j}`}
          >
          </div>
        ))
      ))}
      </div>
    </div>
  )
}

export default memo(Bush)
