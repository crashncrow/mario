import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
  const [left, setLeft] = useState(100)
  const [bottom, setBottom] = useState(64)
  const [objects, setObjects] = useState([])
  const [collision, setCollision] = useState(false)

  const [jump, setJump] = useState(0)

  useEffect(() => {
    // console.log('bottom', bottom)
    checkCollision(left, bottom)
  }, [bottom])

  useEffect(() => {
    // console.log('left', left)
    
    if(!checkCollision(left, bottom) && left > 100){
      setBottom(bottom - 64)
    }
  }, [left])

  const checkCollision = (x, y) => {
    let toco = false
    // console.log('CHECK COLLISIONS')
    // console.log(objects)

    objects.map((obj,i) => {
      // console.log('X', x, (obj.x * 64),  (obj.x * 64) + obj.width)
      // console.log('Y', y, (obj.y * 64),  (obj.y * 64) + obj.height)

      if (
        x < (obj.x * 64) + obj.width && x + 64 > (obj.x * 64) && 
        y >= (obj.y * 64) && y <= (obj.y * 64) + obj.height) {
         setCollision(true)
         console.log('COLLISION')
         toco = true
      }
    })

    if(!toco){
        setCollision(false)
    }
    
    return toco
  }

  return (
    <AppContext.Provider
      value={{
        left: left,
        bottom: bottom,
        objects: objects,
        collision: collision,
        setLeft: setLeft,
        setBottom: setBottom,
        setObjects: setObjects,
        checkCollision: checkCollision,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
