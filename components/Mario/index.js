import { useState, useRef, useEffect } from 'react'
import { useScrollPosition } from 'hooks/scroll'
import { useWindowDimensions } from 'hooks/window'
import { useAppContext } from 'contexts/AppContext'
import { processFullArray } from 'libs/pixless'

const PositionStore = () => {
  const [renderCount, triggerReRender] = useState(0)
  const elementPosition = useRef({ x: 10, y: 150 })
  const viewportPosition = useRef({ x: 0, y: 0 })
  let throttleTimeout = null

  const getPos = (el, axis) => Math.round(el.current[axis])

  const setPos = (el, pos) => {
    el.current = pos
    if (throttleTimeout !== null) return
    // Only re-render the component every 0.3s
    throttleTimeout = setTimeout(() => triggerReRender(renderCount + 1), 300)
  }

  return {
    getElementX: () => getPos(elementPosition, 'x'),
    getElementY: () => getPos(elementPosition, 'y'),
    getViewportX: () => getPos(viewportPosition, 'x'),
    getViewportY: () => getPos(viewportPosition, 'y'),
    setElementPosition: pos => setPos(elementPosition, pos),
    setViewportPosition: pos => setPos(viewportPosition, pos),
    renderCount
  }
}


const c = {
  0: '', // bg-transparent
  1: 'bg-mario-red',
  2: 'bg-mario-brown',
  3: 'bg-mario-skin'
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

const size = 64

const Mario = () =>{
  const { height } = useWindowDimensions();
  const { debug, left, setLeft, bottom, collision } = useAppContext()

  const [ reverse, setReverse ] = useState(false)
  const [ matrix1 ] = useState(processFullArray(m1))
  const [ matrix2 ] = useState(processFullArray(m2))
  const [ matrix3 ] = useState(processFullArray(m3))
  
  const [ index, setIndex ] = useState(1)
  const [ m, setM ] = useState(matrix1)

  const positionsStore = PositionStore()
  const viewportRef = useRef(null)
  const redBoxRef = useRef(null)

  // Viewport scroll position
  useScrollPosition(
    ({ prevPos, currPos }) => {
      positionsStore.setViewportPosition(currPos)
      const { style } = viewportRef.current
      style.top = `${150 + currPos.y}px`
      style.left = `${10 + currPos.x}px`


      if((prevPos.x < currPos.x) && reverse){
        setReverse(false)
        
      }
      else if ((prevPos.x > currPos.x) && !reverse){
        setReverse(true)
        
      }

      // if(!reverse){
      //   setLeft(left + 30)
      // }
      // else{
      //   setLeft(left - 30)
      // }

      setLeft(currPos.x + 100)
      
      //if(!collision){
        //setLeft(left + 20)
      //}

      setIndex(index + 1)
    },
    [positionsStore],
    null,
    true
  )

  // Element scroll position
  useScrollPosition(
    ({ currPos }) => {
      positionsStore.setElementPosition(currPos)
    },
    [],
    redBoxRef,
    false,
    300
  )

  // const scrollHandler = _ => {
  //   console.log('scrollHandler', left)
  //   // // const x = left;
  //   // const x = positionsStore.getViewportX() + 100 // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ---------------
  //   // const y = height - bottom - size
  //   // checkCollision(left, bottom + 64)
  // }

  // useEffect(() => {
  //   window.addEventListener("scroll", scrollHandler, true);
  //   return () => {
  //     window.removeEventListener("scroll", scrollHandler, true);
  //   };
  // }, [left]);

  useEffect(() => {
    if(index % 4 == 1){
      setM(matrix2)
    }
    else if(index % 4 == 2){
      setM(matrix3)
    }
    else if(index % 4 == 3){
      setM(matrix2)
    }
    else{
      setM(matrix1)
    }
  }, [index])

  return (
    <>
    { 
      debug && <div id="border_mario"
      className='absolute border-4 border-mario-red z-50'
      style={{
        bottom: `${bottom}px`,
        left: `${left}px`,
        height: `${size}px`,
        width: `${size}px`
      }}
    ></div>
    }
    <div className="hidden fixed top-0" style={{width: '5000px'}}>
      <div ref={viewportRef}>
        <div>Deferred Rendering: {positionsStore.renderCount}</div>
        <div>Viewport: X: {positionsStore.getViewportX()} Y: {positionsStore.getViewportY()}</div>
        <div>Mario: X:{positionsStore.getElementX()} Y:{positionsStore.getElementY()}</div>
      </div>
    </div>

    <div 
      ref={redBoxRef} 
      className={`flex flex-wrap w-16 absolute bottom-0 z-50 ${collision && debug? 'bg-black' : ''}`}
      style={{left: `${left}px`, bottom: `${bottom}px`}}>

      {m.map((x, i) => {
        if(reverse){
          // reverse without mutate
          return x.slice().reverse().map((y, j) => (
            <div 
            className={`h-1 w-${y.count} flex-none ${c[y.color]}`}
            key={`mario_${i}${j}`}
            >
            </div>
          ))
        }
        else{
          return x.map((y, j) => (
            <div 
            className={`h-1 w-${y.count} flex-none ${c[y.color]}`}
            key={`mario_${i}${j}`}
            >
            </div>
          ))
        }
      }
      )}
    </div>
    </>
  )
}

export default Mario
