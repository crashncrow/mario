import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
  const [ left, setLeft ] = useState(100)
  const [ bottom, setBottom ] = useState(0)
  const [ objects, setObjects ] = useState([])
  const [ collision, setCollision ] = useState(false)

  useEffect(() => {
    console.log(objects)
  }, [objects])

  useEffect(() => {
    console.log('bottom', bottom)
  }, [bottom])

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
        setCollision: setCollision
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
