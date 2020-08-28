import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
  const [left, setLeft] = useState(100)
  const [bottom, setBottom] = useState(0)
  const [objects, setObjects] = useState([])
  const [collision, setCollision] = useState(false)

  const [jump, setJump] = useState(0)

  // useEffect(() => {
  //   console.log('useEffect objects', objects)
  // }, [objects])

  
  useEffect(() => {
    console.log('bottom', bottom)
    // checkCollision(objects, 100, bottom)
  }, [bottom])

  useEffect(() => {
    console.log('jump - prev', bottom)
    if (jump) {
      console.log('BOTTOM 1', bottom)
      setBottom(bottom + (jump * 150))
      console.log('BOTTOM 2', bottom)
    } else {
      setBottom(64)
    }
    console.log('jump - after', bottom)
  }, [jump])

  const j = (i) => {
    setJump(i)

    setTimeout(() => setJump(0), 200)
  }

  const checkCollision = (x, y) => {
    let toco = false
    // const x = positionsStore.getViewportX() + 100
    // const y = height - 64

    console.log(objects)

    objects.map((obj,i) => {
      // console.log('X', x, (obj.x * 64),  (obj.x * 64) + obj.width)
      // console.log('Y', y, (obj.y * 64),  (obj.y * 64) + obj.height)

      if (x < (obj.x * 64) + obj.width &&
        x + 64 > (obj.x * 64) && 
        y >= (obj.y * 64) &&
        y <= (obj.y * 64) + obj.height) {
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
        jump: j
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
