import { createContext, useContext, useState, useEffect } from 'react'
import { useWindowDimensions } from 'hooks/window'

const AppContext = createContext(null)
const pixels = 64

export const AppContextProvider = ({ children }) => {
  const { width } = useWindowDimensions();

  const [ objects, setObjects ] = useState([])

  const [ left, setLeft ] = useState(100)
  const [ bottom, setBottom ] = useState(pixels)
  
  const [ collision, setCollision ] = useState(false)
  
  const [ canJump, setCanJump ] = useState(true)
  const [ canWalkLeft, setCanWalkLeft ] = useState(true)
  const [ canWalkRight, setCanWalkRight ] = useState(true)
  const [ jumping, setJumping ] = useState(false)
  const [ renderLimit, setRenderLimit ] = useState(2000)


  useEffect(() => {
    console.log('W', width)
    setRenderLimit(left + width + 500)
  }, [])

  useEffect(() => {
    if (!checkCollision(left, bottom) && left > 100 && !jumping) {
      setBottom(bottom => bottom - pixels)
    }
  }, [bottom])

  useEffect(() => {
    if (!checkCollision(left, bottom) && left > 100 && !jumping) {
      setBottom(bottom => bottom - pixels)
    }

    if(left + width + 500 > renderLimit) {
      setRenderLimit(left + width + 50000)
    }

  }, [left])

  useEffect(() => {
    if (!checkCollision(left, bottom) && left > 100 && !jumping) {
      setBottom(bottom => bottom - pixels)
    }
  }, [jumping])

  const checkCollision = (x, y) => {
    let toco = false
    let walkLeft = true
    let walkRight = true

    let objs = [...objects]

    objs.map((obj, i) => {
      // console.log('X', x, (obj.x * pixels),  (obj.x * pixels) + obj.width)
      // console.log('Y', y, (obj.y * pixels),  (obj.y * pixels) + obj.height)

      if (
        x + 10 < obj.x * pixels + obj.width &&
        x + pixels - 20 > obj.x * pixels &&
        y >= obj.y * pixels &&
        y <= obj.y * pixels + obj.height
      ) {

        if (obj.type !== 'Floor') {
          console.log('YYY', obj.type , y, (obj.y * pixels) + obj.height)
          if(y >= (obj.y * pixels) + obj.height){
            console.log('ARRIBA')
          }
          else {
            if(typeof obj.touches !== undefined){
              obj.touches++
            }

            if (x + pixels < (obj.x * pixels) + obj.width) {
              console.log('VIENE DE IZQ, NO PUEDE SEGUIR A LA DER')
              walkRight = false
            }
  
            if (x > obj.x * pixels) {
              console.log('VIENE DE DER, NO PUEDE SEGUIR A LA IZQ')
              walkLeft = false
            }
          }
        }

        if(!collision) {
          setCollision(true)
        }
        
        if(obj.type !== 'Floor') {
          console.log('COLLISION')
        }

        toco = true
      }
    })

    if (!toco) {
      setCollision(false)
      setCanJump(false)
    } else {
      setObjects(objs)
      setCanJump(true)
    }

    if(walkLeft !== canWalkLeft){
      setCanWalkLeft(walkLeft)
    }

    if(walkRight !== canWalkRight){
      setCanWalkRight(walkRight)
    }
    
    return toco
  }

  return (
    <AppContext.Provider
      value={{
        debug: false,
        pixels: pixels,

        left: left,
        bottom: bottom,
        objects: objects,

        canJump: canJump,
        collision: collision,

        canWalkLeft: canWalkLeft,
        canWalkRight: canWalkRight,

        renderLimit: renderLimit, 
        
        setLeft: setLeft,
        setBottom: setBottom,
        setObjects: setObjects,
        checkCollision: checkCollision,
        setJumping: setJumping
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
