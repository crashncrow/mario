import Stats from 'components/ui/Stats'

const COLORS = {
  0: '',
  1: 'bg-smb-red',
  2: 'bg-smb-brown',
  3: 'bg-smb-skin',
}

const MARIO_ICON = [
  [0, 0, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [0, 2, 2, 3, 3, 2, 3, 0],
  [2, 3, 2, 3, 3, 3, 2, 3],
  [2, 3, 2, 2, 3, 3, 1, 2],
  [2, 2, 1, 1, 3, 3, 2, 2],
  [0, 3, 3, 3, 3, 3, 3, 0],
  [2, 2, 1, 2, 2, 1, 2, 2],
  [2, 2, 1, 1, 1, 1, 2, 2],
  [3, 2, 1, 3, 1, 3, 1, 2],
  [3, 3, 1, 1, 1, 1, 1, 3],
  [0, 1, 1, 0, 0, 1, 1, 0],
]

const MarioLifeIcon = () => (
  <div className='grid h-12 w-8 grid-cols-8'>
    {MARIO_ICON.flatMap((row, rowIndex) => (
      row.map((cell, colIndex) => (
        <div
          key={`intro_mario_${rowIndex}_${colIndex}`}
          className={`h-1 w-1 ${COLORS[cell]}`}
        ></div>
      ))
    ))}
  </div>
)

const LevelIntroScreen = ({ visible, world, stage, lives, time, coins, score }) => {
  if (!visible) return null

  return (
    <div className='fixed inset-0 z-90 flex items-center justify-center bg-black text-white pointer-events-none'>
      <Stats time={time} coins={coins} score={score} world={world} stage={stage} />
      <div className='flex flex-col items-center gap-10 text-center'>
        <div className='text-3xl'>WORLD&nbsp;&nbsp;{world}-{stage}</div>
        <div className='flex items-center gap-6 text-3xl'>
          <MarioLifeIcon />
          <span>x</span>
          <span>{lives}</span>
        </div>
      </div>
    </div>
  )
}

export default LevelIntroScreen
