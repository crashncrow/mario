import DebugPanel from 'components/DebugPanel'
import Stats from 'components/Stats'

const GameHud = ({
  debug,
  debugPanelProps,
  gameLoopEnabled,
  setGameLoopEnabled,
}) => (
  <>
    <Stats />

    <div
      className='fixed top-4 left-1/2 -translate-x-1/2 text-white flex flex-col items-center'
      style={{ zIndex: 60 }}
    >
      <button
        type='button'
        className='px-3 py-2 bg-black/80 border-2 border-white text-xs'
        onClick={() => setGameLoopEnabled(enabled => !enabled)}
      >
        {gameLoopEnabled ? 'Juego ON' : 'Scroll libre'}
      </button>
      {gameLoopEnabled && (
        <div className='mt-2 p-2 bg-black/80 border-2 border-white text-[10px] leading-4 text-white text-center'>
          <div>Controles</div>
          <div>← → mover</div>
          <div>Space saltar</div>
          <div>Click / doble click tambien</div>
        </div>
      )}
    </div>

    {debug && <DebugPanel {...debugPanelProps} />}
  </>
)

export default GameHud
