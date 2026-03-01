import { useEffect, useState } from 'react'
import DebugPanel from 'components/ui/DebugPanel'
import Stats from 'components/ui/Stats'
import TouchControls from 'components/ui/TouchControls'

const CONTROLS_HINT_MS = 5000

const ControlsHint = ({ debug }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeoutId = setTimeout(() => setVisible(false), CONTROLS_HINT_MS)
    return () => clearTimeout(timeoutId)
  }, [])

  if (!visible) return null

  return (
    <div className={`${debug ? 'mt-2' : ''} hidden md:block p-4 bg-black/80 border-2 border-white text-[10px] leading-4 text-white text-center`}>
      <div>Controls</div>
      <div>← → move</div>
      <div>Space jump</div>
    </div>
  )
}

const GameHud = ({
  debug,
  debugPanelProps,
  gameLoopEnabled,
  setGameLoopEnabled,
  setLoopInput,
  coins,
  score,
  time,
  world,
  stage,
  gameStatus,
  loseReason,
  lives,
}) => {
  const showRespawnMessage = gameStatus === 'lost' && lives > 0
  const showTerminalMessage =
    gameStatus === 'won' ||
    (gameStatus === 'lost' && lives === 0)

  return (
    <>
      <Stats time={time} coins={coins} score={score} world={world} stage={stage} />

    <div
      className='fixed top-4 left-1/2 -translate-x-1/2 text-white flex flex-col items-center'
      style={{ zIndex: 60, top: 'max(5.5rem, calc(env(safe-area-inset-top) + 4rem))' }}
    >
      {debug && (
        <button
          type='button'
          className='px-3 py-2 bg-black/80 border-2 border-white text-xs'
          onClick={() => setGameLoopEnabled(enabled => !enabled)}
        >
          {gameLoopEnabled ? 'Juego ON' : 'Scroll libre'}
        </button>
      )}
      {gameLoopEnabled && gameStatus === 'playing' && (
        <ControlsHint key={`${gameLoopEnabled}-${gameStatus}`} debug={debug} />
      )}
      {showRespawnMessage && (
        <div className='mt-2 px-4 py-2 bg-black/85 border-2 border-white text-white text-sm'>
          MARIO DIED - {lives} LEFT
        </div>
      )}
      {showTerminalMessage && (
        <div className='mt-2 px-4 py-2 bg-black/85 border-2 border-white text-white text-sm'>
          {gameStatus === 'won'
            ? 'WIN'
            : (loseReason === 'fall' || loseReason === 'enemy')
              ? 'GAME OVER'
              : 'TIME UP'}
        </div>
      )}
    </div>

      {debug && <DebugPanel {...debugPanelProps} />}
      <TouchControls gameLoopEnabled={gameLoopEnabled} setLoopInput={setLoopInput} />
    </>
  )
}

export default GameHud
