import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
  const [ left, setLeft ] = useState(100)
  const [ bottom, setBottom ] = useState(0)
  const [ objects, setObjects ] = useState([])
  const [ collision, setCollision ] = useState(false)

  const [ jump, setJump ] = useState(0)

  useEffect(() => {
    console.log(objects)
  }, [objects])

  useEffect(() => {
    console.log('bottom', bottom)
  }, [bottom])

  useEffect(() => {
    console.log('jump - prev', bottom)
    if(jump){
      setBottom(jump * 150)
    }
    else{
      setBottom(0)
    }
    console.log('jump - after', bottom)
  }, [jump])

  const j = (i) => {
    setJump(i)
    
    setTimeout(() => setJump(0), 200)
  }

  return (
    <AppContext.Provider
      value={{
        left: left,
        bottom: bottom,
        objects: objects,
        collision: collision,
        setLeft: setLeft,
        // setBottom: setBottom,
        setObjects: setObjects,
        setCollision: setCollision,
        jump: j
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
