import DebugPanel from 'components/DebugPanel'
import Stats from 'components/Stats'
import TouchControls from 'components/TouchControls'

const GameHud = ({
  debug,
  debugPanelProps,
  gameLoopEnabled,
  setGameLoopEnabled,
  setLoopInput,
  time,
  gameStatus,
}) => (
  <>
    <Stats time={time} />

    <div
      className='fixed top-4 left-1/2 -translate-x-1/2 text-white flex flex-col items-center'
      style={{ zIndex: 60, top: 'max(1rem, env(safe-area-inset-top))' }}
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
      {gameLoopEnabled && (
        <div className={`${debug ? 'mt-2' : ''} p-2 bg-black/80 border-2 border-white text-[10px] leading-4 text-white text-center`}>
          <div>Controles</div>
          <div>← → mover</div>
          <div>Space saltar</div>
          <div>Click / doble click tambien</div>
        </div>
      )}
      {gameStatus !== 'playing' && (
        <div className='mt-2 px-4 py-2 bg-black/85 border-2 border-white text-white text-sm'>
          {gameStatus === 'won' ? 'WIN' : 'TIME UP'}
        </div>
      )}
    </div>

    {debug && <DebugPanel {...debugPanelProps} />}
    <TouchControls gameLoopEnabled={gameLoopEnabled} setLoopInput={setLoopInput} />
  </>
)

export default GameHud
