import { useAppContext } from 'contexts/AppContext'

const c = {
  0: '', // bg-transparent
  1: 'bg-black',
  2: 'bg-green-dark',
  3: 'bg-green-light'
}

const t1 = [
  0, 2, 0, 2,
  2, 0, 2, 0,
  0, 2, 0, 2,
  2, 0, 2, 0,
  0, 2, 0, 2,
  2, 0, 2, 0,
  0, 2, 0, 2,
  2, 0, 2, 0,
  0, 2, 0, 2,
  2, 0, 2, 0,
  0, 2, 0, 2
]

const t2 = [
  0, 2, 0,
  2, 0, 2,
  0, 2, 0,
  2, 0, 2,
  0, 2, 0,
  2, 0, 2,
  0, 2, 0,
  2, 0, 2,
  0, 2, 0,
  2, 0, 2,
  0, 2, 0,
  2, 0, 2,
  0, 2, 0,
  2, 0, 2,
  0, 2, 0,
  2, 0, 2
]

const Pipe = ({x, size}) => {
  const { pixels } = useAppContext()

  return (
    <div className="flex flex-wrap absolute w-32 bottom-0" style={{left: `${x * pixels}px`, bottom: `${pixels}px`}}>
      <div className="flex flex-wrap bg-green-light w-32 h-15 border-4 border-black pb-1">
        <div className="mt-1 w-5 mb-4 h-full border-t-4 border-r-8 border-green-dark"></div>
        <div className="flex flex-wrap mt-1 w-19 mb-4 ml-6 h-full border-t-4 border-l-4 border-green-dark">
          <div className="w-10 ml-2 h-full bg-green-dark"></div>
          <div className="flex flex-wrap w-4 h-full">
          {  
            t1.map((x, i) => 
              (
              <div 
                className={`h-1 w-1 border border-none ${c[x]}`}
                key={`pipe_top_${i}`}
                >
                </div>
              )
            )
          }
          </div>
        </div>
      </div>

      <div className={`bg-green-light w-32 h-${16*size} mx-2 border-l-4 border-r-4 border-t-4 border-black flex flex-wrap`}>
        <div className="ml-3 w-2 h-full bg-green-dark"></div>
        <div className="ml-5 w-1 h-full bg-green-dark"></div>
        <div className="ml-2 w-8 h-full bg-green-dark"></div>
        <div className="flex flex-wrap w-3 h-full">
        {  
          Array(size).fill(1).map((x, i) => (
            t2.map((x, j) => 
              (
              <div 
                className={`h-1 w-1 border border-none ${c[x]}`}
                key={`pipe_${i}${j}`}
                >
                </div>
              )
            )
          ))
        }
        </div>
      </div>
    </div>
  )
}

export default Pipe
