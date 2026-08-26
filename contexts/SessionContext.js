import { createContext, useContext } from 'react'

// Low-frequency state: HUD/session/game-flow values that only change on
// discrete events (coin pickup, once-a-second timer tick, pause, level
// transition) — not on every physics frame.
export const SessionContext = createContext(null)

export const useSessionContext = () => useContext(SessionContext)
