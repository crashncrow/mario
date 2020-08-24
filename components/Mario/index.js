import { useState, useRef, useEffect } from 'react'
import { useScrollPosition } from 'hooks/scroll'
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
  1: 'bg-red-600',
  2: 'bg-yellow-800',
  3: 'bg-orange-400'
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

const m4 =  m2

const ALLOWED_KEYS =  ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
const HORIZONTAL_KEYS =  ['ArrowLeft', 'ArrowRight']


const Mario = () =>{
  const [ reverse, setReverse ] = useState(false)
  const [ matrix1, setMatrix1 ] = useState(processFullArray(m1))
  const [ matrix2, setMatrix2 ] = useState(processFullArray(m2))
  const [ matrix3, setMatrix3 ] = useState(processFullArray(m3))
  
  const [ index, setIndex ] = useState(1)
  const [ m, setM ] = useState(matrix1)
  
  // useEffect(() => {
  //   setMatrix1(processFullArray(m1))
  //   setMatrix2(processFullArray(m2))
  //   setMatrix3(processFullArray(m3))
  // }, [])
  
  const { left, setLeft, bottom, setBottom } = useAppContext()

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
        //console.log('nooootreverse', prevPos, currPos)
        setReverse(false)
      }
      else if ((prevPos.x > currPos.x) && !reverse){
        //console.log('reverse', prevPos, currPos)
        setReverse(true)
      }

      setLeft(currPos.x + 100)
      setIndex(index + 1)
    },
    [positionsStore],
    null,
    true
  )

  // Element scroll position
  useScrollPosition(
    ({ currPos }) => positionsStore.setElementPosition(currPos),
    [],
    redBoxRef,
    false,
    300
  )

  // useMemo(
  //   () => (
  //     console.log(`X: ${positionsStore.getViewportX()} Y: ${positionsStore.getViewportY()}`)
  //   ),
  //   [positionsStore]
  // )

  // ***************************

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

  // const [pressedKeys, setPressedKeys] = useState([]);
  // useEffect(() => {
  //   // document.addEventListener('keydown', logKey);
  //   console.log(pressedKeys)
  //   pressedKeys.map( key => {
  //     if(HORIZONTAL_KEYS.includes(key)){
  //       handleClick()
  //       setIndex(index + 1)  
  //       if(key === 'ArrowLeft'){
  //         setLeft(left - 30)  
  //       } else {
  //         setLeft(left + 30)
  //       }
  //     }
  //   })
  // }, [pressedKeys])
  
  // useEffect(() => {
  //   const onKeyDown = (e) => {
  //       console.log(e)
  //       e.preventDefault()
  //       const key = e.code
  //       if (ALLOWED_KEYS.includes(key) && !pressedKeys.includes(key)) {
  //           setPressedKeys(previousPressedKeys => [...previousPressedKeys, key]);         
  //       }
  //   }
  //   const onKeyUp = ({key}) => {
  //       if (ALLOWED_KEYS.includes(key)) {
  //           setPressedKeys(previousPressedKeys => previousPressedKeys.filter(k => k !== key));
  //       }
  //   }
  //   document.addEventListener('keydown', onKeyDown);
  //   document.addEventListener('keyup', onKeyUp);
  //   return () => {
  //       document.removeEventListener('keydown', onKeyDown);
  //       document.removeEventListener('keyup', onKeyUp);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    <>
    <div className="fixed top-0" style={{width: '5000px'}}>
      <div ref={viewportRef}>
        <div>Deferred Rendering: {positionsStore.renderCount}</div>
        <div>Viewport: X: {positionsStore.getViewportX()} Y: {positionsStore.getViewportY()}</div>
        <div>Mario: X:{positionsStore.getElementX()} Y:{positionsStore.getElementY()}</div>
      </div>
    </div>

    <div 
      ref={redBoxRef} 
      className='flex flex-wrap m-auto w-16 absolute bottom-0 z-50 mb-16' 
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
