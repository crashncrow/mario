import { createContext, useContext } from 'react'

// High-frequency state: anything that can change on every physics tick
// while something on screen is moving (Mario, enemies, mushrooms).
export const MotionContext = createContext(null)

export const useMotionContext = () => useContext(MotionContext)
