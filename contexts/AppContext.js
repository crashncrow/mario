import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
  const [debug] = useState(false)
  const [left, setLeft] = useState(100)
  const [bottom, setBottom] = useState(64)
  const [objects, setObjects] = useState([])
  const [collision, setCollision] = useState(false)

  const [jumping, setJumping] = useState(false)
 
  const [jump, setJump] = useState(0)

  useEffect(() => {
    if(!checkCollision(left, bottom) && left > 100  && !jumping){
      setBottom(bottom => bottom - 64)
    }
  }, [bottom])

  useEffect(() => {    
    if(!checkCollision(left, bottom) && left > 100 && !jumping){
      setBottom(bottom => bottom - 64)
    }
  }, [left])

  useEffect(() => {    
    if(!checkCollision(left, bottom) && left > 100 && !jumping){
      setBottom(bottom => bottom - 64)
    }
  }, [jumping])

  const checkCollision = (x, y) => {
    let toco = false
    // console.log('CHECK COLLISIONS')
    console.log(objects)
    let objs = [...objects]

    objs.map((obj,i) => {
      // console.log('X', x, (obj.x * 64),  (obj.x * 64) + obj.width)
      // console.log('Y', y, (obj.y * 64),  (obj.y * 64) + obj.height)

      if (
        x < (obj.x * 64) + obj.width && x + 64 > (obj.x * 64) && 
        y >= (obj.y * 64) && y <= (obj.y * 64) + obj.height) {
          
          if(obj.type === 'Brick' || obj.type === 'Box'){
            obj.touches++
          }
         setCollision(true)
         console.log('COLLISION')
         toco = true
      }
    })

    if(!toco){
        
        setCollision(false)
    }
    else{
      setObjects(objs)
    }
    
    return toco
  }

  return (
    <AppContext.Provider
      value={{
        debug: debug,
        left: left,
        bottom: bottom,
        objects: objects,
        collision: collision,
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
