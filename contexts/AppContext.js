import React, { createContext, useContext, useEffect, useState } from 'react'

const AppContext = createContext(null)

export const AppContextProvider = ({ children }) => {
  const [left, setLeft] = useState(100)
  const [bottom, setBottom] = useState(0)

  return (
    <AppContext.Provider
      value={{
        left: left,
        bottom: bottom,
        setLeft: setLeft,
        setBottom: setBottom
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => useContext(AppContext)
