import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
  const [left, setLeft] = useState(100)
  const [bottom, setBottom] = useState(0)
  const [objects, setObjects] = useState([])

  useEffect(() => {
    console.log(objects)
  }, [objects]);


  return (
    <AppContext.Provider
      value={{
        left: left,
        bottom: bottom,
        objects: objects,
        setLeft: setLeft,
        setBottom: setBottom,
        setObjects: setObjects
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
