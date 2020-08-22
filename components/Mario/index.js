import { useState } from 'react'
import { useEffect } from 'react'

const c = {
  0: 'bg-transparent',
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
  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
  0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 2, 3, 0, 0, 0, 0,
  0, 0, 0, 0, 2, 3, 2, 3, 3, 3, 2, 3, 3, 3, 0, 0,
  0, 0, 0, 0, 2, 3, 2, 2, 3, 3, 3, 2, 3, 3, 3, 0,
  0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 0, 0,
  0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0,
  0, 0, 0, 2, 2, 2, 2, 1, 1, 2, 2, 0, 0, 0, 0, 0,
  0, 3, 3, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 3, 3, 3,
  0, 3, 3, 3, 0, 2, 2, 1, 3, 1, 1, 1, 2, 2, 3, 3,
  0, 3, 3, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 2, 0,
  0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0,
  0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0,
  0, 0, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 0,
  0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]

const m2 = [
  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
  0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 2, 3, 0, 0, 0, 0,
  0, 0, 0, 0, 2, 3, 2, 3, 3, 3, 2, 3, 3, 3, 0, 0,
  0, 0, 0, 0, 2, 3, 2, 2, 3, 3, 3, 2, 3, 3, 3, 0,
  0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 0, 0,
  0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 0, 2, 2, 1, 1, 2, 2, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 2, 2, 2, 2, 1, 1, 2, 2, 0, 0, 0, 0,
  0, 0, 0, 0, 2, 2, 2, 1, 1, 3, 1, 1, 3, 0, 0, 0,
  0, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0,
  0, 0, 0, 0, 1, 2, 2, 3, 3, 3, 1, 1, 1, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 2, 3, 3, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0
]

const m3 = [
  0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
  0, 0, 0, 0, 0, 2, 2, 2, 3, 3, 2, 3, 0, 0, 0, 0,
  0, 0, 0, 0, 2, 3, 2, 3, 3, 3, 2, 3, 3, 3, 0, 0,
  0, 0, 0, 0, 2, 3, 2, 2, 3, 3, 3, 2, 3, 3, 3, 0,
  0, 0, 0, 0, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 0, 0,
  0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0, 0,
  0, 0, 0, 0, 0, 2, 2, 2, 2, 1, 2, 0, 3, 0, 0, 0,
  0, 0, 0, 0, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 0, 0,
  0, 0, 0, 3, 3, 1, 2, 2, 2, 2, 2, 3, 3, 0, 0, 0,
  0, 0, 0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0,
  0, 0, 2, 2, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0,
  0, 0, 2, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]

const m4 =  m2

const ALLOWED_KEYS =  ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

const Mario = () =>{
  const [m, setM] = useState(m1)
  const [index, setIndex] = useState(1)
  const [left, setLeft] = useState(100)
  const [pressedKeys, setPressedKeys] = useState([]);
  
  const handleClick = () =>
  {
    setIndex(index < 4 ? index + 1 : 1)
    setLeft(left + 20)
  }

  useEffect(() => {
    // console.log(index)
    if(index == 1){
      setM(m2)
    }
    else if(index == 2){
      setM(m3)
    }
    else if(index == 3){
      setM(m4)
    }
    else{
      setM(m1)
    }
  }, [index])

  // useEffect(() => {
  //   document.addEventListener('keydown', logKey);
  // }, [])
  
  // function logKey(e) {
  //   //e.preventDefault()
  //   handleClick()
  //   console.log(e.code);
  //   //setIndex(index + 1)
  // }

  useEffect(() => {
    const onKeyDown = ({key}) => {
        if (ALLOWED_KEYS.includes(key) && !pressedKeys.includes(key)) {
            setPressedKeys(previousPressedKeys => [...previousPressedKeys, key]);
        }
    }

    const onKeyUp = ({key}) => {
        if (ALLOWED_KEYS.includes(key)) {
            setPressedKeys(previousPressedKeys => previousPressedKeys.filter(k => k !== key));
        }
    }

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    return () => {
        document.removeEventListener('keydown', onKeyDown);
        document.removeEventListener('keyup', onKeyUp);
    }
  }, []);

  return (
    <>
    
    <button className="bg-white fixed rounded px-10 m-10" onClick={handleClick} >GO!</button>
    <div className='flex flex-wrap m-auto w-16 absolute bottom-0 z-50 mb-12 left-32' style={{left: `${left}px`}}>
    
      {m.map((x, i) => (
        <div 
          className={`h-1 w-1 border-none flex-none ${c[x]}`}
          key={`mario_${index}_${i}`}
          >
          </div>
      ))}
      {/* {pressedKeys.map(e => <span key={e} className="key">{e}</span>)} */}
    </div>
    </>

  )
}

export default Mario
